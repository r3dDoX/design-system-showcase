import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit-html';
import './tooltip.component';
import Tooltip from './tooltip.component';
import { placementOptions } from '../../internals/floatingElement/floatingElement';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import docs from './tooltip.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';

export default {
  title: 'Components/Tooltip',
  component: 'dss-tooltip',
  argTypes: {
    placement: {
      control: 'select',
      options: placementOptions,
    },
  },
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} as Meta;

const Template: Story<Tooltip> = ({ slot, placement }) => html`
  <div style="margin: 20rem; display: inline-block">
    <dss-tooltip placement="${ifDefined(placement)}">
      <dss-button type="secondary" slot="trigger">
        Test
      </dss-button>
      ${unsafeHTML(slot)}
    </dss-tooltip>
  </div>
`;

export const Default = Template.bind({});
Default.args = {
  slot: 'My Tooltip',
};

export const Complex = Template.bind({});
Complex.args = {
  slot: `
    <p style="display: flex; gap: 1rem;">
      <dss-icon icon="pencil"></dss-icon>
      Test 1
    </p>
  `,
};
