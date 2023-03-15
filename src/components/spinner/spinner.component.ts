import { html } from 'lit-html';
import { customElement, property } from 'lit/decorators.js';
import BaseElement from '../../internals/baseElement/baseElement';
import { unsafeCSS } from 'lit';
import styles from './spinner.css?inline';

export const spinnerTypes = [
  'primary',
  'secondary',
  'ghost',
] as const;
export type SpinnerType = typeof spinnerTypes[number];

/**
 * @property type - Set the type of the spinner
 */
@customElement('dss-spinner')
export default class Spinner extends BaseElement {

  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ type: String })
  type: SpinnerType = 'primary';

  override render() {
    return html`
      <div role="status">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle class="${this.type}" cx="9" cy="9" r="8" stroke-width="2"/>
          <path class="${this.type}" d="M17 9C17 4.58172 13.4183 1 9 1" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-spinner': Spinner;
  }
}
