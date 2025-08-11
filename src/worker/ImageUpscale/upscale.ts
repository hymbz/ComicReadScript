import type { Tensor, Tensor3D } from '@tensorflow/tfjs';

import * as tf from '@tensorflow/tfjs';

import { Img } from './image';
import { getModel } from './model';

export const upscaleImg = async (image: Img): Promise<Img> => {
  const model = await getModel();
  const result = tf.tidy(() => model!.predict(img2tensor(image)) as Tensor);
  const resultImage = await tensor2img(result);
  tf.dispose(result);
  return resultImage;
};

const img2tensor = (image: Img): Tensor => {
  const imgdata = new ImageData(image.width, image.height);
  imgdata.data.set(image.data);
  return tf.browser.fromPixels(imgdata).div(255).toFloat().expandDims();
};

const tensor2img = async (tensor: Tensor): Promise<Img> => {
  const [, height, width] = tensor.shape;

  const clipped = tf.tidy(() =>
    tensor
      .reshape([height, width, 3])
      .mul(255)
      .cast('int32')
      .clipByValue(0, 255),
  );
  tensor.dispose();
  const data = await tf.browser.toPixels(clipped as Tensor3D);
  clipped.dispose();
  return new Img(width, height, data as any);
};
