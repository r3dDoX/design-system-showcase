import './buttongroup.component';
import '../toggleButton/toggleButton.component';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { describe, expect, test } from 'vitest';
import ButtonGroup from './buttongroup.component';
import { screen } from 'shadow-dom-testing-library';

describe('Buttongroup', () => {
  test('when given a label, is selectable by it', async () => {
    await fixture(html`
      <dss-button-group label="Select">
        <dss-toggle-button>One</dss-toggle-button>
      </dss-button-group>
    `);

    expect(screen.getByShadowLabelText('Select')).toBeInTheDocument();
  });

  test('when setting required, shows asterisk', async () => {
    await fixture(html`
      <dss-button-group label="Required" required="true">
        <dss-toggle-button>One</dss-toggle-button>
      </dss-button-group>
    `);
    expect(screen.queryByShadowText('*')).toBeInTheDocument();
    expect(screen.queryByShadowText('Required')).toBeInTheDocument();
  });

  test('when specifying values, emits selected button value into FormData', async () => {
    const formElement: HTMLFormElement = await fixture(html`
      <form name="test-form">
        <dss-button-group name="selection" selectedIndex="1">
          <dss-toggle-button value="one">One</dss-toggle-button>
          <dss-toggle-button value="two">Two</dss-toggle-button>
        </dss-button-group>
      </form>
    `);

    const formData = new FormData(formElement);
    expect(formData.get('selection')).toBe('two');
  });

  test('when required, sets validity to false when no button selected', async () => {
    const formElement: HTMLFormElement = await fixture(html`
      <form name="test-form">
        <dss-button-group name="selection" required="true">
          <dss-toggle-button value="one">One</dss-toggle-button>
        </dss-button-group>
      </form>
    `);

    expect(formElement).not.toBeValid();
  });

  test('when required, sets validity to true when button selected', async () => {
    const formElement: HTMLFormElement = await fixture(html`
      <form name="test-form">
        <dss-button-group name="selection" required="true" selectedIndex="0">
          <dss-toggle-button value="one">One</dss-toggle-button>
        </dss-button-group>
      </form>
    `);

    expect(formElement).toBeValid();
  });

  test('when given a single button, does not set any attributes', async () => {
    const element = await fixture(html`
      <dss-button-group>
        <dss-toggle-button>One</dss-toggle-button>
      </dss-button-group>`);

    const button = element.querySelector('dss-toggle-button')!;
    expect(button.removeRadius).toBe('none');
  });

  test('when given two buttons, sets attributes', async () => {
    const element = await fixture(html`
      <dss-button-group>
        <dss-toggle-button>One</dss-toggle-button>
        <dss-toggle-button>Two</dss-toggle-button>
      </dss-button-group>`);

    const buttons = element.querySelectorAll('dss-toggle-button')!;
    expect(buttons[0].removeRadius).toBe('right');
    expect(buttons[1].removeRadius).toBe('left');
  });

  describe('when group of buttons', function () {
    const fixtureWithThreeButtons = async () => await fixture(html`
      <dss-button-group>
        <dss-toggle-button>One</dss-toggle-button>
        <dss-toggle-button>Two</dss-toggle-button>
        <dss-toggle-button>Three</dss-toggle-button>
      </dss-button-group>
    `) as HTMLElementTagNameMap['dss-button-group'];


    test('given a group of buttons, renders a group of buttons', async () => {
      const element = await fixtureWithThreeButtons();

      const buttons = element.querySelectorAll('dss-toggle-button')!;
      expect(buttons).toHaveLength(3);
      expect(buttons[0].textContent).toContain('One');
      expect(buttons[1].textContent).toContain('Two');
      expect(buttons[2].textContent).toContain('Three');
    });

    test('given three buttons, sets attributes', async () => {
      const element = await fixtureWithThreeButtons();

      const buttons = element.querySelectorAll('dss-toggle-button')!;
      expect(buttons[0].removeRadius).toBe('right');
      expect(buttons[1].removeRadius).toBe('all');
      expect(buttons[2].removeRadius).toBe('left');
    });
  });

  describe('when button is selected', function () {
    const fixtureWithTwoButtonsSecondSelected = async () => {
      return await fixture(html`
        <dss-button-group selectedIndex="1">
          <dss-toggle-button>One</dss-toggle-button>
          <dss-toggle-button>Two</dss-toggle-button>
        </dss-button-group>`) as HTMLElementTagNameMap['dss-button-group'];
    };

    test('pre-selects a button', async () => {
      const element = await fixtureWithTwoButtonsSecondSelected();

      const buttons = element.querySelectorAll('dss-toggle-button')! as NodeListOf<HTMLElementTagNameMap['dss-toggle-button']>;
      expect(buttons[0].selected).toBe(false);
      expect(buttons[1].selected).toBe(true);
    });

    test('selects a button', async () => {
      const element: ButtonGroup = await fixtureWithTwoButtonsSecondSelected();

      const buttons = element.querySelectorAll('dss-toggle-button')! as NodeListOf<HTMLElementTagNameMap['dss-toggle-button']>;
      expect(buttons[0].selected).toBe(false);
      expect(buttons[1].selected).toBe(true);

      buttons[0].click();
      await elementUpdated(element);

      expect(buttons[0].selected).toBe(true);
      expect(buttons[1].selected).toBe(false);
    });

    test('when user clicks on something inside a button, selects the button', async () => {
      const element: ButtonGroup = await fixture(html`
        <dss-button-group>
          <dss-toggle-button>One</dss-toggle-button>
          <dss-toggle-button>
            <dss-icon icon="navigate_plus" data-testid="icon">Two</dss-icon>
          </dss-toggle-button>
        </dss-button-group>`);

      screen.getByTestId('icon').click();
      await elementUpdated(element);

      expect(element.selectedIndex).toBe(1);
    });
  });
});
