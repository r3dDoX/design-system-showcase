import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import BaseElement from '../../internals/baseElement/baseElement';
import styles from './menuItem.css?inline';

/**
 * Menu item provides a single option for the user to pick from a menu.
 *
 * @property value - Value represented by this option. Can be a primitive or an object.
 * @property selected - If present, this Boolean attribute indicates that the element is initially selected in a <dss-dropdown>. Only one single <dss-menu-item> of all <dss-dropdown> descendants may have the selected attribute.
 * @slot slot - Pass the HTML structure that should be used to display the menu item
 */
@customElement('dss-menu-item')
export default class MenuItem extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ reflect: true, type: Boolean })
  selected = false;

  @property()
  value?: any;

  override render() {
    return html`
      <slot></slot>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'menuitem');
    this.setAttribute('tabindex', '0');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-menu-item': MenuItem;
  }
}
