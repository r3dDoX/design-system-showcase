import { customElement, property, state } from 'lit/decorators.js';
import BaseElement from '../../internals/baseElement/baseElement';
import { Header } from '@tanstack/table-core';
import { html } from 'lit';
import { DssInputDebouncedEvent } from '../input/input.component';
import { classMap } from 'lit-html/directives/class-map.js';
import { multipleBandFilter } from './customFilters';
import '../input/input.component';
import { parseDSL } from './dslParser';

@customElement('dss-column-filter')
export default class ColumnFilter extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
  ];

  @property({ attribute: false })
  public header!: Header<any, unknown>;

  @state()
  private isError = false;

  protected render() {
    if (!this.header.column.getCanFilter()) {
      return;
    }

    return html`
      <dss-input
        size="compact"
        class="${classMap({
          'error': this.isError,
        })}"
        @dss-input-debounced=${({ detail }: DssInputDebouncedEvent) => {
          let userInput: any = detail;
          if (this.header.column.getFilterFn() === multipleBandFilter) {
            try {
              userInput = parseDSL(userInput);
              this.isError = false;
            } catch (e) {
              this.isError = true;
            }
          }
          this.header.column.setFilterValue(userInput);
        }}
      >
        <input type="text" placeholder="Suche...">
      </dss-input>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-column-filter': ColumnFilter;
  }
}
