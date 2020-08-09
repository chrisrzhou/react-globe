# Change Log

## [5.0.2](https://github.com/chrisrzhou/react-globe/compare/v5.0.2...v5.0.1) (2020-08-08)

Various bugfixes.

- Fixed bug to allow `cameraDistanceRadiusScale` to affect the initial globe camera distance.  This prop has the same exact behavior as `initialCameraDistanceRadiusScale`, which is now reserved as a useful semantic prop alias.
- Fixed bug where the globe's glow was not removed when `options` is updated.  This led to creation and attachment of increasing amounts of glow meshes, and also not honoring the `enableGlobeGlow` prop.
- Remove `console.log`
- Increase `cameraMaxDistanceRadiusScale` default value to better support the `initialCameraDistanceRadiusScale` prop.
- Add names to three objects for easier development/debugging.

## [5.0.1](https://github.com/chrisrzhou/react-globe/compare/v5.0.1...v5.0.1) (2020-08-08)

Add `delay` support to exported `tween` utility.

## [5.0.0](https://github.com/chrisrzhou/react-globe/compare/v5.0.0...v4.0.0) (2020-08-07)

Refactoring and simplification of codebase and exposed public APIs.

### Changes
- New props (see section below).
- Flattened `options` prop (improves and simplifies component rendering lifecycle with hooks).
- Improved `Globe` instance support.
- Bugfixes and performance improvements.
  - Fixed various GH issues.
  - Memory leaks with marker callbacks.
- Simplified and decoupled internal implementation.
- Detypescriptify source code to improve future OSS development.
- Updated dev tools and build pipeline (`microbundle`, `xo`).
- Updated docs and examples.

### Breaking Changes

#### Named Exports
Only the `Globe` class, `ReactGlobe` component, `defaultCallbacks`, `defaultInitialCoordinates`, `defaultOptions`, and `tween` util are now exported to limit the exposed public API.

#### Types
Various exported types have changed.  The new types form a smaller and simplified set.

#### Props

Various props are replaced, updated (interface updates), removed, or unchanged.  The following table tracks the status of old vs new props.

| Status | Old | New |
| --- | --- | --- |
| updated | `animations` | `animations` |
| updated | `onDefocus` | `onDefocus` |
| replaced | ~~`cameraOptions`~~ | `options` |
| replaced | ~~`focusOptions`~~ | `options` |
| replaced | ~~`globeOptions`~~ | `options` |
| replaced | ~~`lightOptions`~~ | `options` |
| replaced | ~~`markerOptions`~~ | `options` |
| replaced | ~~`size`~~ | `height`, `width` |
| unchanged | `focus` | `focus` |
| unchanged | `initialCoordinates` | `initialCoordinates` |
| unchanged | `markers` | `markers` |
| unchanged | `onClickMarker` | `onClickMarker` |
| unchanged | `onMouseOutMarker` | `onMouseOutMarker` |
| unchanged | `onMouseOverMarker` | `onMouseOverMarker` |
| renamed | `onGetGlobeInstance` | `onGetGlobe` |
| renamed | `onTextureLoaded` | `onGlobeTextureLoaded` |
| added | | `globeBackgroundTexture` |
| added | | `globeCloudsTexture` |
| added | | `globeTexture` |
| added | | `onGlobeBackgroundTextureLoaded` |
| added | | `onGlobeCloudsTextureLoaded` |

#### Options 

`react-globe` provides useful and convenient configurations to customize the globe.  These configurations still exist, but are managed in a flat `options` object.  This allows easier code/documentation management of globe configuration.

Most options are renamed in an organized way that allows easy refactoring.

