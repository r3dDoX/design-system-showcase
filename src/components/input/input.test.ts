import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import './input.component';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { screen } from 'shadow-dom-testing-library';
import { fireEvent, waitFor } from '@testing-library/dom';
import Input, { DEFAULT_DEBOUNCE } from './input.component';

describe('Input', () => {
  describe('when specifying a label', () => {
    const fixtureWithLabel = async () => {
      return await fixture(html`
        <dss-input label="Label"><input data-testid="input"/></dss-input>
      `);
    };

    test('displays the label', async () => {
      await fixtureWithLabel();
      const label = screen.getByShadowText('Label');
      expect(label).toBeInTheDocument();
    });

    test('is selectable by its text', async () => {
      await fixtureWithLabel();
      expect(screen.getByLabelText('Label')).toBeInTheDocument();
    });

    test('focuses the input when clicking label', async () => {
      await fixtureWithLabel();
      const label = screen.getByShadowText('Label');
      label.click();
      const input = screen.getByTestId('input');
      await waitFor(() => expect(input).toHaveFocus());
    });
  });

  test('when erroneous with message, is selectable by message', async () => {
    await fixture(html`
      <dss-input errorstate="error" message="message"></dss-input>
    `);

    screen.getByShadowText('message');
  });

  test('when given max count, shows current count in utf-8 bytes', async () => {
    const element = await fixture(html`
      <dss-input .countToMax=${10}>
        <textarea></textarea>
      </dss-input>
    `);

    const input = screen.getByRole('textbox') as HTMLTextAreaElement;
    input.value = 'i ♥ u';
    fireEvent.input(input);
    await elementUpdated(element);

    expect(screen.queryByShadowText('7', { exact: false })).toBeInTheDocument();
    expect(screen.queryByShadowText('10', { exact: false })).toBeInTheDocument();
  });

  test('when counting, resets on form reset', async () => {
    const formElement = await fixture(html`
      <form>
        <dss-input .countToMax=${5} data-testid="inputComponent">
          <input>
        </dss-input>
      </form>
    `) as HTMLFormElement;

    const input = screen.getByRole('textbox') as HTMLInputElement;
    input.value = 'Test';
    fireEvent.input(input);
    await elementUpdated(screen.getByTestId('inputComponent'));

    expect(screen.queryByShadowText('4', { exact: false })).toBeInTheDocument();
    formElement.reset();
    // element internals polyfills unfortunately does not call this method
    (screen.getByTestId('inputComponent') as Input).formResetCallback();

    await elementUpdated(screen.getByTestId('inputComponent'));
    expect(screen.queryByShadowText('0', { exact: false })).toBeInTheDocument();
  });

  describe('when debouncing', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test('fires after default debounce time on input', async () => {
      const inputSpy = vi.fn();
      await fixture(html`
        <dss-input @dss-input-debounced=${inputSpy as any}>
          <input type="text">
        </dss-input>
      `);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      input.value = 'test';
      fireEvent.input(input, { composedPath: () => [input] });
      expect(inputSpy).not.toHaveBeenCalled();

      vi.advanceTimersByTime(DEFAULT_DEBOUNCE + 10);
      expect(inputSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: 'test' }));
    });

    test('fires after given debounce time on input', async () => {
      const inputSpy = vi.fn();
      const customDebounce = 800;
      await fixture(html`
        <dss-input .debounce=${customDebounce} @dss-input-debounced=${inputSpy as any}>
          <input type="text">
        </dss-input>
      `);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      input.value = 'test';
      fireEvent.input(input, { composedPath: () => [input] });

      vi.advanceTimersByTime(DEFAULT_DEBOUNCE + 10);
      expect(inputSpy).not.toHaveBeenCalled();

      vi.advanceTimersByTime((customDebounce - DEFAULT_DEBOUNCE) + 10);
      expect(inputSpy).toHaveBeenCalledOnce();
    });
  });
});
