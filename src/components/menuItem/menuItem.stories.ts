import './menuItem.component';
import '../menuItem/menuItem.component';
import { html, TemplateResult } from 'lit-html';
import { Meta, Story } from '@storybook/web-components';
import docs from './menuItem.md?raw';
import MenuItem from './menuItem.component';
import { ifDefined } from 'lit-html/directives/if-defined.js';

export default {
  title: 'Components/MenuItem',
  component: 'dss-menu-item',
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vN8eRqwHQLrnGFkcxL7Z4W/UI-Design-System-2.1?node-id=3427%3A15650&t=X21M4RjqHu66Vy0F-0',
    },
    docs: {
      description: {
        component: docs,
      },
    },
  },
} as Meta<MenuItem>;

const Template: Story<MenuItem & { itemSlot: TemplateResult }> = (
  {
    value,
    itemSlot,
  }) => {
  return html`
    <style>
      dss-menu-item {
        max-width: 20rem;
        border-radius: 0.5rem;
        box-shadow: 0 0 1rem 0 rgb(0 0 0 / 20%);
      }
    </style>

    <dss-menu-item
      value="${ifDefined(value)}"
    >
      ${itemSlot}
    </dss-menu-item>
  `;
};

export const Default = Template.bind({});
Default.args = {
  itemSlot: html`Menu Item`,
};

export const Icon = Template.bind({});
Icon.args = {
  itemSlot: html`
    <dss-icon icon="pencil" size="medium"></dss-icon>Edit`,
};

export const Checkbox = Template.bind({});
Checkbox.args = {
  itemSlot: html`
    <dss-checkbox size="compact" label="Check" tabindex="-1"></dss-checkbox>`,
};

export const PrimitiveValue = Template.bind({});
PrimitiveValue.args = {
  value: 'Primitive Value',
  itemSlot: html`Primitive Value`,
};

export const ObjectValue = Template.bind({});
ObjectValue.args = {
  value: { id: 42, text: 'Object Value' },
  itemSlot: html`Object Value`,
};
