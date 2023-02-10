import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import styles from './dropdown.css?inline';
import '../icon/icon.component';
import '../button/button.component';
import '../input/input.component';
import '../tooltip/tooltip.component';
import '../label/label.component';
import '../../internals/errorMessage/errorMessage';
import Menu, { DssMenuSelectionEvent } from '../menu/menu.component';
import BaseElement, { ActionKeystrokes } from '../../internals/baseElement/baseElement';
import { when } from 'lit-html/directives/when.js';
import { Placement } from '../../internals/floatingElement/floatingElement';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { InputErrorState } from '../input/input.component';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { Icons } from '../icon/icons';

export interface DropdownTranslations {
  valueMissing?: string;
}

export const dropdownSizes = [
  'comfortable',
  'compact',
] as const;
export type DropdownSize = typeof dropdownSizes[number];

/**
 * @property placement - Specify where the dropdown will be shown if there is enough space, relative to the trigger
 * @property size - Specify size of dropdown
 * @property keepOpenOnSelect - By default, the dropdown is closed when an item is selected. This attribute will keep it open instead.
 * @property arrow - Draws an arrow between the trigger and the options panel
 * @property editable - Allows typing into the dropdown input element
 * @property value - Selected value
 * @property icon - Specify icon to use for the dropdown. Defaults to the `down`/`up` caret icons
 * @property label - Pass label to default input
 * @property required - Specify if form element is required
 * @property errorState - Specify the errorState of the underlying input
 * @property {string} message - Pass message to be shown with the underlying input
 * @slot slot - DssMenu containing a list of DssMenuItem each containing an option the user can select from
 * @slot trigger - The dropdown's trigger. If not given falls back on a default trigger
 */
@customElement('dss-dropdown')
export default class Dropdown extends BaseElement {
  // noinspection JSUnusedGlobalSymbols
  static formAssociated = true;

  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property()
  public placement: Placement = 'bottom-start';

  @property({ type: String })
  public size: DropdownSize = 'comfortable';

  @property({ reflect: true, type: Boolean })
  public keepOpenOnSelect = false;

  @property({ reflect: true, type: Boolean })
  public arrow = false;

  @property({ reflect: true, type: Boolean })
  public editable = false;

  @property()
  public value?: any;

  @property()
  public icon?: Icons;

  @property({ reflect: true, type: Boolean })
  public disabled = false;

  @property({ reflect: true, type: Boolean })
  public open = false;

  @property()
  public label?: string;

  @property()
  public required = false;

  @property()
  public errorState?: InputErrorState;

  @property()
  public toFormValue = (value: any) => typeof value === 'string' ? value : JSON.stringify(value);

  @property()
  public message?: string;

  @property()
  public translations: DropdownTranslations = {
    valueMissing: 'You have to select an option',
  };

  @query('input')
  private inputElement?: HTMLInputElement;

  @query('slot:not([name])')
  private menuSlot!: HTMLSlotElement;

  private triggerRef: Ref<HTMLSpanElement> = createRef();
  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  override render() {
    return html`
      <dss-label label="${ifDefined(this.label)}" ?required="${this.required}"></dss-label>
      <dss-outside-click .onOutsideClick="${() => this.hide()}">
        <dss-floating
          placement="${this.placement}"
          ?active="${this.open}"
          ?arrow="${this.arrow}"
          @focusout="${this.handleFocusOut}"
        >
          <span
            slot="anchor"
            class="trigger-area"
            role="listbox"
            aria-expanded="${this.open}"
            aria-label="${ifDefined(this.label)}"
            @keydown="${this.handleKeyPress}"
            @click="${this.toggle}"
            tabindex="-1"
            ${ref(this.triggerRef)}
          >
            <slot name="trigger">
              ${when(this.isComfortable,
                () => html`
                  <dss-input .errorState="${this.errorState}">
                    <input
                      type="text"
                      ?readonly="${!this.editable}"
                      ?disabled="${this.disabled}"
                      ?required="${this.required}"
                    >
                    <dss-button type="icon-only" ?disabled="${this.disabled}">
                      <dss-icon icon="${this.actualIcon}" size="medium"></dss-icon>
                    </dss-button>
                  </dss-input>
                `,
                () => html`
                  <dss-button type="icon-only" ?disabled="${this.disabled}">
                    <dss-icon icon="${this.actualIcon}" size="medium"></dss-icon>
                  </dss-button>
                `,
              )}
            </slot>
          </span>

          <slot @dss-menu-selection="${this.selectedRow}" @keydown="${this.handleKeyDownOnMenu}"></slot>
        </dss-floating>
      </dss-outside-click>
      <dss-error-message .state="${this.errorState}" .message="${this.message}"></dss-error-message>
    `;
  }

  protected firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this.setFormValueAndValidity();
  }

  private get actualIcon(): Icons {
    if (this.icon) {
      return this.icon;
    }

    return this.open ? 'chevron-up' : 'chevron-down';
  }

  private get isComfortable() {
    return this.size === 'comfortable';
  }

  private toggle() {
    if (!this.disabled) {
      this.open = !this.open;
    }
  }

  private hide() {
    this.open = false;
  }

  private show() {
    if (!this.disabled) {
      this.open = true;
    }
  }

  private handleFocusOut(event: FocusEvent) {
    if (!this.isKeepingFocus(event)) {
      this.hide();
    }
  }

  private isKeepingFocus(event: FocusEvent) {
    return this.contains(event.relatedTarget as Element);
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
    } else if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (!this.open) {
        this.show();
      }
      const menu = this.getMenu();
      const items = menu.getAllItems();
      if (items.length > 0) {
        const firstItem = items[0];
        const lastItem = items[items.length - 1];

        if (event.key === 'ArrowDown' || event.key === 'Home') {
          menu.setActiveItem(firstItem);
          firstItem.focus();
        } else {
          menu.setActiveItem(lastItem);
          lastItem.focus();
        }
      }
    }
  };

  private getMenu(): Menu {
    return this.menuSlot.assignedElements()[0] as Menu;
  }

  private selectedRow(event: DssMenuSelectionEvent) {
    this.value = event.detail.value;
    this.setFormValueAndValidity();

    if (this.inputElement) {
      this.inputElement.value = event.detail.text;
    }

    if (!this.keepOpenOnSelect) {
      this.hide();
    }
  }

  private setFormValueAndValidity() {
    this.internals.setFormValue(this.toFormValue(this.value));
    this.internals.setValidity(
      { valueMissing: this.required && this.value === undefined },
      this.translations.valueMissing,
      this.triggerRef.value,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-dropdown': Dropdown;
  }
}
