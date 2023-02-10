import '../toggleButton/toggleButton.component';
import './buttongroup.component';
import ButtonGroup from './buttongroup.component';
import { html } from 'lit-html';
import { Meta, Story } from '@storybook/web-components';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import docs from './buttongroup.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';

export default {
  title: 'Components/Button Group',
  component: 'dss-button-group',
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
  },
} as Meta;

const Template: Story<ButtonGroup> = ({ slot, selectedIndex, label, required, errorState, message }) => html`
  <dss-button-group
    selectedIndex="${ifDefined(selectedIndex)}"
    label="${ifDefined(label)}"
    required="${ifDefined(required)}"
    errorState="${ifDefined(errorState)}"
    message="${ifDefined(message)}"
  >
    ${unsafeHTML(slot)}
  </dss-button-group>
`;

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: 'Select this',
  slot: `
    <dss-toggle-button>One</dss-toggle-button>
  `,
};

export const Required = Template.bind({});
Required.args = {
  label: 'Select this',
  required: true,
  slot: `
    <dss-toggle-button>One</dss-toggle-button>
  `,
};

export const Warning = Template.bind({});
Warning.args = {
  label: 'Warning',
  errorState: 'warning',
  message: 'This button group is problematic',
  slot: `
    <dss-toggle-button>One</dss-toggle-button>
  `,
};

export const Error = Template.bind({});
Error.args = {
  label: 'Error',
  errorState: 'error',
  message: 'This button group is wrong',
  slot: `
    <dss-toggle-button>One</dss-toggle-button>
  `,
};

export const TwoButtons = Template.bind({});
TwoButtons.args = {
  slot: `
    <dss-toggle-button>One</dss-toggle-button>
    <dss-toggle-button>Two</dss-toggle-button>
  `,
};

export const ThreeButtons = Template.bind({});
ThreeButtons.args = {
  slot: `
    <dss-toggle-button>One</dss-toggle-button>
    <dss-toggle-button>Two</dss-toggle-button>
    <dss-toggle-button>Three</dss-toggle-button>
  `,
};

export const SelectedOption = Template.bind({});
SelectedOption.args = {
  slot: `
    <dss-toggle-button>One</dss-toggle-button>
    <dss-toggle-button>Two</dss-toggle-button>
    <dss-toggle-button>Three</dss-toggle-button>
  `,
  selectedIndex: 2,
};

export const WithIcons = Template.bind({});
WithIcons.args = {
  slot: `
    <dss-toggle-button>
      <dss-icon icon="plus"></dss-icon>
      One
    </dss-toggle-button>
    <dss-toggle-button>
      <dss-icon icon="minus"></dss-icon>
      Two
    </dss-toggle-button>
  `,
};
