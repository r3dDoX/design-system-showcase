import docs from './label.md?raw';
import { Story } from '@storybook/web-components';
import Label from './label.component';
import { html } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import './label.component';

export default {
  title: 'Components/Label',
  component: 'dss-label',
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
};

const Template: Story<Label> = ({ label, required }) => html`
  <dss-label label="${ifDefined(label)}" required="${ifDefined(required)}"></dss-label>
`;

export const Default = Template.bind({});
Default.args = {
  label: 'Standard Label',
};

export const RequiredProperty = Template.bind({});
RequiredProperty.args = {
  label: 'Required Label',
  required: true,
};

const RequiredStyleTemplate: Story<Label> = ({ label }) => html`
  <style>
    .required-style::part(required) {
      display: inline;
    }
  </style>
  <dss-label class="required-style" label="${ifDefined(label)}"></dss-label>
`;

export const RequiredStyle = RequiredStyleTemplate.bind({});
RequiredStyle.args = {
  label: 'Required Label',
};
