# Change Log

## [3.1.0](https://github.com/chrisrzhou/react-globe/compare/v3.0.2...v3.1.0) (2019-06-17)

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
