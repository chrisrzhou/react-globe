import React from 'react';

import ReactGlobeSrc, { Props } from '../../src';

export default function ReactGlobe({ ...otherProps }: Props) {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <ReactGlobeSrc {...otherProps} />
    </div>
  );
}
