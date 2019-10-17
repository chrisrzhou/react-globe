import pkg from './package.json';

export default {
  description: pkg.description,
  dest: 'dist/docs',
  htmlContext: {
    favicon: null,
  },
  menu: [
    'README',
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
    'CHANGELOG',
    { name: 'Github', href: 'https://github.com/chrisrzhou/react-globe' },
  ],
  public: '/public',
  title: `🌎 ${pkg.name} (v${pkg.version})`,
  themeConfig: {
    showPlaygroundEditor: true,
  },
  typescript: true,
};
