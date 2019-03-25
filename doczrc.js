export default {
  dest: 'dist/docs',
  hashRouter: true,
  menu: [
    'README',
    {
      name: 'Usage',
      menu: ['Props', 'Basic', 'Focus'],
    },
    'FAQ',
    'CHANGELOG',
    { name: 'Github', href: 'https://github.com/chrisrzhou/react-globe' },
  ],
  public: 'docs/public',
  themeConfig: {
    showPlaygroundEditor: true,
  },
  typescript: true,
};
