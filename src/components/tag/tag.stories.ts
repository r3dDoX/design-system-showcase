import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit-html';
import './tag.component';
import Tag from './tag.component';
import docs from './tag.md?raw';

export default {
  title: 'Components/Tag',
  component: 'dss-tag',
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

const Template: Story<Tag> = ({ slot }) => html`
  <dss-tag>${slot}</dss-tag>
`;


export const Default = Template.bind({});
Default.args = {
  slot: 'Inaktiv: 12.02.2021',
};
