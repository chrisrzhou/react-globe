# Change Log

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
