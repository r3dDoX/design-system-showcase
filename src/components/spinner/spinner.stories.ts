import './spinner.component';
import '../icon/icon.component';
import Spinner, { spinnerTypes } from './spinner.component';
import { html } from 'lit-html';
import { Meta, Story } from '@storybook/web-components';
import docs from './spinner.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';

const meta: Meta<Spinner> = {
  title: 'Components/Spinner',
  component: 'dss-spinner',
  argTypes: {
    type: { control: 'select', options: spinnerTypes },
  },
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
};
// noinspection JSUnusedGlobalSymbols
export default meta;

const Template: Story<Spinner> = ({ type }) => html`
  <dss-spinner
    type=${ifDefined(type)}
  >
  </dss-spinner>
`;

export const Default = Template.bind({});
Default.args = {};

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  type: 'secondary',
};

const GhostTemplate: Story<Spinner> = () => html`
  <dss-button disabled>Ghost
    <dss-spinner
      type='ghost'
    >
    </dss-spinner>
  </dss-button>
`;
export const Ghost = GhostTemplate.bind({});

const TextTemplate: Story<Spinner> = () => html`
  <p>Legen... wait for it!
    <dss-spinner>
    </dss-spinner>
    dary!
  </p>
`;
export const Text = TextTemplate.bind({});
Text.args = {
  type: 'ghost',
};
