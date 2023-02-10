import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit-html/directives/ref.js';
import styles from './floatingElement.css?inline';
import { Instance, Placement as PopperPlacement } from '@popperjs/core';
import { createPopper } from '@popperjs/core/lib/popper-lite';
import { arrow, eventListeners, flip, offset, preventOverflow } from '@popperjs/core/lib/modifiers';
import BaseElement from '../../internals/baseElement/baseElement';
import { when } from 'lit-html/directives/when.js';

export const placementOptions: Placement[] = [
  'auto-start',
  'auto',
  'auto-end',
  'top-start',
  'top',
  'top-end',
  'bottom-start',
  'bottom',
  'bottom-end',
  'right-start',
  'right',
  'right-end',
  'left-start',
  'left',
  'left-end',
];
export type Placement = PopperPlacement;

enum TooltipOffset {
  Arrow = 16,
  NoArrow = 4
}

/**
 * @slot slot - HTML structure that will be taken as reference for showing the tooltip
 * @property content - HTML structure that will be shown in the tooltip
 * @property placement - Specify where the tooltip will be shown if there is enough space
 * @csspart container - Styles the tooltip container, including the arrow
 */
@customElement('dss-floating')
export default class FloatingElement extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property()
  public placement: Placement = 'auto';

  @property({ reflect: true, type: Boolean })
  public active = false;

  @query('slot[name="anchor"]')
  public anchorSlot!: HTMLSlotElement;

  @query('slot:not([name])')
  public contentSlot!: HTMLSlotElement;

  @property({ type: Boolean, reflect: true })
  public arrow = false;

  private tooltip: Ref<HTMLDivElement> = createRef();
  private popperInstance?: Instance;
  private referenceElement?: Element;

  private get offset() {
    return this.arrow ? TooltipOffset.Arrow : TooltipOffset.NoArrow;
  }

  protected render() {
    return html`
      <slot name="anchor" @slotchange=${this.handleSlotChange}></slot>
      <div class="floating" part="container" role="tooltip" ${ref(this.tooltip)}>
        <slot></slot>
        ${when(this.arrow, () => html`
          <div class="arrow" part="floating-arrow" data-popper-arrow></div>`)}
      </div>
    `;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.destroyPopperInstance();
  }

  private destroyPopperInstance(): void {
    this.popperInstance?.destroy();
  }

  private handleSlotChange() {
    this.destroyPopperInstance();
    this.referenceElement = this.anchorSlot.assignedElements({ flatten: true })[0];
    this.popperInstance = createPopper(
      this.referenceElement,
      this.tooltip.value!,
      {
        placement: this.placement,
        modifiers: [
          arrow,
          flip,
          preventOverflow,
          {
            ...offset,
            options: {
              offset: [0, this.offset],
            },
          },
        ],
      },
    );
  }

  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties);

    if (changedProperties.has('active')) {
      if (this.active) {
        this.showElement();
      } else {
        this.hideElement();
      }
    }

    if (changedProperties.has('placement')) {
      this.popperInstance?.setOptions(options => ({
        ...options,
        placement: this.placement,
      }));
    }

    if (changedProperties.has('arrow')) {
      this.popperInstance?.setOptions(options => ({
        ...options,
        modifiers: [
          ...options.modifiers!,
          {
            ...offset,
            options: {
              offset: [0, this.offset],
            },
          },
        ],
      }));
    }
  }

  private showElement = () => {
    this.tooltip.value!.setAttribute('data-show', '');
    this.referenceElement?.setAttribute('aria-expanded', 'true');
    this.popperInstance?.setOptions((options) => ({
      ...options,
      modifiers: [
        ...options.modifiers!,
        { ...eventListeners, enabled: true },
      ],
    }));
    this.popperInstance?.update();
  };

  private hideElement = () => {
    this.tooltip.value!.removeAttribute('data-show');
    this.referenceElement?.setAttribute('aria-expanded', 'false');
    this.popperInstance?.setOptions((options) => ({
      ...options,
      modifiers: [
        ...options.modifiers!,
        { ...eventListeners, enabled: false },
      ],
    }));
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-floating': FloatingElement;
  }
}
