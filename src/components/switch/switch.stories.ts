import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit-html';
import Switch from './switch.component';
import docs from './switch.md?raw';
import './switch.component';

export default {
  title: 'Components/Switch',
  component: 'dss-switch',
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
    actions: {
      handles: ['change'],
    },
  },
} as Meta;

const Template: Story<Switch> = ({ checked, disabled }) => html`
  <dss-switch ?checked="${checked}" ?disabled="${disabled}"></dss-switch>
`;


export const Default = Template.bind({});
Default.args = {};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};
