import {addons} from '@storybook/addons';
import {themes} from '@storybook/theming';

addons.setConfig({
  enableShortcuts: false,
  theme: {
    ...themes.normal,
    brandTitle: 'Design System Showcase',
    brandUrl: '/',
    brandTarget: '_self',
  },
});
