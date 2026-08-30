import {
  HSV_GROUP_THRESHOLD,
  H_BUCKET_COUNT,
  SATURATION_THRESHOLD,
} from '../backgroundDetection/thresholds';
import { type HSVColor, hsvDistanceSquared, rgbToHsv } from './hsv';
import { type RGBColor } from './rgb';

/** 每个色相桶的边界组索引，-1 表示该桶为空。 */
type BucketBoundary = { first: number; last: number };

const H_BUCKET_WIDTH = 360 / H_BUCKET_COUNT;
const HSV_GROUP_THRESHOLD_SQUARED = HSV_GROUP_THRESHOLD ** 2;

/** 计算一组分组数组的平均 HSV */
const averageHsvOfGroups = (
  groupArrays: readonly (readonly number[])[],
  hsvColors: readonly HSVColor[],
): HSVColor => {
  const sum = { h: 0, s: 0, v: 0 };
  let count = 0;
  for (const group of groupArrays) {
    for (const index of group) {
      sum.h += hsvColors[index].h;
      sum.s += hsvColors[index].s;
      sum.v += hsvColors[index].v;
      count += 1;
    }
  }

  if (count === 0) return { h: 0, s: 0, v: 0 };
  return {
    h: sum.h / count,
    s: sum.s / count,
    v: sum.v / count,
  };
};

/**
 * 无彩桶：按 V 从小到大排序，贪心分段。
 * 因为只比较亮度，排序后区间最大亮度差就是首尾亮度差。
 */
const groupAchromatic = (
  indices: readonly number[],
  hsvColors: readonly HSVColor[],
): number[][] => {
  if (indices.length === 0) return [];

  const ordered = indices.toSorted((a, b) => hsvColors[a].v - hsvColors[b].v);
  const groups: number[][] = [];
  let start = 0;

  for (let end = 1; end <= ordered.length; end++) {
    if (
      end === ordered.length ||
      hsvColors[ordered[end]].v - hsvColors[ordered[start]].v >
        HSV_GROUP_THRESHOLD
    ) {
      groups.push(ordered.slice(start, end));
      start = end;
    }
  }

  return groups;
};

/**
 * 彩色桶：桶内 H 已相近，按 V 从小到大排序后贪心分组。
 * 每次扩展新点时检查它与当前组内所有点的综合距离。
 */
const groupChromatic = (
  indices: readonly number[],
  hsvColors: readonly HSVColor[],
): number[][] => {
  if (indices.length === 0) return [];

  const ordered = indices.toSorted((a, b) => hsvColors[a].v - hsvColors[b].v);
  const groups: number[][] = [];
  let current: number[] = [ordered[0]];

  for (let i = 1; i < ordered.length; i++) {
    const index = ordered[i];
    let maxDistSquared = 0;
    for (const existing of current) {
      maxDistSquared = Math.max(
        maxDistSquared,
        hsvDistanceSquared(hsvColors[index], hsvColors[existing]),
      );
    }

    if (maxDistSquared <= HSV_GROUP_THRESHOLD_SQUARED) {
      current.push(index);
    } else {
      groups.push(current);
      current = [index];
    }
  }

  groups.push(current);
  return groups;
};

/** 对代表色执行 HSV 分桶分组 */
export const groupColorsByHsv = (colors: readonly RGBColor[]): number[][] => {
  if (colors.length === 0) return [];

  const hsvColors = colors.map(rgbToHsv);
  const grayIndices: number[] = [];
  const buckets: number[][] = Array.from({ length: H_BUCKET_COUNT }, () => []);

  for (let i = 0; i < hsvColors.length; i++) {
    const { h, s } = hsvColors[i];
    if (s < SATURATION_THRESHOLD) {
      grayIndices.push(i);
    } else {
      const bucketIndex = Math.min(
        H_BUCKET_COUNT - 1,
        Math.floor(h / H_BUCKET_WIDTH),
      );
      buckets[bucketIndex].push(i);
    }
  }

  const groups: number[][] = [...groupAchromatic(grayIndices, hsvColors)];

  const chromaticGroupsByBucket = buckets.map((bucket) =>
    groupChromatic(bucket, hsvColors),
  );

  const flatGroups: number[][] = [];
  const boundaries: BucketBoundary[] = [];
  for (const bucketGroups of chromaticGroupsByBucket) {
    if (bucketGroups.length === 0) {
      boundaries.push({ first: -1, last: -1 });
      continue;
    }

    const boundary: BucketBoundary = { first: flatGroups.length, last: -1 };
    boundaries.push(boundary);
    flatGroups.push(...bucketGroups);
    boundary.last = flatGroups.length - 1;
  }

  groups.push(...mergeAdjacentBuckets(flatGroups, boundaries, hsvColors));
  return groups;
};

/**
 * 相邻彩色桶边界合并
 *
 * 检查桶 i 的最后一组与桶 i+1 的第一组，若两组代表色的综合距离不超过阈值，
 * 则将它们所在的组件合并。
 * 使用并查集是为了支持多个相邻边界连续合并。
 * 不处理色相环首尾合并。
 */
const mergeAdjacentBuckets = (
  groups: readonly (readonly number[])[],
  boundaries: readonly BucketBoundary[],
  hsvColors: readonly HSVColor[],
): number[][] => {
  const parent = Array.from({ length: groups.length }, (_, i) => i);
  const components = new Map<number, number[][]>();
  for (let i = 0; i < groups.length; i++) components.set(i, [[...groups[i]]]);

  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };

  const union = (a: number, b: number) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA === rootB) return;

    parent[rootB] = rootA;
    const merged = components.get(rootA)!;
    merged.push(...components.get(rootB)!);
    components.delete(rootB);
  };

  for (let i = 0; i < H_BUCKET_COUNT - 1; i++) {
    const lastIndex = boundaries[i].last;
    const firstIndex = boundaries[i + 1].first;
    if (lastIndex === -1 || firstIndex === -1) continue;

    const rootA = find(lastIndex);
    const rootB = find(firstIndex);
    if (rootA === rootB) continue;

    const repA = averageHsvOfGroups(components.get(rootA)!, hsvColors);
    const repB = averageHsvOfGroups(components.get(rootB)!, hsvColors);
    if (hsvDistanceSquared(repA, repB) <= HSV_GROUP_THRESHOLD_SQUARED) {
      union(rootA, rootB);
    }
  }

  const result: number[][] = [];
  for (const groupArrays of components.values()) {
    const merged: number[] = [];
    for (const group of groupArrays) merged.push(...group);
    result.push(merged);
  }
  return result;
};
