import React from 'react';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

import ReactGlobeSrc from '../..';

export * from '../..';

export default function ReactGlobe(props): JSX.Element {
  return <ReactGlobeSrc height={400} width="100%" {...props} />;
}
