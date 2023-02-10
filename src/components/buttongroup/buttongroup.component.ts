import { html, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import styles from './buttongroup.css?inline';
import '../icon/icon.component';
import '../button/button.component';
import '../label/label.component';
import '../../internals/errorMessage/errorMessage';
import BaseElement from '../../internals/baseElement/baseElement';
import ToggleButton from '../toggleButton/toggleButton.component';
import { InputErrorState } from '../input/input.component';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';

export interface ButtonGroupTranslations {
  valueMissing?: string;
}

/**
 * @property selectedIndex - Specify by index which button should be selected. This attribute gets updated from the component when the selection changes
 * @property label - Pass label to be shown
 * @property required - Specify if this element is required
 * @property errorState - Specify the error state of the element
 * @property {string} message - Pass message to be shown with the error state
 * @property translations - Pass translations to use
 * @slot {ToggleButton[]} slot - Pass one or more dss-toggle-button
 */
@customElement('dss-button-group')
export default class ButtonGroup extends BaseElement {
  // noinspection JSUnusedGlobalSymbols
  static formAssociated = true;

  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ type: Number, reflect: true })
  public selectedIndex?: number;

  @property({ type: String })
  public label = '';

  @property({ type: Boolean })
  public required = false;

  @property({ type: String })
  public errorState?: InputErrorState;

  @property({ type: String })
  public message?: string;

  @property()
  public translations: ButtonGroupTranslations = {
    valueMissing: 'You have to select an option',
  };

  @query('slot')
  private defaultSlot!: HTMLSlotElement;

  private buttonWrapper: Ref<HTMLDivElement> = createRef();
  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  override render() {
    return html`
      <dss-label label="${ifDefined(this.label)}" ?required="${this.required}"></dss-label>
      <div class="button-wrapper" tabindex="-1" ${ref(this.buttonWrapper)} aria-label="${ifDefined(this.label)}">
        <slot
          @slotchange=${this.handleSlotChange}
          @click="${this.handleClick}"
        >
        </slot>
      </div>
      <dss-error-message .state="${this.errorState}" .message="${this.message}"></dss-error-message>
    `;
  }

  handleSlotChange() {
    const buttons = this.getButtons();

    if (buttons.length > 1) {
      buttons.forEach((button, index) => {
        button.overlapBorder = 'left';
        button.removeRadius = 'all';

        if (index === this.selectedIndex) {
          this.selectButton(button);
        }
      });

      buttons[0].removeRadius = 'right';
      buttons[0].overlapBorder = 'none';
      buttons[buttons.length - 1].removeRadius = 'left';
    } else if (buttons.length === 1) {
      buttons[0].removeRadius = 'none';
      buttons[0].overlapBorder = 'none';
    }

    this.updateValidity();
  }

  private handleClick(event: Event) {
    const buttons = this.getButtons();

    const previouslySelectedButton = buttons[this.selectedIndex!];
    if (previouslySelectedButton) {
      previouslySelectedButton.selected = false;
    }

    this.selectedIndex = buttons.findIndex(button => button.contains(event.target as Node));
    if (this.selectedIndex > -1) {
      const selectedButton = buttons[this.selectedIndex];
      this.selectButton(selectedButton);
    }
  }

  private selectButton(selectedButton: ToggleButton): void {
    selectedButton.selected = true;
    this.internals.setFormValue(selectedButton.value ?? null);
    this.updateValidity();
  }

  private updateValidity(): void {
    this.internals.setValidity(
      { valueMissing: this.required && this.selectedIndex === undefined },
      this.translations.valueMissing,
      this.buttonWrapper.value,
    );
  }

  private getButtons(): ToggleButton[] {
    return this.defaultSlot.assignedElements()
      .filter((element): element is ToggleButton => element instanceof ToggleButton);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-button-group': ButtonGroup;
  }
}
