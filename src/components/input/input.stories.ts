import './input.component';
import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit-html';
import Input, { inputErrorStates, inputSizes } from './input.component';
import docs from './input.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';

export default {
  title: 'Components/Input',
  component: 'dss-input',
  parameters: {
    actions: {
      handles: ['dss-input-debounced'],
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vN8eRqwHQLrnGFkcxL7Z4W/dss-Connect-Design?node-id=1596%3A5325&t=IX1FHJxHq9AlLNN0-0',
    },
    docs: {
      description: {
        component: docs,
      },
    },
  },
  argTypes: {
    errorState: {
      options: inputErrorStates,
      control: { type: 'select' },
    },
    size: {
      options: inputSizes,
      control: { type: 'select' },
    },
  },
} as Meta;

const Template: Story<Input & { placeholder?: string, required?: boolean }> = ({
  label,
  size,
  placeholder,
  errorState,
  required,
  message,
}) => html`
  <dss-input
    label=${ifDefined(label)}
    size=${ifDefined(size)}
    errorState="${ifDefined(errorState)}"
    message="${ifDefined(message)}"
  >
    <input placeholder=${ifDefined(placeholder)} ?required="${required}">
  </dss-input>
`;
export const Default = Template.bind({});
Default.args = {
  label: 'Label',
  placeholder: 'Placeholder',
};

export const Compact = Template.bind({});
Compact.args = {
  size: 'compact',
};

export const Label = Template.bind({});
Label.args = {
  label: 'Label',
};

export const Required = Template.bind({});
Required.args = {
  label: 'Required Input',
  required: true,
};

export const Warning = Template.bind({});
Warning.args = {
  label: 'Input with warning',
  errorState: 'warning',
  message: 'This input is problematic',
};

export const Error = Template.bind({});
Error.args = {
  label: 'Input with error',
  errorState: 'error',
  message: 'This input is wrong',
};

const PlaceholderTemplate: Story = () => html`
  <dss-input>
    <input placeholder="Placeholder" class="placeholder">
  </dss-input>
`;
export const Placeholder = PlaceholderTemplate.bind({});

const DisabledTemplate: Story = () => html`
  <dss-input>
    <input disabled value="Disabled">
  </dss-input>
`;
export const Disabled = DisabledTemplate.bind({});

const InputWithButtonTemplate: Story = () => html`
  <dss-input style="display: inline-block">
    <input>
    <dss-button slot="input-button" type="icon-only">
      <dss-icon icon="calendar"></dss-icon>
    </dss-button>
  </dss-input>
`;
export const InputWithButton = InputWithButtonTemplate.bind({});
