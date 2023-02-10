import { html } from 'lit-html';
import { Meta, Story } from '@storybook/web-components';
import docs from './style.md?raw';

export default {
  title: 'Components/Style',
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} as Meta;

const DefaultTemplate: Story = () => html`
  <dss-style>
    <div>Applikation</div>
  </dss-style>
`;

export const Default = DefaultTemplate.bind({});
