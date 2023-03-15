import './input.component';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit-html';
import Input, { inputErrorStates, inputSizes } from './input.component';
import docs from './input.md?raw';
import docsDisabled from './input.disabled.md?raw';
import docsReadonly from './input.readonly.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { when } from 'lit-html/directives/when.js';

export default {
  title: 'Components/Input',
  component: 'dss-input',
  parameters: {
    actions: {
      handles: ['change', 'dss-input-debounced'],
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

const Template: Story<Input & {
  placeholder?: string,
  required?: boolean,
  disabled?: boolean,
  readonly?: boolean,
  inputSlot?: TemplateResult,
  inputButtonSlot?: TemplateResult
}> = ({
  label,
  size,
  placeholder,
  errorState,
  required,
  message,
  block,
  disabled,
  readonly,
  inputSlot,
  inputButtonSlot,
  countToMax,
}) => html`
  <dss-input
    label=${ifDefined(label)}
    size=${ifDefined(size)}
    errorState="${ifDefined(errorState)}"
    message="${ifDefined(message)}"
    ?block=${block}
    .countToMax="${ifDefined(countToMax)}"
  >
    ${when(inputSlot,
      () => inputSlot,
      () => html`
        <input
          placeholder=${ifDefined(placeholder)}
          ?required="${required}"
          ?disabled="${disabled}"
          ?readonly="${readonly}"
        >
      `,
    )}
    ${when(inputButtonSlot, () => inputButtonSlot)}
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

export const Placeholder = Template.bind({});
Placeholder.args = {
  placeholder: 'Placeholder',
};

export const Readonly = Template.bind({});
Readonly.args = {
  readonly: true,
};
Readonly.parameters = {
  docs: {
    description: {
      story: docsReadonly,
    },
  },
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};
Disabled.parameters = {
  docs: {
    description: {
      story: docsDisabled,
    },
  },
};

export const InputWithButton = Template.bind({});
InputWithButton.args = {
  inputButtonSlot: html`
    <dss-button slot="input-button" type="icon-only">
      <dss-icon icon="calendar"></dss-icon>
    </dss-button>
  `,
};

export const Textarea = Template.bind({});
Textarea.args = {
  label: 'Textarea',
  countToMax: 255,
  inputSlot: html`
    <textarea placeholder="Write some text" ?required="${true}" rows="5" cols="30"></textarea>
  `,
};
