import { Instance } from 'tippy.js';

export default class Tooltip {
  div: HTMLDivElement;
  instance: Instance;

  constructor(div: HTMLDivElement);

  destroy(): void;

  hide(): void;

  show(clientX: number, clientY: number, content: string): void;
}
