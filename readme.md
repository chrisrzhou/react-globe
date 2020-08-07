# 🌎 react-globe

Create beautiful and interactive React + ThreeJS globe visualizations with ease.

![image](/public/react-globe.gif)

## Features

- ✨ Beautiful and complete with clouds, backgrounds and lighting.
- ✌️ Incredibly simple to use and configure.
- 📍 Render interactive markers on the globe using simple data.
- 🎞 Easy globe animations and marker transitions.
- ⚛️ Modern Javascript + build tools.

## Install

```sh
npm install react-globe
```

Note that `react-globe` requires `react >= 16.13.1` and `three >= 0.118.3` as peer dependencies.

## Use

### Simple

Render a simple interactive globe with a single line of code!

```js
import React from 'react';
import ReactGlobe from 'react-globe';

function SimpleGlobe() {
  return <ReactGlobe />
}
```

### Kitchen Sink

An example showing various features (markers, tooltips, options, callbacks, textures).

```js
import React, { useState } from 'react';
import ReactGlobe from 'react-globe';

// import optional tippy styles for tooltip support
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

function MyGlobe() {
  // support rendering markers with simple data
  const markers = [
    {
      id: 'marker1',
      city: 'Singapore',
      color: 'red',
      coordinates: [1.3521, 103.8198],
      value: 50,
    },
    {
      id: 'marker2',
      city: 'New York',
      color: 'blue',
      coordinates: [40.73061, -73.935242],
      value: 25,
    },
    {
      id: 'marker3',
      city: 'San Francisco',
      color: 'orange',
      coordinates: [37.773972, -122.431297],
      value: 35,
    },
    {
      id: 'marker4',
      city: 'Beijing',
      color: 'gold',
      coordinates: [39.9042, 116.4074],
      value: 135,
    },
    {
      id: 'marker5',
      city: 'London',
      color: 'green',
      coordinates: [51.5074, 0.1278],
      value: 80,
    },
    {
      id: 'marker6',
      city: 'Los Angeles',
      color: 'gold',
      coordinates: [29.7604, -95.3698],
      value: 54,
    },
  ];

  // simple and extensive options to configure globe
  const options = {
    ambientLightColor: 'red',
    cameraRotateSpeed: 0.5,
    focusAnimationDuration: 2000,
    focusEasingFunction: ['Linear', 'None'],
    pointLightColor: 'gold',
    pointLightIntensity: 1.5,
    globeGlowColor: 'blue',
    markerTooltipRenderer: marker => `${marker.city} (${marker.value})`,
  };

  const [globe, setGlobe] = useState(null);
  console.log(globe); // captured globe instance with API methods

  // simple component usage
  return (
    <ReactGlobe
      height="100vh"
      globeBackgroundTexture="https://your/own/background.jpg"
      globeCloudsTexture={null}
      globeTexture="https://your/own/globe.jpg"
      initialCoordinates={[1.3521, 103.8198]}
      markers={markers}
      options={options}
      width="100%"
      onClickMarker={(marker, markerObject, event) => console.log(marker, markerObject, event)}
      onGetGlobe={setGlobe}
      onMouseOutMarker={(marker, markerObject, event) => console.log(marker, markerObject, event)}
      onGlobeTextureLoaded={() => console.log('globe loaded')}
      onMouseOverMarker={(marker, markerObject, event) => console.log(marker, markerObject, event)}
    >
  )
}
```

## Examples

View all documented examples and gallery of `react-globe` applications at https://react-globe.netlify.com/.

You can also run the examples locally:

```bash
git clone git@github.com:chrisrzhou/react-globe

cd react-globe
npm install && npm run docs
```

### Basic Example (no props)

![image](/public/react-globe-basic.gif)

[![Edit react-globe-simple](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/88645px230)

### Interactive Example (with markers)

![image](/public/react-globe.gif)

[![Edit react-globe-interactive](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/p5lwvkp7x)

### Custom Marker Renderer Example

![image](/public/react-globe-custom-marker-renderer.gif)

[![Edit react-globe-interactive](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/knhlr)

### Google Globe Trends

![image](/public/google-globe-trends.gif)

[Link to app](https://google-globe-trends.netlify.com)

## Contributing

The code is written in `typescript`, linted with `xo`, and built with `microbundle`. Examples and documentations are built with `docz`.

Feel free to contribute by submitting a pull request.
