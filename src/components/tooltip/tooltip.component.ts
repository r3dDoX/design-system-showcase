import { html, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import styles from './tooltip.css?inline';
import BaseElement from '../../internals/baseElement/baseElement';
import '../../internals/floatingElement/floatingElement';
import { Placement } from '../../internals/floatingElement/floatingElement';

const showEvents: Array<keyof WindowEventMap> = ['mouseenter', 'focus'];
const hideEvents: Array<keyof WindowEventMap> = ['mouseleave', 'blur'];


/**
 * @slot slot - HTML structure that will be taken as reference for showing the tooltip
 * @property content - HTML structure that will be shown in the tooltip
 * @property placement - Specify where the tooltip will be shown if there is enough space
 * @csspart tooltip - Styles the tooltip container
 */
@customElement('dss-tooltip')
export default class Tooltip extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property()
  public placement: Placement = 'auto';

  @query('slot[name="trigger"]')
  public triggerSlot!: HTMLSlotElement;

  @query('slot:not([name="trigger"])')
  public contentSlot!: HTMLSlotElement;

  @state()
  private active = false;

  private referenceElement?: Element;

  protected render() {
    return html`
      <dss-floating arrow ?active="${this.active}" placement="${this.placement}">
        <slot name="trigger" slot="anchor" @slotchange=${this.handleSlotChange}></slot>
        <div role="tooltip">
          <slot></slot>
        </div>
      </dss-floating>
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeBoundHandlers();
  }

  private removeBoundHandlers(): void {
    showEvents.forEach(event => this.referenceElement?.removeEventListener(event, this.show));
    hideEvents.forEach(event => this.referenceElement?.removeEventListener(event, this.hide));
  }

  private handleSlotChange() {
    this.removeBoundHandlers();
    this.referenceElement = this.triggerSlot.assignedElements()[0];
    showEvents.forEach(event => this.referenceElement?.addEventListener(event, this.show));
    hideEvents.forEach(event => this.referenceElement?.addEventListener(event, this.hide));
  }

  private show = () => {
    this.active = true;
  };

  private hide = () => {
    this.active = false;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-tooltip': Tooltip;
  }
}
