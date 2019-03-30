# 🌎 React Globe

Create beautiful and interactive React + ThreeJS globe visualizations with ease.

![image](https://github.com/chrisrzhou/react-globe/raw/master/globe.png)

## Features

- ☀️ Beautiful and complete with clouds + backgrounds + lighting.
- ✌️ Incredibly simple to use and configure.
- 📍 Render interactive markers easily on the globe with simple data.
- 🤸‍ Globe animations simplified.
- ⚛️ Modern Javascript + build tools.

## Install

```bash
yarn add react-globe
```

Note that `react-globe` requires `react^16.8.0` as a peer dependency.

## Examples

View all documented examples at https://react-globe.netlify.com/

Here is a simple example with no props!

```js
import * as React from "react";
import ReactGlobe from "react-globe";

function MyApp() {
  return (
    <div style={{ width: 600, height: 400 }}>
      <ReactGlobe />
    </div>
  );
}
```

You can also run the examples locally:

```bash
git clone git@github.com:chrisrzhou/react-globe

cd react-globe
yarn
yarn dev
```

## Development

### Main Dependencies

- `react`
- `three`
- `three-orbitcontrols`
- `three.interaction`
- `es6-tween`
- `tippy.js`

### Codebase Overview

- `ReactGlobe.tsx`: Core component that combines React + ThreeJS hooks into an animated scene supporting interactions.
- `Tooltip.tsx`: Simple tooltip component powered by `tippy.js`.
- `reducer.ts`: Simple state management for tracking focused coordinates and active markers.
- `defaults.ts`: Default options and constants.
- `utils.ts`: Various simple functions to compute derived data.
- `/hooks`: React hooks to handle updating various ThreeJS entities (e.g. camera, globe, markers, renderer).
- `/textures`: Default globe, clouds and background textures.

The code is written in `typescript`, linted with `eslint` + `prettier`, and built with `rollup`. Examples and documentations are built with `docz`.

## Areas of Improvements

These are some areas of improvements for `react-globe`. PRs and help is greatly appreciated!

- [ ] Reduce bundle size by finding a way to ship the component without texture files. We might need to consider offline support, so a pure URL-based approach might not work.
- [ ] Various dependencies are untyped. I am also fairly new to Typescript so PRs to improve type quality in the codebase is appreciated :)
- [ ] Check that React hooks are decoupled, bugfree and performant.
- [ ] Surface various hardcoded constants in `default.ts` as prop options. We need to be mindful about keeping the component props API simple and easy to use.
- [ ] Provide better ways to 'script' animations. `react-spring` scripting is a good approach to do this.
- [ ] Provide better ways to render custom globes and markers. We might want to avoid overcomplicating the component, and this could be moved into another package.

## Donate

My projects will always be (ads-)free. I constantly learn from the community, so these projects are a way of giving back to the community. If you liked this project or find it useful, feel free to buy me a cup of coffee ☕️ through a small donation!

[![paypal](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/chrisrzhou/5)