| Status | Old | New |
| --- | --- | --- |
| removed | ~~`globeOptions.enableBackground`~~ | |
| removed | ~~`globeOptions.enableClouds`~~ | |
| removed | `markerOptions.activeScale` |  |
| renamed | `cameraOptions.autoRotateSpeed` | `options.cameraAutoRotateSpeed` |
| renamed | `cameraOptions.distanceRadiusScale` | `options.cameraDistanceRadiusScale` |
| renamed | `cameraOptions.enableAutoRotate` | `options.enableCameraAutoRotate` |
| renamed | `cameraOptions.enableRotate` | `options.enableCameraRotate` |
| renamed | `cameraOptions.enableZoom` | `options.enableCameraZoom` |
| renamed | `cameraOptions.maxDistanceRadiusScale` | `options.cameraMaxDistanceRadiusScale` |
| renamed | `cameraOptions.maxPolarAngle` | `options.cameraMaxPolarAngle` |
| renamed | `cameraOptions.minPolarAngle` | `options.cameraMinPolarAngle` |
| renamed | `cameraOptions.rotateSpeed` | `options.cameraRotateSpeed` |
| renamed | `cameraOptions.zoomSpeed` | `options.cameraZoomSpeed` |
| renamed | `focusOptions.animationDuration` | `options.focusAnimationDuration` |
| renamed | `focusOptions.distanceRadiusScale` | `options.focusDistanceRadiusScale` |
| renamed | `focusOptions.easingFunction` | `options.focusEasingFunction` |
| renamed | `focusOptions.enableDefocus` | `options.enableDefocus` |
| renamed | `globeOptions.backgroundTexture` | `options.globeBackgroundTexture` |
| renamed | `globeOptions.cloudsOpacity` | `options.globeCloudsOpacity` |
| renamed | `globeOptions.cloudsTexture` | `options.globeCloudsTexture` |
| renamed | `globeOptions.enableGlow` | `options.enableGlobeGlow` |
| renamed | `globeOptions.glowCoefficient` | `options.globeGlowCoefficient` |
| renamed | `globeOptions.glowColor` | `options.globeGlowColor` |
| renamed | `globeOptions.glowPower` | `options.globeGlowPower` |
| renamed | `globeOptions.glowRadiusScale` | `options.globeGlowRadiusScale` |
| renamed | `globeOptions.texture` | `options.globeTexture` |
| renamed | `lightOptions.ambientLightColor` | `options.ambientLightColor` |
| renamed | `lightOptions.ambientLightIntensity` | `options.ambientLightIntensity` |
| renamed | `lightOptions.pointLightColor` | `options.pointLightColor` |
| renamed | `lightOptions.pointLightIntensity` | `options.pointLightIntensity` |
| renamed | `lightOptions.pointLightPositionRadiusScales` | `options.pointLightPositionRadiusScales` |
| renamed | `markerOptions.enableGlow` | `options.enableMarkerGlow` |
| renamed | `markerOptions.enableTooltip` | `options.enableMarkerTooltip` |
| renamed | `markerOptions.enterAnimationDuration` | `options.markerEnterAnimationDuration` |
| renamed | `markerOptions.enterEasingFunction` | `options.markerEnterEasingFunction` |
| renamed | `markerOptions.exitAnimationDuration` | `options.markerExitAnimationDuration` |
| renamed | `markerOptions.exitEasingFunction` | `options.markerExitEasingFunction` |
| renamed | `markerOptions.getTooltipContent` | `options.markerTooltipRenderer` |
| renamed | `markerOptions.glowCoefficient` | `options.markerGlowCoefficient` |
| renamed | `markerOptions.glowPower` | `options.markerGlowPower` |
| renamed | `markerOptions.glowRadiusScale` | `options.markerGlowRadiusScale` |
| renamed | `markerOptions.offsetRadiusScale` | `options.markerOffsetRadiusScale` |
| renamed | `markerOptions.radiusScaleRange` | `options.markerRadiusScaleRange` |
| renamed | `markerOptions.renderer` | `options.markerRenderer` |
| renamed | `markerOptions.type` | `options.markerType` |

#### `Globe` instance

As mentioned in the `v4.0.0` docs, the `Globe` instance APIs are unstable and not formally maintained.  The `Globe` class instance is now managed through a new set of class methods, and the old methods are no longer compatible.

`v5.0.0` introduces more formal support for the `Globe` instance.

#### `CSS`

Tooltip (`tippy`) CSS is no longer bundled with the project.  You can optionally import it with:

```js
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
```



## [4.0.0](https://github.com/chrisrzhou/react-globe/compare/v3.1.1...v4.0.0) (2019-10-17)

`v4.0.0` brings huge improvements to marker transition behaviors and other features!

### Features and Improvements

