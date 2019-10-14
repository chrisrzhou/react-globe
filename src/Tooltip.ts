import tippy, { Instance } from 'tippy.js';

const TOOLTIP_OFFSET = 10;

export default class Tooltip {
  instance: Instance;
  div: HTMLDivElement;

  constructor(div: HTMLDivElement) {
    this.div = div;
    this.instance = tippy(this.div, {
      animation: 'scale',
    }) as Instance;
  }

  destroy(): void {
    this.instance.destroy();
  }

  hide(): void {
    document.body.style.cursor = 'inherit';
    this.div.style.position = 'fixed';
    this.div.style.left = '0';
    this.div.style.top = '0';
    this.instance.hide();
  }

  show(clientX: number, clientY: number, content: string): void {
    document.body.style.cursor = 'pointer';
    this.div.style.position = 'fixed';
    this.div.style.left = `${clientX + TOOLTIP_OFFSET}px`;
    this.div.style.top = `${clientY + TOOLTIP_OFFSET}px`;
    this.instance.setContent(content);
    this.instance.show();
  }
}
