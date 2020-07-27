import { Instance } from 'tippy.js';
export default class Tooltip {
  instance: Instance;
  div: HTMLDivElement;
  constructor(div: HTMLDivElement);
  destroy(): void;
  hide(): void;
  show(clientX: number, clientY: number, content: string): void;
}
