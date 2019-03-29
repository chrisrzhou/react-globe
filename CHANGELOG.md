# Change Log

## [3.0.0] `react-globe` is live!

Check the [documentation](https://react-globe.netlify.com) to begin building interactive globe visualizations!

### Notes

- Original development of `react-globe` begun as [`react-3d-globe`](https://github.com/chrisrzhou/react-3d-globe).
- The release of React hooks was a huge motivation to rewrite `react-3d-globe`. Writing code in hooks allowed complete separation of responsibility of ThreeJS entities (e.g. camera, globe, markers, renderer) into dependency parameters that are passed down from the React component.
- The `react-globe` project is heavily inspired by the [metoorising](https://metoorising.withgoogle.com/) visualization project. Many features in `react-globe` are based around requirements in this project.
- The `react-globe` NPM package was transferred to me from the original package. Code is published to this package at version `3.0.0` to dissociate features and goals from the old package.
