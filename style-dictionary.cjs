const transforms = [
  'attribute/cti',
  'name/cti/kebab',
  'time/seconds',
  'content/icon',
  'color/css',
];

const StyleDictionary = require('style-dictionary')
  .extend({
    source: [
      'tokens/**/*.json',
    ],
    platforms: {
      css: {
        transforms,
        buildPath: 'src/components/style/',
        files: [
          {
            destination: 'design-tokens.css',
            format: 'css/variables',
            options: {
              outputReferences: true,
            },
          },
        ],
      },
      json: {
        transforms,
        buildPath: 'src/components/style/',
        files: [
          {
            destination: 'design-tokens.json',
            format: 'json',
          },
        ],
      },
      js: {
        transforms,
        buildPath: 'public/',
        files: [
          {
            destination: 'design-tokens.cjs',
            format: 'javascript/module',
          },
        ],
      },
    },
  });

StyleDictionary.buildAllPlatforms();
