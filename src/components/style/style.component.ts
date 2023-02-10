import { CSSResult, html, render } from 'lit';
import { customElement } from 'lit/decorators.js';
import BaseElement from '../../internals/baseElement/baseElement';
import './style.css';

@customElement('dss-style')
export default class Style extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
  ];

  override createRenderRoot() {
    if (document.adoptedStyleSheets) {
      document.adoptedStyleSheets = Style.styles.map((style: CSSResult) => style instanceof CSSStyleSheet
        ? style
        : style.styleSheet!,
      );
    } else {
      render(Style.styles.map((style: CSSResult) => html`
        <style>${style}</style>`), document.head);
    }
    return this;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-style': Style;
  }
}
