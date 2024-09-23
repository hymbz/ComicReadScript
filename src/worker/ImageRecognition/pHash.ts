import { toGrayList } from './workHelper';

// 通过计算 pHash 的汉明距离来判断图片相似度
// 优点是可以识别黑白化和轻微的形变剪切，并且不需要两张图片长宽相同
// 缺点是需要使用 Canvas 进行缩放

/** 缩小图片 */
const resizeImg = async (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  size = 8,
) => {
  const imgBitmap = await createImageBitmap(new ImageData(data, width, height));
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(imgBitmap, 0, 0, size, size);
  return ctx.getImageData(0, 0, size, size).data;
};

/** 计算离散余弦变换 */
const calculateDCT = (matrix: number[]) => {
  const transformed: number[] = [];
  const size = matrix.length;

  for (let i = 0; i < size; i++) {
    let sum = 0;
    for (let j = 0; j < size; j++) {
      sum += matrix[j] * Math.cos((i * Math.PI * (j + 0.5)) / size);
    }
    sum *= Math.sqrt(2 / size);
    if (i === 0) {
      sum *= 1 / Math.sqrt(2);
    }
    transformed[i] = sum;
  }

  return transformed;
};

/** 计算像素平均值 */
const getAverage = (pixels: number[]) => {
  const n = pixels.length - 1;
  return pixels.slice(1, n).reduce((a, b) => a + b, 0) / n;
};

// by: https://github.com/freearhey/phash-js
/** 计算图片哈希 */
export const getImgHash = async (
  rawImgData: Uint8ClampedArray,
  width: number,
  height: number,
  size = 8,
) => {
  const imgData = await resizeImg(rawImgData, width, height);

  const grayList = toGrayList(imgData, 0);

  const rows: number[][] = [];
  for (let y = 0; y < size; y++) {
    const row: number[] = [];
    for (let x = 0; x < size; x++) row[x] = grayList[y * size + x];
    rows[y] = calculateDCT(row);
  }

  const matrix: number[][] = [];
  for (let x = 0; x < size; x++) {
    const col: number[] = [];
    for (let y = 0; y < size; y++) col[y] = rows[y][x];
    matrix[x] = calculateDCT(col);
  }

  const pixels: number[] = [];
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 8; x++) pixels.push(matrix[y][x]);

  const compare = getAverage(pixels);
  const bits = pixels.map((pixel) => (pixel > compare ? 1 : 0));

  return bits.join('');
};

// 在主线程中使用
//
// /** 计算汉明距离 */
// const hammingDistance = (x: string, y: string) => {
//   // 因为数值过大时 js 计算异或会有问题，所以只能用字符串来判断
//   if (x.length !== y.length) throw new Error('哈希长度不同');
//   let i = x.length;
//   let num = 0;
//   while (i--) if (x[i] !== y[i]) num++;
//   return num;
// };
