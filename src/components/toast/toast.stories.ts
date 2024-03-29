import { Meta, StoryFn } from '@storybook/web-components';
import docs from './toast.md?raw';
import Toast, { toastTypes } from './toast.component';
import { html } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import './toast.component';

const meta: Meta<Toast> = {
  title: 'Components/Toast',
  component: 'dss-toast',
  argTypes: {
    type: { control: 'select', options: toastTypes },
  },
  parameters: {
    actions: {
      handles: ['dss-toast-closed'],
    },
    docs: {
      description: {
        component: docs,
      },
    },
  },
};
// noinspection JSUnusedGlobalSymbols
export default meta;

const Template: StoryFn<Toast> = ({ type, heading, message, closable }) => html`
  <dss-toast
    type="${ifDefined(type)}"
    heading="${ifDefined(heading)}"
    message="${ifDefined(message)}"
    ?closable="${closable}"
  ></dss-toast>
`;

export const Error = Template.bind({});
Error.args = {
  type: 'error',
  heading: 'Error',
  message: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
};

export const Warning = Template.bind({});
Warning.args = {
  type: 'warning',
  heading: 'Warning',
  message: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
};

export const Info = Template.bind({});
Info.args = {
  type: 'info',
  heading: 'Information',
  message: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
};

export const Closable = Template.bind({});
Closable.args = {
  heading: 'Information',
  message: 'This toast can be closed. This story will not remove the toast on the thrown event.',
  closable: true,
};
