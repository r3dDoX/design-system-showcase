import './toggleButton.component';
import '../icon/icon.component';
import ToggleButton, { toggleButtonTypes } from './toggleButton.component';
import { html } from 'lit-html';
import { Story } from '@storybook/web-components';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import docs from './toggleButton.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { buttonSpacings } from '../button/button.component';

export default {
  title: 'Components/Toggle button',
  component: 'dss-toggle-button',
  argTypes: {
    type: { control: 'select', options: toggleButtonTypes },
    spacing: { control: 'select', options: buttonSpacings },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vN8eRqwHQLrnGFkcxL7Z4W/dss-Connect-Design?node-id=531%3A2883',
    },
    docs: {
      description: {
        component: docs,
      },
    },
    actions: {
      handles: ['click dss-toggle-button'],
    },
  },
};

const Template: Story<ToggleButton> = ({ slot, selected, spacing, disabled, type, tooltip }) => html`
  <dss-toggle-button
    spacing="${ifDefined(spacing)}"
    type="${ifDefined(type)}"
    tooltip="${ifDefined(tooltip)}"
    ?disabled=${disabled}
    ?selected=${selected}
  >
    ${unsafeHTML(slot)}
  </dss-toggle-button>
`;

export const Default = Template.bind({});
Default.args = {
  slot: 'Toggle me!',
};

export const IconToggle = Template.bind({});
IconToggle.args = {
  spacing: 'icon',
  slot: '<dss-icon icon="home" size="large"></dss-icon>',
};
