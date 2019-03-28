# 🌍 React Globe

Build beautiful and interactive React + ThreeJS globe visualizations with ease.

## TODO

- [ ] Work on `animations` prop that uses `useCamera` focus to power animations
- [ ] Support passing custom marker renderers
- [ ] Update docz/README
- [ ] Add Gallery menu with examples (e.g. #metoorising)

## Install

```bash
yarn add react-globe
```

Note that `react-globe` requires `react^16.8.0` as a peer dependency.

## Examples

View all documented examples at https://react-globe.netlify.com/

A simple example using only required props:

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
- `three.js`

### Codebase Overview

The code is written in `typescript`, linted with `eslint` + `prettier`, and built with `rollup`. Examples and documentations are built with `docz`.

Feel free to contribute by submitting a pull request.

## Donate

My projects will always be (ads-)free. I constantly learn from the community, so these projects are a way of giving back to the community. If you liked this project or find it useful, feel free to buy me a cup of coffee ☕️ through a small donation!

[![paypal](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/chrisrzhou/5)
