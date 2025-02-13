export class FaviconProgress {
  public initLink: string;
  public color: string;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly link: HTMLLinkElement;

  constructor(color = '#607D8B') {
    this.color = color;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 32;
    this.canvas.height = 32;
    this.ctx = this.canvas.getContext('2d')!;

    const existingLink =
      document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (existingLink) this.link = existingLink;
    else {
      const link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'icon';
      document.head.append(link);
      this.link = link;
    }

    this.initLink = this.link.href || '/favicon.ico';
  }

  update(progress: number): void {
    this.ctx.clearRect(0, 0, 32, 32);

    // 绘制背景
    this.ctx.beginPath();
    this.ctx.arc(16, 16, 16, 0, Math.PI * 2);
    this.ctx.fillStyle = '#FAFAFA';
    this.ctx.fill();

    // 绘制进度扇形
    const startAngle = -Math.PI / 2;
    const endAngle = Math.PI * 2 * progress + startAngle;
    this.ctx.beginPath();
    this.ctx.moveTo(16, 16);
    this.ctx.arc(16, 16, 16, startAngle, endAngle);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();

    this.updateFavicon();
  }

  updateFavicon(): void {
    if (!this.link || !this.canvas) return;
    this.link.href = this.canvas.toDataURL('image/png');
  }

  /** 恢复默认图标 */
  recover(): void {
    if (!this.link || !this.initLink) return;
    this.link.href = this.initLink;
  }
}

export const useFaviconProgress = () => {
  //
};
