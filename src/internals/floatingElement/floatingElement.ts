import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit-html/directives/ref.js';
import styles from './floatingElement.css?inline';
import BaseElement from '../../internals/baseElement/baseElement';
import { when } from 'lit-html/directives/when.js';
import {
  arrow,
  autoPlacement,
  autoUpdate,
  computePosition,
  ComputePositionConfig,
  flip,
  offset,
  Placement,
  shift,
  Side,
} from '@floating-ui/dom';

export const placementOptions: Placement[] = [
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

enum TooltipOffset {
  Arrow = 16,
  NoArrow = 4
}

const oppositeSide: Record<Side, Side> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

/**
 * @slot slot - HTML structure that will be taken as reference for showing the tooltip
 * @property content - HTML structure that will be shown in the tooltip
 * @property placement - Specify where the tooltip will be shown if there is enough space. No placement means auto placement where there is the most amount of space.
 * @property updateOnAnimate - Update positioning on animation frames. Use only when necessary due to performance concerns.
 * @csspart container - Styles the tooltip container, including the arrow
 */
@customElement('dss-floating')
export default class FloatingElement extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property()
  public placement?: Placement;

  @property({ reflect: true, type: Boolean })
  public active = false;

  @property({ type: Boolean, reflect: true })
  public arrow = false;

  @property({ type: Boolean })
  public updateOnAnimate = false;

  @query('slot[name="anchor"]')
  public anchorSlot!: HTMLSlotElement;

  @query('slot:not([name])')
  public contentSlot!: HTMLSlotElement;

  private tooltipElement: Ref<HTMLDivElement> = createRef();
  private arrowElement: Ref<HTMLDivElement> = createRef();
  private referenceElement?: Element;
  private stopAutoUpdate?: () => void;

  private get offset() {
    return this.arrow ? TooltipOffset.Arrow : TooltipOffset.NoArrow;
  }

  protected render() {
    return html`
      <slot name="anchor" @slotchange=${this.handleSlotChange}></slot>
      <div class="floating" part="container" role="tooltip" ${ref(this.tooltipElement)}>
        <slot></slot>
        ${when(this.arrow, () => html`
          <div class="arrow" part="floating-arrow" ${ref(this.arrowElement)}></div>`)}
      </div>
    `;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stopAutoUpdate?.();
  }

  private handleSlotChange() {
    this.referenceElement = this.anchorSlot.assignedElements({ flatten: true })[0];
    this.computeFloatingUiPosition();
    this.updatePosition();
  }

  private updatePosition() {
    this.stopAutoUpdate?.();
    if (this.referenceElement && this.tooltipElement.value) {
      this.stopAutoUpdate = autoUpdate(
        this.referenceElement,
        this.tooltipElement.value,
        () => this.computeFloatingUiPosition(),
        {
          animationFrame: this.updateOnAnimate,
        },
      );
    }
  }

  private computeFloatingUiPosition(): void {
    if (!this.referenceElement || !this.tooltipElement.value) {
      return;
    }
    const middleware: ComputePositionConfig['middleware'] = [
      offset(this.offset),
      this.placement
        ? flip()
        : autoPlacement(),
      shift(),
    ];
    if (this.arrow) {
      middleware.push(arrow({ element: this.arrowElement.value! }));
    }
    computePosition(
      this.referenceElement,
      this.tooltipElement.value,
      {
        placement: this.placement,
        middleware,
      },
    )
      .then(({ middlewareData, placement, x, y }) => {
        if (!this.tooltipElement.value) {
          return;
        }
        Object.assign(this.tooltipElement.value.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
        if (middlewareData.arrow && this.arrowElement.value) {
          const side = placement.split('-')[0] as Side;

          const { x, y } = middlewareData.arrow;
          Object.assign(this.arrowElement.value.style, {
            left: x !== undefined ? `${x}px` : '',
            top: y !== undefined ? `${y}px` : '',
            [oppositeSide[side]]: `${-this.arrowElement.value.offsetWidth / 2}px`,
          });
        }
      });
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

    if (changedProperties.has('placement') || changedProperties.has('arrow')) {
      this.updatePosition();
    }
  }

  private showElement = () => {
    this.tooltipElement.value?.setAttribute('data-show', '');
    this.referenceElement?.setAttribute('aria-expanded', 'true');
  };

  private hideElement = () => {
    this.tooltipElement.value?.removeAttribute('data-show');
    this.referenceElement?.setAttribute('aria-expanded', 'false');
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-floating': FloatingElement;
  }
}
