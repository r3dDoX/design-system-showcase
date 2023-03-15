import './tab.component';
import Tab from './tab.component';
import { html } from 'lit-html';
import { Story } from '@storybook/web-components';
import docs from './tab.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { useArgs } from '@storybook/addons';

export default {
  title: 'Components/Tab',
  component: 'dss-tab',
  argTypes: {
    title: { control: 'text' },
    isActive: { control: 'boolean' },
    isVisible: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
    actions: {
      handles: ['click button'],
    },
  },
};


const Template: Story<Tab> = ({ title, isVisible }) => {
  const [{ isActive }, updateArgs] = useArgs();

  const handleTabClick = () => {
    updateArgs({ isActive: true });
  };

  return html`
    <dss-tab
      .title=${ifDefined(title)}
      .isActive=${ifDefined(isActive)}
      .isVisible=${ifDefined(isVisible)}
      @click=${handleTabClick}
    >
    </dss-tab>
  `;
};

export const Default = Template.bind({});
Default.args = {
  title: 'Tab Title',
  isActive: false,
  isVisible: true,
};


