import './datepicker.component';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { beforeEach, describe, expect, it, SpyInstance, vi } from 'vitest';
import DatePicker from './datepicker.component';
import { fireEvent } from '@testing-library/dom';
import { screen } from 'shadow-dom-testing-library';

describe('Datepicker', () => {
  describe('rendering', () => {
    it('should render the datepicker inside an input of type date', async () => {
      const element = await fixture(html`
        <dss-datepicker></dss-datepicker>`);
      const datePickerInput = element.shadowRoot!.querySelector('dss-input input')!;
      expect(datePickerInput).toHaveAttribute('type', 'date');
    });

    it('should render the datepicker with the given initial date', async () => {
      const initialValue = '2020-06-06';
      const element = await fixture(html`
        <dss-datepicker value=${initialValue}></dss-datepicker>`);

      const datePickerInput = element.shadowRoot!.querySelector('dss-input input')!;
      expect(datePickerInput).toHaveValue(initialValue);
    });

    it('should re-render the datepicker on value change', async () => {
      const initialValue = '2020-06-06';
      const element: DatePicker = await fixture(html`
        <dss-datepicker value=${initialValue}></dss-datepicker>`);

      const newValue = '2022-11-11';
      element.value = newValue;
      await elementUpdated(element);
      const datePickerAfterUpdate = element.shadowRoot!.querySelector('dss-input input')!;
      expect(datePickerAfterUpdate).toHaveValue(newValue);
    });

    it('should pass required to native input', async () => {
      const element = await fixture(html`
        <dss-datepicker required="${true}"></dss-datepicker>`);
      const datePickerInput = element.shadowRoot!.querySelector('dss-input input')!;
      expect(datePickerInput).toHaveAttribute('required');
    });

    it('when label given, is selectable by it', async () => {
      await fixture(html`
        <dss-datepicker label="Test"></dss-datepicker>
      `);

      expect(screen.getByShadowLabelText('Test')).toBeInTheDocument();
    });
  });

  describe('date selection', () => {
    it('should emit an event on date selection which bubbles', async () => {
      const wrapperListenerSpy = vi.fn();
      const datepickerListenerSpy = vi.fn();

      const element: DatePicker = await fixture(html`
        <div>
          <dss-datepicker></dss-datepicker>
        </div>`);

      const event = 'dss-datepicker-selection-change';
      const datePickerWrapper = element.querySelector('dss-datepicker')!;
      element.addEventListener(event, wrapperListenerSpy);
      datePickerWrapper.addEventListener(event, datepickerListenerSpy);

      const datePicker = datePickerWrapper.shadowRoot!.querySelector('dss-input .easepick-wrapper')!;
      const firstDate = datePicker.shadowRoot!.querySelector('.day.unit:not(.selected)')! as HTMLElement;
      expect(firstDate).not.toBeNull();

      firstDate.click();

      const expectedDate = new Date(parseInt(firstDate.getAttribute('data-time')!));
      const expectedEvent = {
        detail: expectedDate,
      };
      expect(wrapperListenerSpy, 'event should bubble')
        .toHaveBeenCalledWith(expect.objectContaining(expectedEvent));

      expect(datepickerListenerSpy, 'event should be listenable on the element itself')
        .toHaveBeenCalledWith(expect.objectContaining(expectedEvent));
    });

    it('should set the value on date selection', async () => {
      const element: DatePicker = await fixture(html`
        <dss-datepicker value="2022-11-02"></dss-datepicker>`);

      const datePickerWrapper = element.shadowRoot!.querySelector('dss-input .easepick-wrapper')!;
      const firstDate = datePickerWrapper.shadowRoot!.querySelector('.day.unit:not(.selected)')! as HTMLElement;
      expect(firstDate).not.toBeNull();

      firstDate.click();

      const expectedDate = new Date(parseInt(firstDate.getAttribute('data-time')!));
      expect(element.value).toEqual(expectedDate);
    });

    it('should emit the selected date to FormData', async () => {
      const element: HTMLFormElement = await fixture(html`
        <form>
          <dss-datepicker name="date" value="2022-11-02"></dss-datepicker>
        </form>
      `);

      const data = new FormData(element);
      expect(data.get('date')).toBe('2022-11-02');
    });
  });

  describe('locale', () => {

    let navigatorSpy: SpyInstance;

    beforeEach(() => {
      navigatorSpy = vi.spyOn(window.navigator, 'language', 'get');
      navigatorSpy.mockReturnValue('en-US');
    });

    const englishDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const germanDayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

    function assertDayNames(actual: NodeListOf<Element>, expected: string[]) {
      expected.forEach((expectedDayName, index) => expect(actual[index].textContent).toBe(expectedDayName));
    }

    function changeLanguage(newLanguage: string) {
      const previousLanguage = navigator.language;
      navigatorSpy.mockReturnValue(newLanguage);
      window.dispatchEvent(new Event('languagechange'));
      return [previousLanguage, newLanguage];
    }

    it('should set the default locale on the date picker to english', async () => {
      const element: DatePicker = await fixture(html`
        <dss-datepicker></dss-datepicker>`);

      const datePickerWrapper = element.shadowRoot!.querySelector('.easepick-wrapper')!;
      const dayNames: NodeListOf<Element> = datePickerWrapper.shadowRoot!.querySelectorAll('.dayname');

      assertDayNames(dayNames, englishDayNames);
    });

    it('should set the locale on the date picker to german', async () => {
      navigatorSpy.mockReturnValue('de-CH');
      const element: DatePicker = await fixture(html`
        <dss-datepicker></dss-datepicker>`);

      const datePickerWrapper = element.shadowRoot!.querySelector('dss-input .easepick-wrapper')!;
      const dayNames = datePickerWrapper.shadowRoot!.querySelectorAll('.dayname');

      assertDayNames(dayNames, germanDayNames);
    });

    it('should update the locale on the date picker', async () => {
      const element: DatePicker = await fixture(html`
        <dss-datepicker></dss-datepicker>`);

      const datePickerWrapper = element.shadowRoot!.querySelector('dss-input .easepick-wrapper')!;
      const dayNamesBeforeUpdate = datePickerWrapper.shadowRoot!.querySelectorAll('.dayname');

      assertDayNames(dayNamesBeforeUpdate, englishDayNames);

      const [previousLanguage, newLanguage] = changeLanguage('de-CH');
      expect(previousLanguage).not.toBe(newLanguage);
      await elementUpdated(element);

      const dayNamesAfterUpdate = datePickerWrapper.shadowRoot!.querySelectorAll('.dayname');

      assertDayNames(dayNamesAfterUpdate, germanDayNames);
    });
  });

  describe('opening and closing', async () => {
    it('should open the datepicker on click on the calendar icon', async () => {
      const element: DatePicker = await fixture(html`
        <dss-datepicker></dss-datepicker>`);

      const datePickerWrapper = element.shadowRoot!.querySelector('.easepick-wrapper')!;
      const datepickerContainer = datePickerWrapper.shadowRoot!.querySelector('.container')! as HTMLElement;
      const datepickerButton = element.shadowRoot!.querySelector('dss-button')!;

      expect(datepickerContainer).not.toHaveClass('show');
      datepickerButton.click();
      expect(datepickerContainer).toHaveClass('show');
    });

    it('should close the datepicker on escape keypress', async () => {
      const element: DatePicker = await fixture(html`
        <dss-datepicker></dss-datepicker>`);

      const datePickerWrapper = element.shadowRoot!.querySelector('.easepick-wrapper')!;
      const datepickerContainer = datePickerWrapper.shadowRoot!.querySelector('.container')! as HTMLElement;
      const datepickerButton = element.shadowRoot!.querySelector('dss-button')!;

      datepickerButton.click();
      expect(datepickerContainer).toHaveClass('show');
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(datepickerContainer).not.toHaveClass('show');
    });
  });
});
