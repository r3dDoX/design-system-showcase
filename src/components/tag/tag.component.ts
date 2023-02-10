import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './tag.css?inline';
import BaseElement from '../../internals/baseElement/baseElement';

/**
 * @slot slot - HTML structure visible inside the tag
 */
@customElement('dss-tag')
export default class Tag extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  protected render() {
    return html`
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-tag': Tag;
  }
}
