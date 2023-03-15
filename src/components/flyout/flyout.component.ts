import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './flyout.css?inline';
import BaseElement, { ActionKeystrokes } from '../../internals/baseElement/baseElement';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { Placement } from '@floating-ui/dom';

/**
 * @property placement - Specify where the flyout will be shown if there is enough space, relative to the trigger. Default: 'bottom-start'. Unsetting placement defaults to auto placement.
 * @property arrow - Draws an arrow between the trigger and the flyout
 * @property {boolean} updateOnAnimate - Update positioning on animation frames. Use only when necessary due to performance concerns.
 * @slot slot - Pass the content of the flyout
 * @slot trigger - The flyouts trigger
 */
@customElement('dss-flyout')
export default class Flyout extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property()
  public placement?: Placement = 'bottom';

  @property({ type: Boolean })
  public arrow = false;

  @property({ type: Boolean, reflect: true, attribute: 'aria-expanded' })
  public open = false;

  @property({ type: Boolean })
  public updateOnAnimate?: boolean;

  override render() {
    return html`
      <dss-outside-click .onOutsideClick="${() => this.hide()}">
        <dss-floating
          placement="${this.placement}"
          .active="${this.open}"
          .arrow="${this.arrow}"
          .updateOnAnimate="${ifDefined(this.updateOnAnimate)}"
        >
          <span
            slot="anchor"
            class="trigger-area"
            @keydown="${this.handleKeyPress}"
            @click="${this.toggle}"
          >
            <slot name="trigger"></slot>
          </span>

          <slot @keydown="${this.handleKeyDownOnMenu}"></slot>
        </dss-floating>
      </dss-outside-click>
    `;
  }

  private hide() {
    this.open = false;
  }

  private toggle() {
    this.open = !this.open;
  }

  private handleKeyDownOnMenu(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.hide();
    }
  }

  private handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.hide();
    } else if (ActionKeystrokes.includes(event.key)) {
      event.preventDefault();
      this.toggle();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-flyout': Flyout;
  }
}
