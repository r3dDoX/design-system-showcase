import './table.component';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { fireEvent } from '@testing-library/dom';
import { ColumnDef } from '@tanstack/table-core';
import { screen } from 'shadow-dom-testing-library';
import { DEFAULT_TABLE_TRANSLATIONS, TableTranslations } from './table.component';

interface TestData {
  name: string;
  age?: number;
}

describe('Table', () => {
  test('should render data with given config', async () => {
    const testColumns: ColumnDef<TestData>[] = [{ id: 'name', accessorKey: 'name' }];
    const testData = [{ name: 'TestName' }];

    const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
      <dss-table .columns=${testColumns as any[]} .data=${testData}></dss-table>
    `);

    const table = element.shadowRoot!.querySelector('table')!;
    expect(table.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(table.querySelector('tbody tr:first-child td:nth-child(1)')).toHaveTextContent(testData[0].name);
  });

  test('should render custom element and styles in header and cell when set', async () => {
    const styles = '.test { background: red }';
    const testColumns: ColumnDef<TestData>[] = [{
      id: 'name',
      accessorKey: 'name',
      header: () => html`<strong class="test">Header</strong>`,
      cell: ({ row: { original } }) => html`<span class="test">${original.name}</span>`,
    }];
    const testData = [{ name: 'TestName' }];

    const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
      <dss-table .columns=${testColumns as any[]} .data=${testData} .customStyles=${styles}></dss-table>
    `);

    const shadowRoot = element.shadowRoot!;
    const styleElement: HTMLStyleElement = shadowRoot.querySelector('style')!;
    expect(styleElement.textContent).toBe(styles);
    expect(shadowRoot.querySelector('thead th strong')).toHaveClass('test');
    expect(shadowRoot.querySelector('tbody td span')).toHaveClass('test');
  });

  describe('drag and drop', () => {
    const testColumns: ColumnDef<TestData>[] = [
      { id: 'firstName', accessorKey: 'firstName' },
      { id: 'lastName', accessorKey: 'lastName' },
      { id: 'age', accessorKey: 'age' },
    ];
    const testData = [{ firstName: 'first name', lastname: 'last name', age: 10 }];
    let dataTransferMock!: DataTransfer;

    beforeEach(() => {
      const storedData: Record<string, string> = {};
      dataTransferMock = {
        setData(format: string, data: string): void {
          storedData[format] = data;
        },
        getData(format: string): string {
          return storedData[format];
        },
      } as DataTransfer;
    });

    test('should move dragged column after column dropped on when moving to the right', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData}></dss-table>
      `);

      const table = element.shadowRoot!.querySelector('table')!;
      fireEvent.dragStart(table.querySelector('thead th:first-child')!, { dataTransfer: dataTransferMock });
      fireEvent.drop(table.querySelector('thead th:nth-child(2)')!, { dataTransfer: dataTransferMock });

      await elementUpdated(element);
      expect(table.querySelector('thead th:first-child')).toHaveTextContent('lastName');
    });

    test('should move dragged column in front of column dropped on when moving to the left', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData}></dss-table>
      `);

      const table = element.shadowRoot!.querySelector('table')!;
      fireEvent.dragStart(table.querySelector('thead th:nth-child(3)')!, { dataTransfer: dataTransferMock });
      fireEvent.drop(table.querySelector('thead th:first-child')!, { dataTransfer: dataTransferMock });

      await elementUpdated(element);
      expect(table.querySelector('thead th:first-child')).toHaveTextContent('age');
    });
  });

  describe('selectable', () => {
    const testColumns: ColumnDef<TestData>[] = [{ id: 'name', accessorKey: 'name' }];
    const testData = [{ name: 'TestName' }, { name: 'SecondTestName' }];

    test('should show checkboxes on any level when selectable', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .selectable=${true}></dss-table>
      `);

      const table = element.shadowRoot!.querySelector('table')!;
      expect(table.querySelector('thead th:first-child dss-checkbox')).not.toBeNull();
      expect(table.querySelector('tbody td:first-child dss-checkbox')).not.toBeNull();
    });

    test('should emit all selected rows when click on header checkbox', async () => {
      const listenerSpy = vi.fn();
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .selectable=${true}></dss-table>
      `);
      element.addEventListener('dss-table-selection-change', listenerSpy);

      fireEvent.change(element.shadowRoot!.querySelector('thead dss-checkbox')!, { target: { checked: true } });

      expect(listenerSpy).toHaveBeenCalledWith(expect.objectContaining({
        detail: testData,
      }));
    });

    test('should emit specific selected row when click on row checkbox', async () => {
      const listenerSpy = vi.fn();
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .selectable=${true}></dss-table>
      `);
      element.addEventListener('dss-table-selection-change', listenerSpy);

      fireEvent.change(element.shadowRoot!.querySelector('tbody dss-checkbox')!, { target: { checked: true } });

      expect(listenerSpy).toHaveBeenCalledWith(expect.objectContaining({
        detail: [testData[0]],
      }));
    });

    test('should mark checkboxes according to row selection', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .selectable=${true}></dss-table>
      `);

      const shadowRoot = element.shadowRoot!;
      fireEvent.change(shadowRoot.querySelector('tbody dss-checkbox')!, { target: { checked: true } });
      await elementUpdated(element);

      expect(shadowRoot.querySelector('tbody tr:first-child dss-checkbox')).toHaveProperty<boolean>('checked', true);
      expect(shadowRoot.querySelector('tbody tr:nth-child(2) dss-checkbox')).toHaveProperty<boolean>('checked', false);
      expect(shadowRoot.querySelector('thead tr dss-checkbox')).toHaveProperty<boolean>('indeterminate', true);
    });

    test('should mark all checkboxes when selecting header checkbox', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .selectable=${true}></dss-table>
      `);

      const shadowRoot = element.shadowRoot!;
      fireEvent.change(shadowRoot.querySelector('thead dss-checkbox')!, { target: { checked: true } });
      await elementUpdated(element);

      expect(shadowRoot.querySelector('thead tr dss-checkbox')).toHaveProperty<boolean>('checked', true);
      shadowRoot.querySelectorAll('tbody tr dss-checkbox input').forEach((element) =>
        expect(element).toHaveProperty<boolean>('checked', true),
      );
    });

    test('should show number of selected rows in footer', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .selectable=${true}></dss-table>
      `);

      const shadowRoot = element.shadowRoot!;
      fireEvent.change(shadowRoot.querySelector('tbody dss-checkbox')!, { target: { checked: true } });
      await elementUpdated(element);

      expect(screen.getByShadowText(`${DEFAULT_TABLE_TRANSLATIONS.selectedElements} 1`)).toBeInTheDocument();
    });
  });

  describe('sortable', () => {
    const testColumns: ColumnDef<TestData>[] = [{ id: 'name', accessorKey: 'name' }];
    const testData = [{ name: 'B Test' }, { name: 'A Test' }, { name: 'C Test' }];

    test('should sort column on click in header cell when sortable', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .sortable=${true}></dss-table>
      `);
      const table = element.shadowRoot!.querySelector('table')!;
      (table.querySelector('thead th div') as HTMLDivElement).click();
      await elementUpdated(element);

      expect(table.querySelector('tbody tr:first-child td:first-child')).toHaveTextContent('A Test');
      expect(table.querySelector('tbody tr:last-child td:first-child')).toHaveTextContent('C Test');
    });

    test('should handle icon status when sorting', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .sortable=${true}></dss-table>
      `);
      const table = element.shadowRoot!.querySelector('table')!;
      (table.querySelector('thead th div') as HTMLDivElement).click();
      await elementUpdated(element);

      expect(table.querySelector('thead th:first-child dss-icon')).toHaveClass('icon-asc');

      (table.querySelector('thead th div') as HTMLDivElement).click();
      await elementUpdated(element);

      expect(table.querySelector('thead th:first-child dss-icon')).toHaveClass('icon-desc');

      (table.querySelector('thead th div') as HTMLDivElement).click();
      await elementUpdated(element);

      expect(table.querySelector('thead th:first-child dss-icon')).toBeNull();
    });
  });

  describe('expandable', () => {
    const testColumns: ColumnDef<TestData>[] = [{ id: 'name', accessorKey: 'name' }];
    const testData = [
      { name: 'A Test', subRows: [{ name: 'AA Test', subRows: [{ name: 'AAA Test' }] }] },
      { name: 'B Test', subRows: [{ name: 'BA Test' }, { name: 'BB Test' }] },
      { name: 'C Test' },
    ];

    test('should show expansion button in header if any rows are expandable', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData}></dss-table>
      `);

      const table = element.shadowRoot!.querySelector('table')!;
      expect(table.querySelector('thead th:first-child dss-button')).not.toBeNull();
    });

    test('should show expansion button in rows that are expandable', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData}></dss-table>
      `);

      const table = element.shadowRoot!.querySelector('table')!;
      expect(table.querySelector('tbody tr:nth-child(1) td:first-child dss-button')).not.toBeNull();
      expect(table.querySelector('tbody tr:nth-child(2) td:first-child dss-button')).not.toBeNull();
      expect(table.querySelector('tbody tr:nth-child(3) td:first-child dss-button')).toBeNull();
    });

    test('should show all rows expanded when clicking on header expansion button', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData}></dss-table>
      `);

      const table = element.shadowRoot!.querySelector('table')!;
      (table.querySelector('thead th:first-child dss-button') as HTMLButtonElement).click();
      await elementUpdated(element);

      expect(table.querySelectorAll('tbody tr')).toHaveLength(7);
    });

    test('should show one layer more on expand row click', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData}></dss-table>
      `);

      const table = element.shadowRoot!.querySelector('table')!;

      (table.querySelector('tbody tr:first-child td:first-child dss-button') as HTMLButtonElement).click();
      await elementUpdated(element);
      expect(table.querySelectorAll('tbody tr')).toHaveLength(4);

      (table.querySelector('tbody tr:nth-child(2) td:first-child dss-button') as HTMLButtonElement).click();
      await elementUpdated(element);
      expect(table.querySelectorAll('tbody tr')).toHaveLength(5);
    });

    test('should add even/odd classes same as parent on all sub rows', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData}></dss-table>
      `);

      const table = element.shadowRoot!.querySelector('table')!;
      (table.querySelector('thead th:first-child dss-button') as HTMLButtonElement).click();
      await elementUpdated(element);

      expect(table.querySelector('tbody tr:nth-of-type(1)')).toHaveClass('even');
      expect(table.querySelector('tbody tr:nth-of-type(2)')).toHaveClass('even');
      expect(table.querySelector('tbody tr:nth-of-type(3)')).toHaveClass('even');
      expect(table.querySelector('tbody tr:nth-of-type(4)')).toHaveClass('odd');
      expect(table.querySelector('tbody tr:nth-of-type(5)')).toHaveClass('odd');
      expect(table.querySelector('tbody tr:nth-of-type(6)')).toHaveClass('odd');
      expect(table.querySelector('tbody tr:nth-of-type(7)')).toHaveClass('even');
    });
  });

  describe('filterable', () => {
    const testColumns: ColumnDef<TestData>[] = [{ id: 'name', accessorKey: 'name' }];
    const testData = [{ name: 'A Test' }];

    test('shows filter row when filterable set to true', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .filterable=${true}></dss-table>
      `);

      expect(element.shadowRoot!.querySelector('dss-column-filter')).toBeInTheDocument();
    });

    test('shows filtered elements in footer', async () => {
      await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .filterable=${true}></dss-table>
      `);

      expect(screen.getByShadowText(`${DEFAULT_TABLE_TRANSLATIONS.filteredElements} 1`)).toBeInTheDocument();
    });
  });

  describe('when resizable set to true', () => {
    const testColumns: ColumnDef<TestData>[] = [
      { id: 'name', accessorKey: 'name' },
      {
        id: 'company',
        accessorKey: 'company',
        enableResizing: false,
      },
    ];
    const testData = [{ name: 'A Test' }];

    test('shows resize button for columns without disabled resizing', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .resizable=${true}></dss-table>
      `);

      expect(element.shadowRoot!.querySelectorAll('thead .resizer')).toHaveLength(1);
    });
  });

  describe('when setting translations', () => {
    const testColumns: ColumnDef<TestData>[] = [
      { id: 'name', accessorKey: 'name' },
    ];
    const testData = [{ name: 'A Test' }];

    test('shows set translations and fallback translations for undefined translations', async () => {
      const testTranslations: TableTranslations = {
        selectedElements: 'Test Translation:',
      };
      await fixture(html`
        <dss-table
          .columns=${testColumns as any[]}
          .data=${testData}
          .selectable=${true}
          .translations=${testTranslations}
        ></dss-table>
      `);

      expect(screen.getByShadowText(DEFAULT_TABLE_TRANSLATIONS.totalElements + ' 1')).toBeInTheDocument();
      expect(screen.getByShadowText('Test Translation: 0')).toBeInTheDocument();
    });
  });
});
