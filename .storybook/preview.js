import 'element-internals-polyfill';
import {html} from 'lit';
import {setCustomElementsManifest} from '@storybook/web-components';
import customElements from '../dist/custom-elements.json';
import '../src/components/style/style.component';
import './storybook.css';

customElements?.modules?.forEach((module) => {
  module?.declarations?.forEach(declaration => {
    Object.keys(declaration).forEach(key => {
      if (Array.isArray(declaration[key])) {
        declaration[key] = declaration[key].filter((member) => !member.privacy?.includes('private'));
      }
    });
  });
});

setCustomElementsManifest(customElements);

export const parameters = {
  backgrounds: {
    disable: true,
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (story) => html`
    <dss-style>${story()}</dss-style>`,
];
