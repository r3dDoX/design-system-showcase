import './datepicker.component';
import { html } from 'lit-html';
import { Meta, Story } from '@storybook/web-components';
import Datepicker from './datepicker.component';
import docs from './datepicker.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';

export default {
  title: 'Components/Datepicker',
  component: 'dss-datepicker',
  argTypes: {
    value: { control: 'text' },
  },
  parameters: {
    actions: {
      handles: ['dss-datepicker-selection-change'],
    },
    docs: {
      description: {
        component: docs,
      },
    },
  },
} as Meta;

const DatePickerTemplate: Story<Datepicker> = ({ required, label, value, errorState, message }) => html`
  <dss-datepicker
    value="${value}"
    label="${ifDefined(label)}"
    required="${ifDefined(required)}"
    errorState="${ifDefined(errorState)}"
    message="${ifDefined(message)}"
    style="margin-bottom: 30rem"
  ></dss-datepicker>
`;

export const Default = DatePickerTemplate.bind({});

export const WithDefaultValue = DatePickerTemplate.bind({});
WithDefaultValue.args = {
  value: '2022.07.06',
};

export const WithLabel = DatePickerTemplate.bind({});
WithLabel.args = {
  label: 'Select Date',
};

export const Required = DatePickerTemplate.bind({});
Required.args = {
  label: 'Required Date',
  required: true,
};

export const Warning = DatePickerTemplate.bind({});
Warning.args = {
  label: 'Warning',
  errorState: 'warning',
  message: 'This date is problematic',
};

export const Error = DatePickerTemplate.bind({});
Error.args = {
  label: 'Error',
  errorState: 'error',
  message: 'This date is not acceptable',
};
