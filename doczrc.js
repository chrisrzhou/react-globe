import pkg from './package.json';

export default {
  description: pkg.description,
  dest: 'dist/docs',
  editBranch: 'main',
  htmlContext: {
    favicon: null,
  },
  menu: [
    'Readme',
    'Props',
    {
      name: 'Usage',
      menu: [
        'Globe',
        'Textures',
        'Camera',
        'Lights',
        'Focus',
        'Markers',
        'Marker Transitions',
        'Callbacks',
        'Animations',
        'Globe Instance',
      ],
    },
    {
      name: 'Gallery',
      menu: ['Submissions', 'Google Globe Trends'],
    },
    'Changelog',
  ],
  modifyBundlerConfig: bundlerConfig => {
    const rules = [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ];
    bundlerConfig.module.rules.push(...rules);
    return bundlerConfig;
  },
  public: 'public',
  themeConfig: {
    showPlaygroundEditor: true,
  },
  title: `🌎 ${pkg.name} (v${pkg.version})`,
  typescript: true,
};
