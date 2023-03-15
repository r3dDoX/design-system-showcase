import BaseElement from '../../internals/baseElement/baseElement';
import { html, unsafeCSS } from 'lit';
import styles from './overlay.css?inline';
import { customElement, property, query, state } from 'lit/decorators.js';
import '../button/button.component';
import '../icon/icon.component';
import { when } from 'lit-html/directives/when.js';
import { classMap } from 'lit-html/directives/class-map.js';

export type DssOverlayClosedEvent = CustomEvent<void>;

export interface OverlayEventsPayloadMap {
  'dss-overlay-closed': void;
}

/**
 * @property header - Text to render in header row of overlay
 * @property show - Set overlay to be shown or not
 * @slot content - Pass the HTML structure that should be displayed as the content in the overlay
 * @slot footer - Pass the HTML structure that should be displayed as the footer in the overlay
 * @event {DssOverlayClosedEvent} dss-overlay-closed - Fires when the overlay has been closed
 */
@customElement('dss-overlay')
export default class Overlay extends BaseElement<OverlayEventsPayloadMap> {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property()
  public header?: string;

  @property({ type: Boolean })
  public show = false;

  @state()
  private noFooter = true;

  @query('slot[name="footer"]')
  private footerSlot!: HTMLSlotElement;

  protected render() {
    return html`
      <div
        class=${classMap({
          container: true,
          show: this.show,
        })}
        role="dialog"
      >
        <div class="header">
          ${when(this.header, () => html`
            <h2>${this.header}</h2>
          `)}
          <dss-button type="icon-only" @click=${this.handleClosing}>
            <dss-icon icon="x" size="large"></dss-icon>
          </dss-button>
        </div>
        <div class="content">
          <slot name="content"></slot>
        </div>
        <div
          class=${classMap({
            footer: true,
            empty: this.noFooter,
          })}
        >
          <slot name="footer" @slotchange=${this.handleSlotChange}></slot>
        </div>
      </div>
    `;
  }

  private handleClosing(): void {
    this.show = false;
    this.dispatchCustomEvent('dss-overlay-closed');
  }

  private handleSlotChange(): void {
    this.noFooter = this.footerSlot?.assignedElements()?.length <= 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-overlay': Overlay;
  }

  interface WindowEventMap {
    'dss-overlay-closed': DssOverlayClosedEvent;
  }
}
