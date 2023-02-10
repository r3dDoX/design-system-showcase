const {mergeConfig} = require('vite');
const svg = require('vite-plugin-svgo');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', 'storybook-addon-designs'],
  framework: '@storybook/web-components',
  core: {
    builder: '@storybook/builder-vite',
  },
  staticDirs: ['./assets'],
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [
        svg({
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  convertColors: {
                    currentColor: true,
                  },
                  removeViewBox: false,
                },
              },
            },
            {
              name: 'removeDimensions',
            },
          ],
        }),
      ],
    });
  },
};