- Markers now update and apply transitions without resetting the globe or other markers. This creates a simple way to add/remove/update markers with intuitive visual feedback.
- Globe avoids resetting and re-rendering when props change.
- Globe animations are better optimized and less 'lag' is encountered.
- Additional named exports (e.g. `Globe`, `Tooltip`) empower useful ways to work with `react-globe`.
- You can now retrieve the `Globe` instance via the `onGetGlobeInstance` prop, which allows you to fully access and control the `Globe` class outside of the React lifecycle.
  - This also opens up powerful new ways to work with the globe (e.g. `freeze` and `unfreeze` methods).
  - Note that we still **strongly recommend** that you keep to React props to control behaviors of the globe.
- Updated docs and examples.

### Breaking Changes

- `lookAt` prop is renamed to `initialCoordinates`.
- Some exported Typescript types have changed. Address and import the relevant types accordingly. Noticeably, all `*Options` prop are now explicitly renamed to `*OptionsProp`. The former is used internally in the codebase while the `*OptionsProp` supports specifying optional option key/value pair in the component props.
- The underlying `defaultCameraOptions` values are updated to reflect changes in dependent libraries. You might need to update these option values if custom values were previously used.
- Tooltip behaviors have changed slightly to improve rendering performance. Tooltips are auto-disabled on non-interactable scenarios (e.g. focusing, animating).
- `globeOptions.cloudsSpeed` option is removed because it was not very useful, and was overcomplicating the animation cycle. We should explore a better way to implement/customize cloud speeds in every rotation axis in the future.

### Internal Changes

- Refactor rendering logic to use `Globe.ts` class instead of custom React hooks.
  - While React hooks organized the code better, it created unneccessary complexity when dealing with hook dependencies.
  - This refactor decouples the React component and the ThreeJS rendering responsibilities. The React component is basically now a thin wrapper to pass props to the `Globe` instance and control how the `Globe` instance should be updated when props change.
  - The refactor was also required to better support and control marker transitions, and optimizing globe re-rendering when props change.

## [3.1.1](https://github.com/chrisrzhou/react-globe/compare/v3.0.2...v3.1.1) (2019-06-17)

### Bug Fixes and Enhancements

- Use `three-glow-mesh` and `react-cached-callback`.
- Add `onTextureLoaded` callback to detect if globe texture has successfully loaded. Updated `Texture.mdx` docs. ([#2](https://github.com/chrisrzhou/react-globe/issues/2))
- Fix `focusOptions.distanceRadiusScale` not updating on change. ([#4](https://github.com/chrisrzhou/react-globe/issues/4))
- Support customizing offset of markers using `markersOptions.offsetRadiusScale`.([#5](https://github.com/chrisrzhou/react-globe/issues/5))
- Fix Typescript bugs. ([#7](https://github.com/chrisrzhou/react-globe/issues/7))
- Type `*Options` props with optional fields. ([#9](https://github.com/chrisrzhou/react-globe/issues/9))

## [3.0.2](https://github.com/chrisrzhou/react-globe/compare/v3.0.0...v3.0.2) (2019-04-23)

### Bug Fixes

- Fix component re-renders when `pointLightPositionRadiusScales` is updated.
- Export `tween` method.
- Support customizing markers glow options.
- Dissable min/max polar angles when focus is applied.
- Support TouchEvents on markers
- Export types

### Other

- Update dependencies and docs

## [3.0.0] `react-globe` is live!

Check the [documentation](https://react-globe.netlify.com) to begin building interactive globe visualizations!

### Notes

- Original development of `react-globe` begun as [react-3d-globe](https://github.com/chrisrzhou/react-3d-globe).
- The release of React hooks was a huge motivation to rewrite `react-3d-globe`. Writing code in hooks allowed complete separation of responsibility of ThreeJS entities (e.g. camera, globe, markers, renderer). These separate effects can be updated in a controlled manner by listening explicitly to their dependencies passed down from the component props.
- The `react-globe` project is heavily inspired by the [metoorising](https://metoorising.withgoogle.com/) visualization project. Many features in `react-globe` are based around requirements in this project.
- The `react-globe` NPM package was transferred to me from the original package. Code is published to this package at version `3.0.0` to dissociate features and goals from the old package.
