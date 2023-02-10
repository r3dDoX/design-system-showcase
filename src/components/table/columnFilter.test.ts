import { describe, expect, test, vi } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { Header } from '@tanstack/table-core';
import { screen } from 'shadow-dom-testing-library';
import './columnFilter';
import { multipleBandFilter } from './customFilters';

describe('columnFilter', function () {
  test('when column can be filtered, shows input', async () => {
    const mockHeader = {
      column: {
        getCanFilter() {
          return true;
        },
      },
    } as Header<any, unknown>;
    await fixture(html`
      <dss-column-filter .header=${mockHeader as any}></dss-column-filter>
    `);

    expect(screen.queryByShadowRole('textbox')).toBeInTheDocument();
  });

  test('when column cannot be filtered, hides inputd', async () => {
    const mockHeader = {
      column: {
        getCanFilter() {
          return false;
        },
      },
    } as Header<any, unknown>;
    await fixture(html`
      <dss-column-filter .header=${mockHeader as any}></dss-column-filter>
    `);

    expect(screen.queryByShadowRole('textbox')).not.toBeInTheDocument();
  });

  test('when dsl parsing failed, shows error input', async () => {
    const mockHeader = {
      column: {
        getCanFilter() {
          return true;
        },
        getFilterFn() {
          return multipleBandFilter;
        },
        setFilterValue: vi.fn() as any,
      },
    } as Header<any, unknown>;
    const element = await fixture(html`
      <dss-column-filter .header=${mockHeader as any}></dss-column-filter>
    `);

    expect(element.shadowRoot?.querySelector('dss-input')).not.toHaveClass('error');
    element.shadowRoot?.querySelector('dss-input')?.dispatchEvent(new CustomEvent('dss-input-debounced', { detail: 'wrong syntax' }));
    await elementUpdated(element);

    expect(element.shadowRoot?.querySelector('dss-input')).toHaveClass('error');
  });
});
