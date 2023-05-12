import './dropdown.component';
import { html, TemplateResult } from 'lit-html';
import Dropdown from './dropdown.component';
import { Meta, StoryFn } from '@storybook/web-components';
import docs from './dropdown.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { placementOptions } from '../../internals/floatingElement/floatingElement';
import { newPerson, range } from '../table/makeData.story-utils';

const meta: Meta<Dropdown> = {
  title: 'Components/Dropdown',
  component: 'dss-dropdown',
  argTypes: {
    placement: {
      control: 'select',
      options: placementOptions,
    },
  },
  parameters: {
    actions: {
      handles: ['change', 'dss-menu-selection'],
    },
    docs: {
      description: {
        component: docs,
      },
    },
  },
};
// noinspection JSUnusedGlobalSymbols
export default meta;

const Template: StoryFn<Dropdown & { optionsSlot: TemplateResult | TemplateResult[] }> = (
  {
    optionsSlot,
    editable,
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
      ?editable="${editable}"
      ?disabled="${disabled}"
      label="${ifDefined(label)}"
      .required="${ifDefined(required)}"
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
      makeDropdownData(5)
        .map(({ id, firstName, lastName }) => ({
            id,
            firstName,
            lastName,
          }),
        )
        .map(person => html`
          <dss-menu-item .value=${person}>${person.lastName}, ${person.firstName}</dss-menu-item>`)}`,
};

const InitialSelectionTemplate: StoryFn<Dropdown> = () => html`
  <dss-dropdown value="1">
    <dss-menu>
      <dss-menu-item value="0">Not selected</dss-menu-item>
      <dss-menu-item value="1">Initially selected</dss-menu-item>
    </dss-menu>
  </dss-dropdown>`;
export const InitialSelection = InitialSelectionTemplate.bind({});

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: 'Select option',
  optionsSlot: html`
    ${
      makeDropdownData(5)
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
      makeDropdownData(5)
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
      makeDropdownData(5)
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
      makeDropdownData(5)
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
    <dss-icon icon="edit"></dss-icon>
    Bearbeiten
  </dss-menu-item>
  <hr>
  <dss-menu-item value="copy">
    <dss-icon icon="copy"></dss-icon>
    Kopieren
  </dss-menu-item>
  <dss-menu-item value="paste">
    <dss-icon icon="arrow-down"></dss-icon>
    Einfügen
  </dss-menu-item>
`;

export const WithIconsAndSeparator = Template.bind({});
WithIconsAndSeparator.args = {
  optionsSlot: options,
};

export const CustomIcon = Template.bind({});
CustomIcon.args = {
  icon: 'settings',
  optionsSlot: options,
};

function makeDropdownData(count: number) {
  return range(count).map((_, idx) => {
    return {
      ...newPerson(idx, true),
    };
  });
}
