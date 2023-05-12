import { Meta, StoryFn } from '@storybook/web-components';
import { html } from 'lit-html';
import './tag.component';
import Tag from './tag.component';
import docs from './tag.md?raw';

const meta: Meta<Tag> = {
  title: 'Components/Tag',
  component: 'dss-tag',
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
};
// noinspection JSUnusedGlobalSymbols
export default meta;

const Template: StoryFn<Tag> = ({ slot }) => html`
  <dss-tag>${slot}</dss-tag>
`;


export const Default = Template.bind({});
Default.args = {
  slot: 'Inaktiv: 12.02.2021',
};
