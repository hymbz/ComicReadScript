import { Img } from './image';
import { upscaleImg } from './upscale';
import { mainFn } from './workHelper';

export { setMainFn } from './workHelper';
export type { MainFn } from './workHelper';

// 为了省事，就不支持调整参数了
// 不会支持透明图片，处理起来太麻烦了
// 代码均抄自
// https://github.com/xororz/web-realesrgan/blob/f81d2dd7935ee8df947674933fd41a446b90e911/src/worker.js
// 只删去了因参数固定而变得冗余的代码
//
// 模型文件在 Releases 下载
//
// https://cappuccino.moe/realcugan/2x-conservative-128/model.json
// https://cappuccino.moe/realcugan/2x-conservative-128/group1-shard1of1.bin

const factor = 2;
const input_size = 128;
const min_lap = 12;

const upscale = async (
  data: Uint8ClampedArray,
  width: number,
  height: number,
) => {
  const input = new Img(width, height, new Uint8Array(data));
  input.padToTileSize(input_size);

  const output = new Img(width * factor, height * factor);
  let num_x = 1;
  for (; (input_size * num_x - width) / (num_x - 1) < min_lap; num_x++);
  let num_y = 1;
  for (; (input_size * num_y - height) / (num_y - 1) < min_lap; num_y++);
  const locs_x = Array.from({ length: num_x }) as number[];
  const locs_y = Array.from({ length: num_y }) as number[];
  const pad_left = Array.from({ length: num_x }) as number[];
  const pad_top = Array.from({ length: num_y }) as number[];
  const pad_right = Array.from({ length: num_x }) as number[];
  const pad_bottom = Array.from({ length: num_y }) as number[];
  const total_lap_x = input_size * num_x - width;
  const total_lap_y = input_size * num_y - height;
  const base_lap_x = Math.floor(total_lap_x / (num_x - 1));
  const base_lap_y = Math.floor(total_lap_y / (num_y - 1));
  const extra_lap_x = total_lap_x - base_lap_x * (num_x - 1);
  const extra_lap_y = total_lap_y - base_lap_y * (num_y - 1);
  locs_x[0] = 0;
  for (let i = 1; i < num_x; i++) {
    if (i <= extra_lap_x)
      locs_x[i] = locs_x[i - 1] + input_size - base_lap_x - 1;
    else locs_x[i] = locs_x[i - 1] + input_size - base_lap_x;
  }
  locs_y[0] = 0;
  for (let i = 1; i < num_y; i++) {
    if (i <= extra_lap_y)
      locs_y[i] = locs_y[i - 1] + input_size - base_lap_y - 1;
    else locs_y[i] = locs_y[i - 1] + input_size - base_lap_y;
  }
  pad_left[0] = 0;
  pad_top[0] = 0;
  pad_right[num_x - 1] = 0;
  pad_bottom[num_y - 1] = 0;
  for (let i = 1; i < num_x; i++)
    pad_left[i] = Math.floor((locs_x[i - 1] + input_size - locs_x[i]) / 2);
  for (let i = 1; i < num_y; i++)
    pad_top[i] = Math.floor((locs_y[i - 1] + input_size - locs_y[i]) / 2);
  for (let i = 0; i < num_x - 1; i++)
    pad_right[i] = locs_x[i] + input_size - locs_x[i + 1] - pad_left[i + 1];
  for (let i = 0; i < num_y - 1; i++)
    pad_bottom[i] = locs_y[i] + input_size - locs_y[i + 1] - pad_top[i + 1];

  for (let i = 0; i < num_x; i++) {
    for (let j = 0; j < num_y; j++) {
      const x1 = locs_x[i];
      const y1 = locs_y[j];
      const x2 = locs_x[i] + input_size;
      const y2 = locs_y[j] + input_size;
      const tile = new Img(input_size, input_size);
      tile.getImageCrop(0, 0, input, x1, y1, x2, y2);
      const scaled = await upscaleImg(tile);
      output.getImageCrop(
        (x1 + pad_left[i]) * factor,
        (y1 + pad_top[j]) * factor,
        scaled,
        pad_left[i] * factor,
        pad_top[j] * factor,
        scaled.width - pad_right[i] * factor,
        scaled.height - pad_bottom[j] * factor,
      );
    }
  }

  return output;
};

export const upscaleImage = async (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  url: string,
) => {
  const startTime = Date.now();
  const output = await upscale(data, width, height);

  const canvas = new OffscreenCanvas(output.width, output.height);
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(output.width, output.height);
  for (let i = 0; i < imgData.data.length; i++)
    imgData.data[i] = output.data[i];
  ctx.putImageData(imgData, 0, 0);
  const blob = await canvas.convertToBlob({ type: 'image/png' });

  mainFn.setImg(url, 'upscaleUrl', URL.createObjectURL(blob));
  mainFn.log?.(
    `${url}\n${width}x${height}\n耗时 ${Date.now() - startTime}ms 放大完成`,
  );
};
