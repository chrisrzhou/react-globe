import React from 'react';

import ReactGlobeSrc, { Props } from '../../lib';

export default function ReactGlobe(props: Props): JSX.Element {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <ReactGlobeSrc {...props} />
    </div>
  );
}
