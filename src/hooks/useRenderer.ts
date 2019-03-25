import * as React from 'react';
import * as THREE from 'three';

import { Size } from '../types';

const { useEffect, useRef } = React;

export default function useRenderer<T>(
  size: Size,
): [React.RefObject<THREE.WebGLRenderer>, React.RefObject<HTMLCanvasElement>] {
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const canvasRef = useRef<HTMLCanvasElement>();

  // init
  useEffect(() => {
    rendererRef.current = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: canvasRef.current,
    });
  }, []);

  // update size
  useEffect(() => {
    rendererRef.current.setSize(...size);
  }, [size]);

  return [rendererRef, canvasRef];
}
