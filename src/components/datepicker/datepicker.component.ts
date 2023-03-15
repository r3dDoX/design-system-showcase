import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { Core, easepick } from '@easepick/core';
import styles from './datepicker.css?inline';
import customStyles from './customize-ease.css?inline';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import BaseElement from '../../internals/baseElement/baseElement';
import { when } from 'lit-html/directives/when.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import '../input/input.component';
import { InputErrorState } from '../input/input.component';
import { format } from 'date-fns';
import { KbdPlugin } from '@easepick/kbd-plugin';
import { IPickerConfig } from '@easepick/core/dist/types';

const DEFAULT_LOCALE = 'de-CH';

/**
 * @property name - Specify name property for form handling
 * @property value - Specify specific start date and represent form value state
 * @property label - Pass label to be shown on input
 * @property required - Specify if form element is required
 * @property errorState - Specify the errorState of the underlying input
 * @property {string} message - Pass message to be shown with the underlying input
 * @event {Event} change - Fires when form state changed
 */
@customElement('dss-datepicker')
export default class Datepicker extends BaseElement {
  // noinspection JSUnusedGlobalSymbols
  static formAssociated = true;

  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property()
  public name?: string;

  @property()
  public value = '';

  @property()
  public label?: string;

  @property()
  public required = false;

  @property()
  public errorState?: InputErrorState;

  @property()
  public message?: string;

  @property()
  public locale? = DEFAULT_LOCALE;

  @state()
  private show = false;

  @query('.easepick-wrapper')
  private easpickWrapper?: HTMLSpanElement;

  private inputRef: Ref<HTMLInputElement> = createRef();
  private datePicker!: easepick.Core;


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
          @change="${(event: Event) => this.updateValue((event.target as HTMLInputElement).value)}"
          @blur="${this.syncDatepickerToInput}"
          @click="${(event: MouseEvent) => event.preventDefault()}"
          @keydown="${this.handleInputKeydown}"
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
      lang: this.locale,
      css: customStyles,
      zIndex: 1,
      readonly: false,
      plugins: [KbdPlugin],
      KbdPlugin: {
        html: '<span tabindex="-1"></span>',
      },
      setup: (picker: Core) => {
        this.easpickWrapper?.setAttribute('tabindex', '-1');
        picker.on('show', () => {
          this.show = true;
          this.easpickWrapper?.removeAttribute('tabindex');
        });
        picker.on('hide', () => {
          this.show = false;
          this.easpickWrapper?.setAttribute('tabindex', '-1');
        });
        picker.on('select', () => this.updateValue(format(this.datePicker.getDate(), 'yyyy-MM-dd')));
        this.updateFormValueAndValidity();
      },
    } as IPickerConfig);
  }

  private handleInputKeydown(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      event.preventDefault();
      this.datePicker?.show();
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this.handleKeyPress, { passive: true });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this.handleKeyPress);
    this.datePicker.destroy();
  }

  private updateValue(value: string): void {
    this.value = value;
    this.updateFormValueAndValidity();
    this.dispatchChangeEvent();
  }

  private handleKeyPress = (event: KeyboardEvent) => {
    if (event.code === 'Escape') {
      this.datePicker.hide();
    }
  };

  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    if (this.datePicker && changedProperties.has('value')) {
      if (this.value) {
        this.datePicker.gotoDate(this.value);
        if (this.value !== this.inputRef?.value?.value) {
          this.datePicker.setDate(this.value);
        }
      } else {
        this.inputRef!.value!.value = '';
        this.datePicker.clear();
      }
      this.updateFormValueAndValidity();
    }
    if (this.datePicker && changedProperties.has('locale')) {
      this.datePicker.options.lang = this.locale;
      this.datePicker.renderAll();
    }
  }

  private updateFormValueAndValidity(): void {
    this.internals.setFormValue(this.inputRef.value!.value);
    this.internals.setValidity(this.inputRef.value!.validity, this.inputRef.value!.validationMessage);
  }

  private syncDatepickerToInput(): void {
    if (this.value) {
      this.datePicker.setDate(this.value);
    } else {
      this.datePicker.clear();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-datepicker': Datepicker;
  }
}
