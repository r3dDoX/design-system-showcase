import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import styles from './input.css?inline';
import BaseElement from '../../internals/baseElement/baseElement';
import '../../internals/errorMessage/errorMessage';
import '../label/label.component';
import { ifDefined } from 'lit-html/directives/if-defined.js';

export const DEFAULT_DEBOUNCE = 500;

export const inputSizes = [
  'comfortable',
  'compact',
] as const;
export type InputSize = typeof inputSizes[number];

export const inputErrorStates = [
  'error',
  'warning',
] as const;
export type InputErrorState = typeof inputErrorStates[number];

export type DssInputDebouncedEvent = CustomEvent<string>;

export interface InputEventsPayloadMap {
  'dss-input-debounced': string;
}

/**
 * @slot slot - Pass the actual input element that should be wrapped
 * @slot input-button - Pass a button to be displayed on the right side of the button
 * @property size - Specify size of input text
 * @property label - Pass label that will be displayed above the input
 * @property debounce - Specify number of ms for the debounce timer to run
 * @property errorState - Specify error state
 * @property {string} message - Pass message to be displayed with error state
 * @event {DssInputDebouncedEvent} dss-input-debounced - Fires when a change happened and the debounce timer ran out
 * @csspart required - Exported part of dss-label
 */
@customElement('dss-input')
export default class Input extends BaseElement<InputEventsPayloadMap> {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ type: String, reflect: true })
  public size: InputSize = 'comfortable';

  @property({ type: String })
  public label = '';

  @property({ attribute: false })
  public debounce = DEFAULT_DEBOUNCE;

  @property({ type: String, reflect: true })
  public errorState?: InputErrorState;

  @property({ type: String })
  public message?: string;

  @query('slot')
  defaultSlot!: HTMLSlotElement;

  private timeout?: NodeJS.Timeout;

  override render() {
    return html`
      <dss-label
        label="${ifDefined(this.label)}"
        exportparts="required"
        @click=${this.handleLabelClick}
      ></dss-label>
      <div class="input-wrapper">
        <slot
          @input=${this.onInput}
          @slotchange=${this.handleSlotChange}
        ></slot>
        <slot name="input-button"></slot>
      </div>
      <dss-error-message .state="${this.errorState}" .message="${this.message}"></dss-error-message>
    `;
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);

    const assignedElements = this.defaultSlot.assignedElements();
    if (!assignedElements.some(element => element.tagName === 'INPUT')) {
      this.innerHTML = '<p>Input element required</p>';
    }
  }

  private onInput(event: InputEvent): void {
    clearTimeout(this.timeout);
    const inputElement = event.composedPath()[0] as HTMLInputElement;
    this.timeout = setTimeout(
      () => this.dispatchCustomEvent('dss-input-debounced', inputElement.value),
      this.debounce,
    );
  }

  // implemented our own click handler because label is in shadow DOM and input element in light DOM, so the 'for' attribute does not work
  // see also: https://github.com/whatwg/html/issues/3219
  private handleLabelClick(): void {
    const inputElement = this.defaultSlot.assignedElements()[0] as HTMLInputElement;
    inputElement?.focus();
  }

  private handleSlotChange(): void {
    if (this.label) {
      this.defaultSlot.assignedElements()[0]?.setAttribute('aria-label', this.label);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-input': Input;
  }

  interface WindowEventMap {
    'dss-input-debounced': DssInputDebouncedEvent;
  }
}
