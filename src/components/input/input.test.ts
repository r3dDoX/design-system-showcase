import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import './input.component';
import { fixture, html } from '@open-wc/testing-helpers';
import { screen } from 'shadow-dom-testing-library';
import { fireEvent, waitFor } from '@testing-library/dom';
import { DEFAULT_DEBOUNCE } from './input.component';

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

  test('when slotting an non-input element, indicates input element is required', async () => {
    await fixture(html`
      <dss-input>
        <div>not an input element</div>
      </dss-input>
    `);
    screen.getByText('Input element required');
  });

  test('when slotting no element, indicates input element is required', async () => {
    await fixture(html`
      <dss-input></dss-input>
    `);
    screen.getByText('Input element required');
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
