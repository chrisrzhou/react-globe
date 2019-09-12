import React, { useEffect, useRef } from 'react';
import tippy, { Instance } from 'tippy.js';

const OFFSET = 10;

let tooltipInstance: Instance;

interface Props {
  content: string;
  x: number;
  y: number;
}

export default function Tooltip({ content, x, y }: Props): JSX.Element {
  const ref = useRef();

  useEffect(() => {
    document.body.style.cursor = 'pointer';
    tooltipInstance = tippy(ref.current, {
      animation: 'scale',
      content,
    }) as Instance;
    tooltipInstance.show();

    return (): void => {
      document.body.style.cursor = 'inherit';
      if (tooltipInstance) {
        tooltipInstance.destroy();
      }
    };
  }, [content]);

  return (
    <div
      ref={ref}
      style={{
        left: x + OFFSET,
        position: 'fixed',
        top: y + OFFSET,
      }}
    />
  );
}
