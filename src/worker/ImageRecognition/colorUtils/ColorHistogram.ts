/** 统计整数 key 的直方图，求出众数 key */
export class ColorHistogram {
  private readonly counts = new Map<number, number>();
  private modeKey = 0;
  private modeCount = 0;

  add(key: number): void {
    const count = (this.counts.get(key) ?? 0) + 1;
    this.counts.set(key, count);

    if (count > this.modeCount) {
      this.modeCount = count;
      this.modeKey = key;
    }
  }

  merge(other: ColorHistogram): void {
    for (const [key, count] of other.counts) {
      const mergedCount = (this.counts.get(key) ?? 0) + count;
      this.counts.set(key, mergedCount);

      if (mergedCount > this.modeCount) {
        this.modeCount = mergedCount;
        this.modeKey = key;
      }
    }
  }

  getModeKey(): number | undefined {
    if (this.modeCount !== 0) return this.modeKey;
  }
}
