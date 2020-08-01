import tippy from 'tippy.js';

const TOOLTIP_OFFSET = 10;

export default class Tooltip {
  constructor(element) {
    this.element = element;
    this.instance = tippy([element], {
      animation: 'scale',
      arrow: false,
    })[0];
  }

  destroy() {
    this.instance.destroy();
  }

  hide() {
    document.body.style.cursor = 'inherit';
    this.element.style.position = 'fixed';
    this.element.style.left = '0';
    this.element.style.top = '0';
    this.instance.hide();
  }

  show(clientX, clientY, content) {
    document.body.style.cursor = 'pointer';
    this.element.style.position = 'fixed';
    this.element.style.left = `${clientX + TOOLTIP_OFFSET}px`;
    this.element.style.top = `${clientY + TOOLTIP_OFFSET}px`;
    this.instance.setContent(content);
    this.instance.show();
  }
}
