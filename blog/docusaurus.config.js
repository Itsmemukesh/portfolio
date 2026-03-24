// @ts-check
const { themes: prismThemes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Mukesh Biswas — Blog',
  tagline: 'Technical Writing · AI · Documentation Strategy · Developer Experience',

  url: 'https://Itsmemukesh.github.io',
  baseUrl: '/portfolio/blog/',

  organizationName: 'Itsmemukesh',
  projectName: 'portfolio',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: {
          routeBasePath: '/',
          showReadingTime: true,
          blogTitle: 'Mukesh Biswas — Blog',
          blogDescription:
            'Thoughts on technical writing, AI, documentation strategy, and the future of developer experience.',
          postsPerPage: 6,
          blogSidebarTitle: 'Recent Posts',
          blogSidebarCount: 5,
          feedOptions: {
            type: 'all',
            title: 'Mukesh Biswas — Blog',
            description: 'Technical writing, AI, and documentation strategy.',
            copyright: `© ${new Date().getFullYear()} Mukesh Biswas`,
            language: 'en',
          },
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: '<Mukesh./>',
        items: [
          {
            href: 'https://Itsmemukesh.github.io/portfolio/',
            label: '← Portfolio',
            position: 'right',
          },
          {
            href: 'https://www.linkedin.com/in/mukesh-biswas-tech-writer/',
            label: 'LinkedIn',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            label: 'Portfolio',
            href: 'https://Itsmemukesh.github.io/portfolio/',
          },
          {
            label: 'LinkedIn',
            href: 'https://www.linkedin.com/in/mukesh-biswas-tech-writer/',
          },
          {
            label: 'GitHub',
            href: 'https://github.com/mukesh-biswas',
          },
        ],
        copyright: `© ${new Date().getFullYear()} Mukesh Biswas. All rights reserved.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

module.exports = config;
