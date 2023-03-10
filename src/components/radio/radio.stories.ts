import './radio.component';
import { html } from 'lit-html';
import { Meta, Story } from '@storybook/web-components';
import Radio from './radio.component';
import docs from './radio.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { inputErrorStates, inputSizes } from '../input/input.component';

export default {
  title: 'Components/Radio',
  component: 'dss-radio',
  argTypes: {
    size: { control: 'select', options: inputSizes },
    errorState: { control: 'select', options: inputErrorStates },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vN8eRqwHQLrnGFkcxL7Z4W/dss-Connect-Design?node-id=1596%3A5325&t=zVqMtRAqzxIGgh9q-0',
    },
    docs: {
      description: {
        component: docs,
      },
    },
  },
} as Meta;

const Template: Story<Radio> = ({ label, size, errorState, message }) => {
  return html`
    <dss-radio
      .size=${ifDefined(size)}
      .label=${label}
      .errorState="${ifDefined(errorState)}"
      .message="${ifDefined(message)}"
      style="padding: .3rem .3rem .3rem .8rem;"
    >
      <input type="radio">
    </dss-radio>
  `;
};

export const Default = Template.bind({});
Default.args = {
  label: 'Radio mit Text',
};

export const Warning = Template.bind({});
Warning.args = {
  label: 'Option 1',
  errorState: 'warning',
  message: 'This radio is problematic',
};

export const Error = Template.bind({});
Error.args = {
  label: 'Option 7',
  errorState: 'error',
  message: 'This radio is wrong',
};

const DisabledTemplate: Story<Radio> = ({ label }) => {
  return html`
    <dss-radio .label=${`${label} unchecked`} style="padding: .3rem .3rem .3rem .8rem;">
      <input type="radio" disabled>
    </dss-radio>

    <dss-radio .label=${`${label} checked`} style="padding: .3rem .3rem .3rem .8rem;">
      <input type="radio" checked disabled>
    </dss-radio>
  `;
};

export const Disabled = DisabledTemplate.bind({});
Disabled.args = {
  label: 'Disabled Radio',
};

const MultipleRadios: Story<Radio> = () => {
  return html`
    <style>
      .add-spacing {
        padding-left: var(--size-spacing-0-5);
        display: flex;
        flex-direction: column;
      }
    </style>

    <div class="add-spacing">
      <p style="margin-bottom: var(--size-spacing-1)">Group 1</p>
      <dss-radio label='Radio 1'>
        <input id="choice1" type="radio" name="sameGroup" checked>
      </dss-radio>

      <dss-radio label='Radio 2'>
        <input id="choice2" type="radio" name="sameGroup">
      </dss-radio>
    </div>

    <br>

    <div class="add-spacing">
      <p style="margin-bottom: var(--size-spacing-1)">Group 2</p>
      <dss-radio label='Radio 1'>
        <input id="choice1" type="radio" name="otherGroup">
      </dss-radio>

      <dss-radio label='Radio 2'>
        <input id="choice2" type="radio" name="otherGroup">
      </dss-radio>

      <dss-radio label='Radio 3'>
        <input id="choice3" type="radio" name="otherGroup">
      </dss-radio>
    </div>
  `;
};

export const Multiple = MultipleRadios.bind({});
Multiple.args = {
  label: 'Multiple Radio Buttons',
};
