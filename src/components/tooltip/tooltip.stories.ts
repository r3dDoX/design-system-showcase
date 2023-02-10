import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit-html';
import './tooltip.component';
import Tooltip from './tooltip.component';
import { placementOptions } from '../../internals/floatingElement/floatingElement';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import docs from './tooltip.md?raw';

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
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vN8eRqwHQLrnGFkcxL7Z4W/dss-Connect-Design?node-id=531%3A2885&t=zVqMtRAqzxIGgh9q-0',
    },
    docs: {
      description: {
        component: docs,
      },
    },
  },
} as Meta;

const Template: Story<Tooltip> = ({ slot, placement }) => html`
  <div style="margin: 20rem; display: inline-block">
    <dss-tooltip placement="${placement}">
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
  placement: 'auto',
};

export const Complex = Template.bind({});
Complex.args = {
  slot: `
    <p style="display: flex; gap: 1rem;">
      <dss-icon icon="pencil"></dss-icon>
      Test 1
    </p>
  `,
  placement: 'auto',
};
