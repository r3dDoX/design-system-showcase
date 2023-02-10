import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { easepick } from '@easepick/core';
import { KbdPlugin } from '@easepick/kbd-plugin';
import styles from './datepicker.css?inline';
import customStyles from './customize-ease.css?inline';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { IPickerConfig } from '@easepick/core/dist/types';
import BaseElement from '../../internals/baseElement/baseElement';
import { when } from 'lit-html/directives/when.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import '../input/input.component';
import { InputErrorState } from '../input/input.component';

export type DssDateSelectionChangeEvent = CustomEvent<Date>;

export interface DatepickerEventsPayloadMap {
  'dss-datepicker-selection-change': Date;
}

/**
 * @event {DssDateSelectionChangeEvent} dss-datepicker-selection-change - Fires when the user selected a date
 * @property value - Specify specific start date
 * @property label - Pass label to be shown on input
 * @property required - Specify if form element is required
 * @property errorState - Specify the errorState of the underlying input
 * @property {string} message - Pass message to be shown with the underlying input
 */
@customElement('dss-datepicker')
export default class Datepicker extends BaseElement<DatepickerEventsPayloadMap> {
  // noinspection JSUnusedGlobalSymbols
  static formAssociated = true;

  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property()
  public value: Date | string | number = new Date();

  @property()
  public label?: string;

  @property()
  public required = false;

  @property()
  public errorState?: InputErrorState;

  @property()
  public message?: string;

  private inputRef: Ref<HTMLInputElement> = createRef();
  private datePicker!: easepick.Core;

  @state()
  private show = false;

  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  override render() {
    return html`
      <dss-input
        label="${ifDefined(this.label)}"
        class="${when(this.show, () => 'show')}"
        .errorState="${this.errorState}"
        .message="${this.message}"
      >
        <input
          type="date"
          ${ref(this.inputRef)}
          ?required="${this.required}"
          @change="${this.updateFormValueAndValidity}"
          @click="${(event: MouseEvent) => event.preventDefault()}"
        >
        <dss-button slot="input-button" type="icon-only" @click="${() => this.datePicker.show()}">
          <dss-icon icon="calendar" size="medium"></dss-icon>
        </dss-button>
      </dss-input>
    `;
  }

  override firstUpdated(): void {
    this.datePicker = new easepick.create({
      element: this.inputRef.value!,
      date: this.value,
      lang: navigator.language,
      css: customStyles,
      zIndex: 1,
      readonly: false,
      plugins: [KbdPlugin],
      KbdPlugin: {
        html: '<span></span>',
      },
    } as IPickerConfig);

    this.datePicker.on('show', () => this.show = true);
    this.datePicker.on('hide', () => this.show = false);
    this.datePicker.on('select', () => {
      this.value = this.datePicker.getDate();
      this.dispatchCustomEvent('dss-datepicker-selection-change', this.value);
    });
    this.updateFormValueAndValidity();
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this.handleKeyPress);
    window.addEventListener('languagechange', this.updateLanguage);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this.handleKeyPress);
    window.removeEventListener('languagechange', this.updateLanguage);
    this.datePicker.destroy();
  }

  private handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.datePicker.hide();
    }
  };

  private updateLanguage = () => {
    this.datePicker.options.lang = navigator.language;
    this.datePicker.renderAll();
  };

  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    if (this.datePicker && changedProperties.has('value')) {
      const newDate = this.value;
      this.datePicker.setDate(newDate);
      this.datePicker.gotoDate(newDate);
      this.updateFormValueAndValidity();
    }
  }

  private updateFormValueAndValidity(): void {
    this.internals.setFormValue(this.inputRef.value!.value);
    this.internals.setValidity(this.inputRef.value!.validity, this.inputRef.value!.validationMessage);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-datepicker': Datepicker;
  }

  interface WindowEventMap {
    'dss-datepicker-selection-change': DssDateSelectionChangeEvent;
  }
}
