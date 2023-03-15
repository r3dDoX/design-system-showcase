import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';
import styles from './dropdown.css?inline';
import '../icon/icon.component';
import '../button/button.component';
import '../input/input.component';
import '../tooltip/tooltip.component';
import '../label/label.component';
import '../../internals/hint/hint';
import Menu, { DssMenuSelectionEvent } from '../menu/menu.component';
import BaseElement, { ActionKeystrokes } from '../../internals/baseElement/baseElement';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { InputErrorState } from '../input/input.component';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { Placement } from '@floating-ui/dom';
import MenuItem from '../menuItem/menuItem.component';

export interface DropdownTranslations {
  valueMissing?: string;
}

/**
 * @property name - Specify name property for form handling
 * @property placement - Specify where the dropdown will be shown if there is enough space, relative to the trigger. Default: 'bottom-start'. Unsetting placement defaults to auto placement.
 * @property editable - Allows typing into the dropdown input element
 * @property value - Selected value
 * @property icon - Specify icon to use for the dropdown. Defaults to the `down`/`up` caret icons
 * @property label - Pass label to default input
 * @property required - Specify if form element is required
 * @property errorState - Specify the errorState of the underlying input
 * @property {string} message - Pass message to be shown with the underlying input
 * @property toFormValue - Transforms the selected value when the dropdown is used in a form. Default: JSON.stringify
 * @property updateOnAnimate - Update positioning on animation frames. Use only when necessary due to performance concerns.
 * @event {Event} change - Fires when form state changed
 * @event {FocusEvent} blur - Fires when component is blurred
 * @slot slot - DssMenu containing a list of DssMenuItem each containing an option the user can select from
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
  public name?: string;

  @property()
  public placement?: Placement = 'bottom-start';

  @property({ reflect: true, type: Boolean })
  public editable = false;

  @property()
  public value?: any;

  @property()
  public icon?: string;

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

  @property({ type: Boolean })
  public updateOnAnimate?: boolean;

  @query('input')
  private inputElement?: HTMLInputElement;

  @query('slot')
  private menuSlot!: HTMLSlotElement;

  @queryAssignedElements({ selector: 'dss-menu' })
  private menuElement!: Menu[];

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
          .updateOnAnimate="${ifDefined(this.updateOnAnimate)}"
          @focusout="${this.handleFocusOut}"
        >
          <span
            slot="anchor"
            class="trigger-area"
            role="listbox"
            aria-label="${ifDefined(this.label)}"
            ?aria-expanded=${this.open}
            @keydown="${this.handleKeyPress}"
            @click="${this.toggle}"
            tabindex="-1"
            ${ref(this.triggerRef)}
          >
            <dss-input .errorState="${this.errorState}" .hideMessage="${true}">
              <input
                type="text"
                ?readonly="${!this.editable}"
                ?disabled="${this.disabled}"
                ?required="${this.required}"
              >
              <dss-button type="icon-only" ?disabled="${this.disabled}" tabindex="-1">
                <dss-icon icon="${this.actualIcon}" size="medium"></dss-icon>
              </dss-button>
            </dss-input>
          </span>

          <slot
            @dss-menu-selection="${this.selectedRow}"
            @keydown="${this.handleKeyDownOnMenu}"
            @slotchange=${this.handleSlotChange}
          ></slot>
        </dss-floating>
      </dss-outside-click>
      <dss-hint .state="${this.errorState}" .message="${this.message}"></dss-hint>
    `;
  }

  connectedCallback(): void {
    this.addEventListener('blur', (event: FocusEvent) => {
      if (event.relatedTarget && this.menuElement[0]?.contains(event.relatedTarget as Node)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, { capture: true });
    super.connectedCallback();
  }

  protected firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this.setFormValueAndValidity();
  }

  handleSlotChange() {
    const menuItems = this.getMenuItems();
    if (menuItems && menuItems.length) {
      menuItems.forEach((menuitem) => {
        menuitem.setAttribute('role', 'option');
      });
    }

    this.displaySelectedValue();
  }

  requestUpdate(name?: PropertyKey, oldValue?: unknown) {
    if (name === 'value') {
      this.displaySelectedValue();
    }
    return super.requestUpdate(name, oldValue);
  }

  private get actualIcon() {
    if (this.icon) {
      return this.icon;
    }

    return this.open ? 'chevron-up' : 'chevron-down';
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
      if (menu) {
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
    }
  };

  private getMenu(): Menu | undefined {
    const assignedElement = this.menuSlot.assignedElements()[0];
    if (assignedElement?.tagName !== 'DSS-MENU') {
      return;
    }
    return assignedElement as Menu;
  }

  private getMenuItems(): MenuItem[] | undefined {
    return this.getMenu()?.getAllItems();
  }

  private selectedRow(event: DssMenuSelectionEvent) {
    this.value = event.detail.value;
    this.setFormValueAndValidity();
    this.dispatchChangeEvent();

    if (this.inputElement) {
      this.inputElement.value = event.detail.text;
      this.inputElement.focus();
    }

    this.hide();
  }

  private displaySelectedValue() {
    if (!this.inputElement) {
      return;
    }

    const menuItems = this.getMenuItems();
    if (menuItems) {
      if (menuItems && menuItems.length) {
        menuItems.forEach((menuitem) => {
          menuitem.setAttribute('aria-selected', 'false');
        });
      }
      const selectedMenuItem = menuItems.find(menuItem => menuItem.value === this.value || menuItem.textContent === this.value);
      if (selectedMenuItem?.textContent) {
        this.inputElement.value = selectedMenuItem.textContent;
        selectedMenuItem.setAttribute('aria-selected', 'true');
      } else {
        this.inputElement.value = '';
      }
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
