import tippy from 'tippy.js';

const TOOLTIP_OFFSET = 10;

export default class Tooltip {
  constructor(div) {
    this.div = div;
    this.instance = tippy([this.div], {
      animation: 'scale',
      arrow: false,
    })[0];
  }

  destroy() {
    this.instance.destroy();
  }

  hide() {
    document.body.style.cursor = 'inherit';
    this.div.style.position = 'fixed';
    this.div.style.left = '0';
    this.div.style.top = '0';
    this.instance.hide();
  }

  show(clientX, clientY, content) {
    document.body.style.cursor = 'pointer';
    this.div.style.position = 'fixed';
    this.div.style.left = `${clientX + TOOLTIP_OFFSET}px`;
    this.div.style.top = `${clientY + TOOLTIP_OFFSET}px`;
    this.instance.setContent(content);
    this.instance.show();
  }
}
