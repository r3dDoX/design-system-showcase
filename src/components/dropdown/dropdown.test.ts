import './dropdown.component';
import '../icon/icon.component';
import '../input/input.component';
import '../menu/menu.component';
import '../menuItem/menuItem.component';
import { describe, expect, test, vi } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { screen } from 'shadow-dom-testing-library';
import Dropdown from './dropdown.component';
import { fireEvent } from '@testing-library/dom';
import { ActionKeystrokes } from '../../internals/baseElement/baseElement';

describe('Dropdown', () => {
  describe('with a menu item', () => {
    const text = 'MenuItem';
    const fixtureWithOneMenuItem = async () => {
      return await fixture(html`
        <dss-dropdown>
          <dss-menu>
            <dss-menu-item>${text}</dss-menu-item>
          </dss-menu>
        </dss-dropdown>
      `) as HTMLElementTagNameMap['dss-dropdown'];
    };

    test('renders menu item', async () => {
      const element = await fixtureWithOneMenuItem() as Dropdown;
      await elementUpdated(element);

      expect(screen.getByShadowText(text, { exact: false }));
    });

    test('"aria-expanded" tracks floating element "active"', async () => {
      const element = await fixtureWithOneMenuItem();

      const trigger = screen.getByShadowRole('listbox');
      const floatingElement = element.shadowRoot!.querySelector('dss-floating')!;

      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(floatingElement.active).toBe(false);

      trigger.click();
      await elementUpdated(element);

      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(floatingElement.active).toBe(true);

      fireEvent.focusOut(trigger);
      await elementUpdated(element);

      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(floatingElement.active).toBe(false);
    });

    test('when user clicks on dropdown trigger, toggles dropdown', async () => {
      const element = await fixtureWithOneMenuItem();

      const trigger = screen.getByShadowRole('listbox');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');

      trigger.click();
      await elementUpdated(element);

      expect(trigger.getAttribute('aria-expanded')).toBe('true');

      trigger.click();
      await elementUpdated(element);

      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    test('when user clicks on disabled dropdown trigger, does not toggle dropdown', async () => {
      const element = await fixtureWithOneMenuItem();
      element.disabled = true;
      await elementUpdated(element);

      const trigger = screen.getByShadowRole('listbox');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');

      trigger.click();
      await elementUpdated(element);

      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    test.each(ActionKeystrokes)('when user presses key "%s" on dropdown trigger, toggles dropdown', async (key) => {
      const element = await fixtureWithOneMenuItem();

      const trigger = screen.getByShadowRole('listbox');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');

      fireEvent.keyDown(trigger, { key });
      await elementUpdated(element);

      expect(trigger.getAttribute('aria-expanded')).toBe('true');

      fireEvent.keyDown(trigger, { key });
      await elementUpdated(element);

      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    test('when options lose focus, close menu', async () => {
      const element = await fixtureWithOneMenuItem();

      const trigger = screen.getByShadowRole('listbox');
      const options = screen.getAllByShadowRole('menuitem');

      trigger.click();
      await elementUpdated(element);
      expect(trigger.getAttribute('aria-expanded')).toBe('true');

      options[0].focus();
      await elementUpdated(element);
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(options[0]).toHaveFocus();

      fireEvent.focusOut(options[0]);
      await elementUpdated(element);
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    test('when user presses "Escape" with the trigger in focus, closes dropdown', async () => {
      const element = await fixtureWithOneMenuItem();

      const trigger = screen.getByShadowRole('listbox');

      trigger.click();
      await elementUpdated(element);

      expect(trigger.getAttribute('aria-expanded')).toBe('true');

      fireEvent.keyDown(trigger, { key: 'Escape' });
      await elementUpdated(element);

      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    test('when user presses "Escape" with the menu in focus, closes dropdown', async () => {
      const element = await fixtureWithOneMenuItem();

      const trigger = screen.getByShadowRole('listbox');
      trigger.click();
      await elementUpdated(element);

      expect(trigger.getAttribute('aria-expanded')).toBe('true');

      const menu = screen.getByRole('menu');
      fireEvent.keyDown(menu, { key: 'Escape' });
      await elementUpdated(element);

      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    test('when user selects option, displays option in input element, closes dropdown', async () => {
      const element = await fixtureWithOneMenuItem();

      const trigger = screen.getByShadowRole('listbox');
      trigger.click();
      await elementUpdated(element);

      expect(trigger.getAttribute('aria-expanded')).toBe('true');

      const optionSelected = screen.getByShadowRole('menuitem');
      fireEvent.click(optionSelected, { detail: 1 });
      await elementUpdated(element);

      const inputElement = screen.getByShadowRole('textbox') as HTMLElementTagNameMap['dss-dropdown'];

      expect(inputElement.value).toBe(text);
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });
  });

  test('with keepOpenOnSelect, when user selects option, does not close', async () => {
    const element = await fixture(html`
      <dss-dropdown keepOpenOnSelect>
        <dss-menu>
          <dss-menu-item></dss-menu-item>
        </dss-menu>
      </dss-dropdown>
    `) as HTMLElementTagNameMap['dss-dropdown'];

    const trigger = screen.getByShadowRole('listbox');
    trigger.click();
    await elementUpdated(element);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    const optionSelected = screen.getByShadowRole('menuitem');
    optionSelected.click();
    await elementUpdated(element);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  describe('when there are multiple menu items', () => {
    const fixtureWithThreeMenuItems = async () => {
      return await fixture(html`
        <dss-dropdown>
          <dss-menu>
            <dss-menu-item></dss-menu-item>
            <dss-menu-item></dss-menu-item>
            <dss-menu-item></dss-menu-item>
          </dss-menu>
        </dss-dropdown>
      `);
    };

    test('when user presses "Down" with the menu in focus, focuses on the first option', async () => {
      const element = await fixtureWithThreeMenuItems();

      const trigger = screen.getByShadowRole('listbox');
      const options = screen.getAllByShadowRole('menuitem');

      expect(options[0]).not.toHaveFocus();

      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      await elementUpdated(element);
      expect(options[0]).toHaveFocus();
    });

    test('when user presses "Home" with the menu in focus, focuses on the first option', async () => {
      await fixtureWithThreeMenuItems();

      const trigger = screen.getByShadowRole('listbox');
      const options = screen.getAllByShadowRole('menuitem');

      expect(options[0]).not.toHaveFocus();

      fireEvent.keyDown(trigger, { key: 'Home' });

      expect(options[0]).toHaveFocus();
    });

    test('when user presses "Up" with the menu in focus, focuses on the last option', async () => {
      await fixtureWithThreeMenuItems();

      const trigger = screen.getByShadowRole('listbox');
      const options = screen.getAllByShadowRole('menuitem');

      expect(options[2]).not.toHaveFocus();

      fireEvent.keyDown(trigger, { key: 'ArrowUp' });

      expect(options[2]).toHaveFocus();
    });

    test('when user presses "End" with the menu in focus, focuses on the first option', async () => {
      await fixtureWithThreeMenuItems();

      const trigger = screen.getByShadowRole('listbox');
      const options = screen.getAllByShadowRole('menuitem');

      expect(options[2]).not.toHaveFocus();

      fireEvent.keyDown(trigger, { key: 'End' });

      expect(options[2]).toHaveFocus();
    });
  });

  describe('when there is an icon-only button trigger', async () => {
    test('when the user clicks on the icon, it opens the dropdown', async () => {
      const iconTestId = 'icon';
      const element: HTMLElementTagNameMap['dss-dropdown'] = await fixture(html`
        <dss-dropdown>
          <dss-button type="icon-only" slot="trigger">
            <dss-icon icon="navigate_beginning" size="large" data-testid="${iconTestId}"></dss-icon>
          </dss-button>
          <dss-menu>
            <dss-menu-item></dss-menu-item>
          </dss-menu>
        </dss-dropdown>
      `);

      expect(element).not.toHaveAttribute('open');

      const icon = screen.getByShadowTestId(iconTestId);
      icon.click();
      await elementUpdated(element);

      expect(element).toHaveAttribute('open');
    });
  });

  describe('when used as form element', async () => {
    test('emits value to FormData', async () => {
      const form: HTMLFormElement = await fixture(html`
        <form>
          <dss-dropdown name="dropdown" value="test"></dss-dropdown>
        </form>
      `);

      const data = new FormData(form);
      expect(data.get('dropdown')).toBe('test');
    });

    test('when passing toFormValue function, emits transformed value to FormData', async () => {
      const complexValue = {
        id: 123,
        name: 'test',
      };
      const form: HTMLFormElement = await fixture(html`
        <form>
          <dss-dropdown
            name="dropdown"
            .value="${complexValue}"
            .toFormValue="${(value: typeof complexValue) => value.id}"
          ></dss-dropdown>
        </form>
      `);

      const data = new FormData(form);
      expect(data.get('dropdown')).toBe('123');
    });

    test('when passing label, is selectable by its text', async () => {
      await fixture(html`
        <dss-dropdown name="dropdown" label="test"></dss-dropdown>
      `);

      expect(screen.getByShadowLabelText('test')).toBeInTheDocument();
    });
  });

  test('when setting required, passes required flag to native input', async () => {
    await fixture(html`
      <dss-dropdown required="${true}"></dss-dropdown>`);

    expect(screen.getByShadowRole('textbox')).toHaveAttribute('required');
  });

  test('with a selected menu item, selects menu item', async () => {
    const listenerSpy = vi.fn();
    await fixture(html`
      <dss-dropdown @dss-menu-selection=${listenerSpy}>
        <dss-menu>
          <dss-menu-item selected>Selected</dss-menu-item>
          <dss-menu-item>Not selected</dss-menu-item>
        </dss-menu>
      </dss-dropdown>
    `);

    expect((screen.getByShadowRole('textbox') as HTMLInputElement).value).toBe('Selected');
    expect(listenerSpy).toHaveBeenCalledOnce();
  });
});


