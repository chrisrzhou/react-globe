import React from 'react';

import ReactGlobeSrc from '../../src';

export default function ReactGlobe({ ...otherProps }): React.ReactNode {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <ReactGlobeSrc {...otherProps} />
    </div>
  );
}
