import React from 'react';
import tippy, { Instance } from 'tippy.js';

const { useEffect, useRef } = React;

let tooltipInstance: Instance;

interface Props {
  content: string;
  offset: number;
  x: number;
  y: number;
}

function Tooltip({ content, offset, x, y }: Props) {
  const ref = useRef();

  useEffect(() => {
    document.body.style.cursor = 'pointer';
    tooltipInstance = tippy(ref.current, {
      animation: 'scale',
      content,
    }) as Instance;
    tooltipInstance.show();

    return () => {
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
        left: x + offset,
        position: 'fixed',
        top: y + offset,
      }}
    />
  );
}

export default Tooltip;
