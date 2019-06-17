declare module 'es6-tween';
declare module 'three.interaction';

declare module 'three-orbitcontrols' {
  import { PerspectiveCamera, WebGLRenderer } from 'three';

  export default class OrbitControls {
    public autoRotate: boolean;
    public autoRotateSpeed: number;
    public dampingFactor: number;
    public enabled: boolean;
    public enableDamping: boolean;
    public enablePan: boolean;
    public enableRotate: boolean;
    public enableZoom: boolean;
    public maxDistance: number;
    public maxPolarAngle: number;
    public minDistance: number;
    public minPolarAngle: number;
    public rotateSpeed: number;
    public update: () => void;
    public zoomSpeed: number;

    public constructor(
      camera: PerspectiveCamera,
      canvasElement: HTMLCanvasElement,
    );
  }
}
