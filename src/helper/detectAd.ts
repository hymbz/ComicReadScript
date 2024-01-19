const beforeTextRe = /^\D+(?=\d)/;
const hasNum = /\d/;

export const getAdPage = (fileNameList: Array<string | undefined>) => {
  const adIndexList = new Set<number>();

  /** 根据前戳对所有文件名进行分组 */
  const beforeTextMap: Record<string, Set<number>> = {};

  fileNameList.forEach((fileName, i) => {
    // 没有数字的肯定是广告图
    if (fileName && !hasNum.test(fileName)) return adIndexList.add(i);

    const beforeText = fileName?.match(beforeTextRe)?.[0] ?? '';
    if (!beforeTextMap[beforeText]) beforeTextMap[beforeText] = new Set();
    beforeTextMap[beforeText].add(i);
  });

  const mostLength = Math.max(
    ...Object.values(beforeTextMap).map((list) => list.size),
  );

  const lastIndex = fileNameList.length - 1;

  Object.values(beforeTextMap).forEach((indexList) => {
    if (
      // 应该不至于上来就是广告吧
      indexList.has(0) ||
      // 不会有广告插在中间吧
      !indexList.has(lastIndex) ||
      // 出现最多的前戳肯定(?)不是广告
      indexList.size === mostLength ||
      // 不至于有十张广告吧
      indexList.size > 10
    )
      return;
    indexList.forEach((index) => adIndexList.add(index));
  });

  return adIndexList;
};
