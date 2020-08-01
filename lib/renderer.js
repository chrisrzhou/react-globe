import { WebGLRenderer } from 'three';

export function createRenderer(canvas) {
  return new WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas,
  });
}
