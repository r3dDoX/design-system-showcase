import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './switch.css?inline';
import BaseElement from '../../internals/baseElement/baseElement';
import { createRef, Ref, ref } from 'lit-html/directives/ref.js';

/**
 * @property name - Specify name property for form handling
 * @property value - Represents the form value state
 * @property type - Statically set to "checkbox" for form libraries to understand its purpose
 * @property checked - Set checked state of component
 * @property disabled - Set disabled state of component
 * @event {Event} change - Fires when form state changed
 */
@customElement('dss-switch')
export default class Switch extends BaseElement {
  // noinspection JSUnusedGlobalSymbols
  static formAssociated = true;
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property()
  public name?: string;

  @property()
  public value?: string;

  @property()
  public readonly type = 'checkbox';

  @property({ type: Boolean })
  public checked = false;

  @property({ type: Boolean })
  public disabled = false;

  private internals: ElementInternals;
  private inputRef: Ref<HTMLInputElement> = createRef();

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  protected render() {
    return html`
      <input
        ${ref(this.inputRef)}
        type="checkbox"
        ?checked="${this.checked}"
        ?disabled="${this.disabled}"
        @change=${(event: Event) => this.handleCheckboxChange(event)}
      >
    `;
  }

  private handleCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.checked = checkbox.checked;
    this.value = checkbox.value;
    this.dispatchChangeEvent(event);
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (changedProperties.has('checked')) {
      this.internals.setFormValue(this.checked ? 'on' : null);
      this.internals.setValidity(this.inputRef.value!.validity, this.inputRef.value!.validationMessage, this.inputRef!.value);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-switch': Switch;
  }
}
