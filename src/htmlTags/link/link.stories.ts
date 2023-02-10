import { html } from 'lit-html';
import { Meta, Story } from '@storybook/web-components';
import docs from './link.md?raw';

export default {
  title: 'HTML Tags/Link <a>',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vN8eRqwHQLrnGFkcxL7Z4W/dss-Connect-Design?node-id=1126%3A3030&t=tMlQwdNbySjHXpZp-4',
    },
    docs: {
      description: {
        component: docs,
      },
    },
  },
} as Meta<HTMLLinkElement>;

const Template: Story<HTMLLinkElement> = () => html`
    <a href="/">Link/action within app</a>
`;

export const Default = Template.bind({});

const ExternalTemplate: Story<HTMLLinkElement> = () => html`
    <a href="https://www.dreyfusbank.ch/">
      Link to external application or web page
      <dss-icon icon="external_link"></dss-icon>
    </a>
`;

export const External = ExternalTemplate.bind({});

const InternalTemplate: Story<HTMLLinkElement> = () => html`
    <a href="/">Link/action within app</a>
`;

export const Internal = InternalTemplate.bind({});

