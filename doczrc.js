import pkg from './package.json';

export default {
  description: pkg.description,
  dest: 'dist/docs',
  editBranch: 'main',
  htmlContext: {
    favicon: null,
  },
  menu: [
    'readme',
    'Props',
    {
      name: 'Examples',
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
    'changelog',
  ],
  public: 'public',
  themeConfig: {
    showPlaygroundEditor: true,
  },
  title: `🌎 ${pkg.name} (v${pkg.version})`,
  typescript: true,
};
