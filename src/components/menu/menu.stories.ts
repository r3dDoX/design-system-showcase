import './menu.component';
import '../menuItem/menuItem.component';
import { html } from 'lit-html';
import { Meta, Story } from '@storybook/web-components';
import Menu from './menu.component';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import docs from './menu.md?raw';

export default {
  title: 'Components/Menu',
  component: 'dss-menu',
  argTypes: {},
  parameters: {
    actions: {
      handles: ['dss-menu-selection'],
    },
    docs: {
      description: {
        component: docs,
      },
    },
  },
} as Meta<Menu>;

const Template: Story<Menu> = ({ slot }) => html`
  <dss-menu style="max-width: 20rem; border-radius: 0.5rem; box-shadow: 0 0 1rem 0 rgb(0 0 0 / 20%);">
    ${unsafeHTML(slot)}
  </dss-menu>
`;

export const Default = Template.bind({});
Default.args = {
  slot: `
    <dss-menu-item>
      <dss-icon icon="edit" size="medium"></dss-icon>
      Bearbeiten
    </dss-menu-item>
    <dss-menu-item>
      <dss-icon icon="copy" size="medium"></dss-icon>
      Kopieren
    </dss-menu-item>
  `,
};

export const WithSeparator = Template.bind({});
WithSeparator.args = {
  slot: `
    <dss-menu-item>
      <dss-icon icon="edit" size="medium"></dss-icon>
      Bearbeiten
    </dss-menu-item>
    <hr>
    <dss-menu-item>
      <dss-icon icon="copy" size="medium"></dss-icon>
      Kopieren
    </dss-menu-item>
    <dss-menu-item>
      <dss-icon icon="arrow-down" size="medium"></dss-icon>
      Einfügen
    </dss-menu-item>
  `,
};

export const WithCheckboxes = Template.bind({});
WithCheckboxes.args = {
  slot: `
  <dss-menu-item value="edit">
    <dss-checkbox size="compact" label="Bearbeiten" tabindex="-1"></dss-checkbox>
  </dss-menu-item>
  <hr>
  <dss-menu-item value="copy">
    <dss-checkbox size="compact" label="Kopieren" tabindex="-1"></dss-checkbox>
  </dss-menu-item>
  <dss-menu-item value="clipboard">
    <dss-checkbox size="compact" label="Einfügen" tabindex="-1"></dss-checkbox>
  </dss-menu-item>
  `,
};
