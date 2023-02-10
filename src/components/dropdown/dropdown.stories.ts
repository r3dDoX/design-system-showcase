import './dropdown.component';
import { html, TemplateResult } from 'lit-html';
import Dropdown, { dropdownSizes } from './dropdown.component';
import { Meta, Story } from '@storybook/web-components';
import docs from './dropdown.md?raw';
import docsSelected from './dropdown.selected.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { newPerson, range } from '../table/makeData.story-utils';

export default {
  title: 'Components/Dropdown',
  component: 'dss-dropdown',
  argTypes: {
    size: {
      control: 'select',
      options: dropdownSizes,
    },
  },
  parameters: {
    actions: {
      handles: ['dss-menu-selection'],
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vN8eRqwHQLrnGFkcxL7Z4W/UI-Design-System-2.1?node-id=1621%3A5206&t=VACiIkO9SvQoWfW4-0',
    },
    docs: {
      description: {
        component: docs,
      },
    },
  },
} as Meta;


const Template: Story<Dropdown & { optionsSlot: TemplateResult }> = (
  {
    optionsSlot,
    editable,
    size,
    keepOpenOnSelect,
    icon,
    disabled,
    label,
    required,
    errorState,
    message,
  }) => {
  return html`
    <dss-dropdown
      icon="${ifDefined(icon)}"
      size="${ifDefined(size)}"
      ?editable="${editable}"
      ?keepOpenOnSelect="${keepOpenOnSelect}"
      ?disabled="${disabled}"
      label="${ifDefined(label)}"
      required="${ifDefined(required)}"
      .errorState="${ifDefined(errorState)}"
      .message="${ifDefined(message)}"
    >
      <dss-menu>
        ${optionsSlot}
      </dss-menu>
    </dss-dropdown>
  `;
};


export const Default = Template.bind({});
Default.args = {
  optionsSlot: html`
    ${
      makeDropdownDate(5)
        .map(({ id, firstName, lastName }) => ({
            id,
            firstName,
            lastName,
          }),
        )
        .map(person => html`
          <dss-menu-item .value=${person}>${person.lastName}, ${person.firstName}</dss-menu-item>`)}`,
};

const InitialSelectionTemplate: Story<Dropdown> = () => html`
  <dss-dropdown>
    <dss-menu>
      <dss-menu-item>Not selected</dss-menu-item>
      <dss-menu-item selected>Initially selected</dss-menu-item>
    </dss-menu>
  </dss-dropdown>`;
export const InitialSelection = InitialSelectionTemplate.bind({});
InitialSelection.parameters = {
  docs: {
    description: {
      story: docsSelected,
    },
  },
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: 'Select option',
  optionsSlot: html`
    ${
      makeDropdownDate(5)
        .map(({ id, firstName, lastName }) => ({
            id,
            firstName,
            lastName,
          }),
        )
        .map(person => html`
          <dss-menu-item .value=${person}>${person.lastName}, ${person.firstName}</dss-menu-item>`)}`,
};

export const Required = Template.bind({});
Required.args = {
  label: 'Required option',
  required: true,
  optionsSlot: html`
    ${
      makeDropdownDate(5)
        .map(({ id, firstName, lastName }) => ({
            id,
            firstName,
            lastName,
          }),
        )
        .map(person => html`
          <dss-menu-item .value=${person}>${person.lastName}, ${person.firstName}</dss-menu-item>`)}`,
};

export const Warning = Template.bind({});
Warning.args = {
  label: 'Important',
  errorState: 'warning',
  message: 'This dropdown is problematic',
  optionsSlot: html`
    ${
      makeDropdownDate(5)
        .map(({ id, firstName, lastName }) => ({
            id,
            firstName,
            lastName,
          }),
        )
        .map(person => html`
          <dss-menu-item .value=${person}>${person.lastName}, ${person.firstName}</dss-menu-item>`)}`,
};

export const Error = Template.bind({});
Error.args = {
  label: 'Important',
  errorState: 'error',
  message: 'This dropdown is wrong',
  optionsSlot: html`
    ${
      makeDropdownDate(5)
        .map(({ id, firstName, lastName }) => ({
            id,
            firstName,
            lastName,
          }),
        )
        .map(person => html`
          <dss-menu-item .value=${person}>${person.lastName}, ${person.firstName}</dss-menu-item>`)}`,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

const options = html`
  <dss-menu-item value="edit">
    <dss-icon icon="pencil"></dss-icon>
    Bearbeiten
  </dss-menu-item>
  <hr>
  <dss-menu-item value="copy">
    <dss-icon icon="copy"></dss-icon>
    Kopieren
  </dss-menu-item>
  <dss-menu-item value="paste">
    <dss-icon icon="clipboard_paste"></dss-icon>
    Einfügen
  </dss-menu-item>
`;

export const WithIconsAndSeparator = Template.bind({});
WithIconsAndSeparator.args = {
  optionsSlot: options,
};

export const CustomIcon = Template.bind({});
CustomIcon.args = {
  icon: 'gearwheel',
  optionsSlot: options,
};

export const Compact = Template.bind({});
Compact.args = {
  size: 'compact',
  optionsSlot: options,
};

const CustomTriggerTemplate: Story<Dropdown & { optionsSlot: TemplateResult, triggerSlot: TemplateResult }> = ({
  optionsSlot,
  triggerSlot,
}) => html`
  <dss-dropdown
    placement="bottom"
    arrow
    style="margin: 20rem"
  >
    ${triggerSlot}
    <dss-menu>
      ${optionsSlot}
    </dss-menu>
  </dss-dropdown>
`;


export const CustomTriggerActionSheet = CustomTriggerTemplate.bind({});
CustomTriggerActionSheet.args = {
  optionsSlot: options,
  triggerSlot: html`
    <dss-button type="secondary" slot="trigger">
      Test
    </dss-button>
  `,
};

export const IconOnlyDropdown = CustomTriggerTemplate.bind({});
IconOnlyDropdown.args = {
  optionsSlot: options,
  triggerSlot: html`
    <dss-button type="icon-only" slot="trigger">
      <dss-icon icon="navigate_beginning" size="large"></dss-icon>
    </dss-button>
  `,
};

function makeDropdownDate(count: number) {
  return range(count).map((_, idx) => {
    return {
      ...newPerson(idx, true),
    };
  });
}
