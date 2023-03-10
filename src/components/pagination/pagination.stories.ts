import './pagination.component';
import { html } from 'lit-html';
import { Meta, Story } from '@storybook/web-components';
import docs from './pagination.md?raw';
import Pagination from './pagination.component';

export default {
  title: 'Components/Pagination',
  component: 'dss-pagination',
  parameters: {
    actions: {
      handles: ['dss-pagination-page-index-selected'],
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vN8eRqwHQLrnGFkcxL7Z4W/dss-Connect-Design?node-id=531%3A2886&t=pCiTHJvGpYAJtQ9H-0',
    },
    docs: {
      description: {
        component: docs,
      },
    },
  },
} as Meta;

const Template: Story<Pagination> = ({ pageCount, activePageIndex }) => html`
  <dss-pagination .pageCount=${pageCount} .activePageIndex=${activePageIndex}></dss-pagination>
`;

export const Default = Template.bind({});
Default.args = {
  activePageIndex: 0,
  pageCount: 10,
};
