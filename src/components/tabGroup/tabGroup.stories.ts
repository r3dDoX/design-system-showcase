import './tabGroup.component';
import { html } from 'lit-html';
import { Story } from '@storybook/web-components';
import docs from './tabGroup.md?raw';
import TabGroup from './tabGroup.component';
import { useState } from '@storybook/addons';
import { TabDataInterface } from '../tab/tab.component';

export default {
  title: 'Components/Tab Group',
  component: 'dss-tab-group',
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vN8eRqwHQLrnGFkcxL7Z4W/UI-Design-System-2.1?node-id=2753%3A12522&t=CvW3TJcB5uoRQrVh-0 ',
    },
    docs: {
      description: {
        component: docs,
      },
    },
    actions: {
      handles: ['dss-tab-close'],
    },
  },
};

const tabCloseHandler = (event: CustomEvent, tabs: TabDataInterface[], activeTab: string | undefined, setActiveTab: (activeTab: string) => void, setTabsState: (tabs: TabDataInterface[]) => void) => {
  if (event.detail === activeTab) {
    setActiveTab(tabs.find(tab => tab.title !== event.detail)?.title ?? '');
  }
  setTabsState(tabs.filter(tab => tab.title !== event.detail));
};

const Template: Story<TabGroup> = ({ tabs, activeTabTitle, translations }) => {
  const [tabsState, setTabsState] = useState(tabs);
  const [activeTab, setActiveTab] = useState(activeTabTitle);

  return html`
    <style>
      .wrapper {
        padding-left: var(--size-spacing-4);
      }
    </style>

    <div class="wrapper">
      <dss-tab-group
        .tabs=${tabsState}
        .activeTabTitle=${activeTab}
        .onTabActivated=${setActiveTab}
        .translations="${translations}"
        .onTabClose=${(event: CustomEvent) => tabCloseHandler(event, tabsState, activeTab, setActiveTab, setTabsState)}
      ></dss-tab-group>
    </div>
  `;
};

export const Default = Template.bind({});
Default.args = {
  tabs: [
    {
      title: 'Tab 1',
    },
    {
      title: 'Tab 2',
    },
  ],

  activeTabTitle: 'Tab 1',
};


const FoldedTemplate: Story<TabGroup> = ({ tabs, activeTabTitle }) => {
  const [tabsState, setTabsState] = useState(tabs);
  const [activeTab, setActiveTab] = useState(activeTabTitle);

  return html`
    <style>
      .wrapper {
        padding-left: var(--size-spacing-4);
      }
    </style>

    <div class="wrapper">
      <dss-tab-group
        .tabs=${tabsState}
        .activeTabTitle=${activeTab}
        .onTabActivated=${setActiveTab}
        .onTabClose=${(event: CustomEvent) => tabCloseHandler(event, tabsState, activeTab, setActiveTab, setTabsState)}
      ></dss-tab-group>
    </div>
  `;
};

export const Folded = FoldedTemplate.bind({});
Folded.args = {
  tabs: [
    {
      title: 'Tab 1',
    },
    {
      title: 'Tab 2',
    },
    {
      title: 'Tab 3',
    },
    {
      title: 'Tab 4',
    },
    {
      title: 'Tab 5',
    },
    {
      title: 'Tab 6',
    },
    {
      title: 'Tab 7',
    },
  ],

  activeTabTitle: 'Tab 2',
};
