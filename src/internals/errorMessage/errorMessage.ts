import BaseElement from '../baseElement/baseElement';
import { customElement, property } from 'lit/decorators.js';
import { InputErrorState } from '../../components/input/input.component';
import { html } from 'lit-html';
import styles from './errorMessage.css?inline';
import { unsafeCSS } from 'lit';
import '../../components/icon/icon.component';

/**
 * @property state - Specify error state
 * @property message - Pass message to be displayed
 */
@customElement('dss-error-message')
export default class ErrorMessage extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ reflect: true })
  public state!: InputErrorState;

  @property()
  public message?: string;

  protected render() {
    if (!this.message) {
      return;
    }

    return html`
      <div class="message-wrapper">
        <dss-icon
          data-testid="error-icon"
          size="small"
          icon="${this.state === 'warning' ? 'sign_warning' : 'sign_stop'}"
        ></dss-icon>
        <span>
          ${this.message}
        </span>
      </div>
    `;
  }
}
