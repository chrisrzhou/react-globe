export default {
  dest: 'dist/docs',
  menu: [
    'README',
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
        'Events',
        'Animations',
      ],
    },
    {
      name: 'Gallery',
      menu: ['Contributing', 'Google Globe Trends'],
    },
    'FAQ',
    'CHANGELOG',
    { name: 'Github', href: 'https://github.com/chrisrzhou/react-globe' },
  ],
  public: '/public',
  themeConfig: {
    showPlaygroundEditor: true,
  },
  typescript: true,
};
