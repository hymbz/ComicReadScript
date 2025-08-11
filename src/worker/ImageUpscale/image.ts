export class Img {
  width: number;
  height: number;
  data: Uint8Array;
  constructor(
    width: number,
    height: number,
    data = new Uint8Array(width * height * 4),
  ) {
    this.width = width;
    this.height = height;
    this.data = data;
  }

  getImageCrop(
    x: number,
    y: number,
    image: Img,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) {
    const width = x2 - x1;
    for (let j = 0; j < y2 - y1; j++) {
      const srcIndex = (y1 + j) * image.width * 4 + x1 * 4;
      this.data.set(
        image.data.subarray(srcIndex, srcIndex + width * 4),
        (y + j) * this.width * 4 + x * 4,
      );
    }
  }

  padToTileSize(tileSize: number) {
    let newWidth = this.width;
    let newHeight = this.height;
    if (this.width < tileSize) newWidth = tileSize;
    if (this.height < tileSize) newHeight = tileSize;
    if (newWidth === this.width && newHeight === this.height) return;
    const newData = new Uint8Array(newWidth * newHeight * 4);
    for (let y = 0; y < this.height; y++) {
      const srcStart = y * this.width * 4;
      newData.set(
        this.data.subarray(srcStart, srcStart + this.width * 4),
        y * newWidth * 4,
      );
    }
    if (newWidth > this.width) {
      const rightColumnIndex = (this.width - 1) * 4;
      for (let y = 0; y < this.height; y++) {
        const destRowStart = y * newWidth * 4;
        const srcPixelIndex = y * this.width * 4 + rightColumnIndex;
        const padPixel = this.data.subarray(srcPixelIndex, srcPixelIndex + 4);
        for (let x = this.width; x < newWidth; x++)
          newData.set(padPixel, destRowStart + x * 4);
      }
    }
    if (newHeight > this.height) {
      const bottomRowStart = (this.height - 1) * newWidth * 4;
      const bottomRow = newData.subarray(
        bottomRowStart,
        bottomRowStart + newWidth * 4,
      );
      for (let y = this.height; y < newHeight; y++)
        newData.set(bottomRow, y * newWidth * 4);
    }
    this.width = newWidth;
    this.height = newHeight;
    this.data = newData;
  }

  cropToOriginalSize(width: number, height: number) {
    const newData = new Uint8Array(width * height * 4);
    for (let y = 0; y < height; y++) {
      const srcStart = y * this.width * 4;
      newData.set(
        this.data.subarray(srcStart, srcStart + width * 4),
        y * width * 4,
      );
    }
    this.width = width;
    this.height = height;
    this.data = newData;
  }
}
