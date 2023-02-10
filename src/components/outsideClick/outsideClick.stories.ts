import './outsideClick.component';
import { html } from 'lit-html';
import { useState } from '@storybook/addons';
import { Meta } from '@storybook/web-components';
import docs from './outsideClick.md?raw';

export default {
  title: 'Components/OutsideClick',
  component: 'dss-outside-click',
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} as Meta;

const Template = () => {
  const [afterClickMessage, setAfterClickMessage] = useState('CLICK SOMEWHERE');

  const handleClickDetect = () => {
    setAfterClickMessage('OUTSIDE CLICK DETECTED');
    setTimeout(() => {
      setAfterClickMessage('CLICK SOMEWHERE');
    }, 1000);
  };

  return html`
    <style>
      .outside-container {
        display: flex;
        align-items: center;
        gap: 3rem;
        margin: 3rem;
      }

      .inside-container {
        border: .5rem solid var(--color-background-secondary);
        background-color: var(--color-action-tertiary);
        content: "";
        display: block;
        width: fit-content;
        padding: 5rem;
        box-shadow: 0 .8rem 1.6rem 0 var(--color-font-primary);
      }

      .inside-container:active {
        background-color: var(--color-action-primary);
      }
    </style>

    <div class="outside-container">
      <dss-outside-click .onOutsideClick=${handleClickDetect}>
        <div class="inside-container"> Inside</div>
      </dss-outside-click>

      <div> ${afterClickMessage}</div>
    </div>
  `;
};

export const Default = Template.bind({});
