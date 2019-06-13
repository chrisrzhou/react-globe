# 🌎 React Globe

Create beautiful and interactive React + ThreeJS globe visualizations with ease.

![image](/public/react-globe.gif)

## Features

- ✨ Beautiful and complete with clouds, backgrounds and lighting.
- ✌️ Incredibly simple to use and configure.
- 🤸‍ Easy globe animations.
- 📍 Render interactive markers on the globe with simple data.
- ⚛️ Modern Javascript + build tools.

## Install

```bash
yarn add react-globe
```

Note that `react-globe` requires `react >= 16.8.0` and `three >= 0.102.0` as peer dependencies.

## Examples

### Documented Examples

View all documented examples and gallery of `react-globe` applications at https://react-globe.netlify.com/.

### Local Examples

You can also run the examples locally:

```bash
git clone git@github.com:chrisrzhou/react-globe

cd react-globe
yarn
yarn dev
```

### Basic Example (no props)

![image](/public/react-globe-basic.gif)

[![Edit react-globe-simple](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/88645px230)

### Interactive Example (with markers)

![image](/public/react-globe.gif)

[![Edit react-globe-interactive](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/p5lwvkp7x)

### Google Globe Trends

![image](/public/google-globe-trends.gif)

[Link to app](https://google-globe-trends.netlify.com)

## Development

### Main Dependencies

- `react`
- `three`
- `three-glow-mesh`
- `three-orbitcontrols`
- `three.interaction`
- `es6-tween`
- `tippy.js`

### Codebase Overview

- `ReactGlobe.tsx`: Core component that combines React + ThreeJS hooks into an animated scene supporting interactions.
- `Tooltip.tsx`: Tooltip component powered by `tippy.js`.
- `reducer.ts`: Simple state management for tracking focused coordinates and active markers.
- `defaults.ts`: Default options and constants.
- `utils.ts`: Simple functions to compute derived data.
- `/hooks`: React hooks to handle updating various ThreeJS entities (e.g. camera, globe, markers, renderer).
- `/textures`: Default globe, clouds and background textures.

The code is written in `typescript`, linted with `eslint` + `prettier`, and built with `rollup`. Examples and documentations are built with `docz`.

Feel free to contribute by submitting a pull request.

## Author's Note

My projects will always be (ads-)free. I constantly learn from the community, so these projects are a way of giving back to the community. If you liked this project or find it useful, feel free to buy me a cup of coffee ☕️ through a small donation!

[![paypal](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/chrisrzhou/5)
