import { html, nothing, PropertyValues, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  ColumnDef,
  CoreHeader,
  createTable,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Header,
  HeaderGroup,
  Row,
  RowSelectionRow,
  RowSelectionState,
  Table as TanstackTable,
  TableOptionsResolved,
  TableState,
  Updater,
} from '@tanstack/table-core';
import { repeat } from 'lit-html/directives/repeat.js';
import { when } from 'lit-html/directives/when.js';
import styles from './table.css?inline';
import BaseElement from '../../internals/baseElement/baseElement';
import '../icon/icon.component';
import '../button/button.component';
import '../checkbox/checkbox.component';
import '../pagination/pagination.component';
import './columnFilter';
import { DssPaginationPageIndexSelectedEvent } from '../pagination/pagination.component';
import { multipleBandFilter } from './customFilters';

export type { ColumnDef } from '@tanstack/table-core';
export type DssTableSelectionChangeEvent = CustomEvent<any[]>;

export interface TableEventsPayloadMap {
  'dss-table-selection-change': any[];
}

export interface TableTranslations {
  selectedElements?: string;
  filteredElements?: string;
  totalElements?: string;
}

export const DEFAULT_TABLE_TRANSLATIONS = {
  filteredElements: 'Filtered Elements:',
  selectedElements: 'Selected Elements:',
  totalElements: 'Total Elements:',
};

const WATCHED_PROPS: Array<keyof Table> = ['columns', 'data', 'sortable', 'paginate', 'resizable'];
export const PAGE_SIZE = 20;

/**
 * @event {DssTableSelectionChangeEvent} dss-table-selection-change - Fires when the selection of rows changed
 * @property columns - The column definition for this table. See TanStack Table for Reference
 * @property data - Array of rows that should be displayed with the given columns definition
 * @property customStyles - Pass Styles that will be defined inside the table shadow root
 * @property selectable - Allow rows to be selectable, default false
 * @property sortable - Allow table headers to be sortable, default false
 * @property paginate - Add pagination to the table
 * @property filterable - Add filters to the table columns
 * @property translations - Pass translated texts
 */
@customElement('dss-table')
export default class Table extends BaseElement<TableEventsPayloadMap> {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ attribute: false })
  public data?: any[];
  @property({ attribute: false })
  public columns?: ColumnDef<any>[];
  @property({ attribute: false })
  public customStyles?: string;
  @property({ attribute: false })
  public selectable = false;
  @property({ attribute: false })
  public paginate = false;
  @property({ attribute: false })
  public sortable = false;
  @property({ attribute: false })
  public filterable = false;
  @property({ attribute: false })
  public resizable = false;

  @property({ attribute: false })
  set translations(overwrittenTranslations: TableTranslations) {
    this._translations = {
      ...DEFAULT_TABLE_TRANSLATIONS,
      ...overwrittenTranslations,
    };
  }

  get translations() {
    return this._translations;
  }

  private _translations: TableTranslations = DEFAULT_TABLE_TRANSLATIONS;
  private table?: TanstackTable<any>;

  override render() {
    if (!this.table || !this.columns || !this.data) {
      return;
    }

    const currentRows = this.table.getRowModel().rows;
    const topLevelRows = currentRows.filter((row) => row.depth === 0);

    return html`
      ${when(this.customStyles, () => html`
        <style>${unsafeCSS(this.customStyles)}</style>
      `)}
      <div class="table-container">
        <table>
          <thead>
          ${this.table.getHeaderGroups().map((headerGroup) => html`
            <tr>
              ${when(this.table?.getCanSomeRowsExpand(), () => html`
                <th class="expand-header">
                  <dss-button type="icon-only" @click=${this.table?.getToggleAllRowsExpandedHandler()}>
                    <dss-icon
                      icon="${this.table?.getIsAllRowsExpanded() ? 'navigate_minus' : 'navigate_plus'}"
                      size="xsmall"
                    ></dss-icon>
                  </dss-button>
                </th>
              `)}
              ${when(this.selectable, () => this.renderHeaderSelection())}
              ${headerGroup.headers.map((header) => html`
                <th
                  colSpan=${header.colSpan}
                  draggable="true"
                  @dragstart=${({ dataTransfer }: DragEvent) => dataTransfer?.setData('text/plain', header.column.id)}
                  @dragover=${(event: DragEvent) => event.preventDefault()}
                  @drop=${({ dataTransfer }: DragEvent) => this.dropHeader(header.column.id, dataTransfer?.getData('text/plain'))}
                  style="${header.column.getCanResize() ? `width: ${header.getSize()}px` : ''}"
                >
                  ${when(this.sortable,
                    () => html`
                      <div class="sortable-header" @click=${header.column.getToggleSortingHandler()}>
                        <span>${this.renderHeaderCell(header)}</span>
                        ${when(header.column.getIsSorted(), () => html`
                          <dss-icon
                            icon="navigate_up"
                            class="sort-icon icon-${header.column.getIsSorted()}"
                            size="xsmall"
                          ></dss-icon>
                        `)}
                      </div>
                    `,
                    () => this.renderHeaderCell(header),
                  )}
                  ${when(header.column.getCanResize(), () => html`
                    <div
                      @mousedown=${(event: MouseEvent) => this.startResizing(event, header)}
                      @touchstart=${(event: TouchEvent) => this.startResizing(event, header)}
                      class="resizer"
                      role="separator"
                    ></div>
                  `)}
                </th>
              `)}
            </tr>
            ${when(this.filterable, () => this.renderFilterRow(headerGroup))}
          `)}
          </thead>

          <tbody>
          ${repeat(currentRows, (row) => row.id, (row) => html`
            <tr class=${this.getEvenOddOfParentRow(row, topLevelRows)}>
              ${when(this.table?.getCanSomeRowsExpand(), () => html`
                <td>
                  ${when(row.getCanExpand(), () => html`
                    <dss-button
                      style="margin-left: ${row.depth}rem"
                      type="icon-only"
                      @click=${row.getToggleExpandedHandler()}
                    >
                      <dss-icon
                        icon="${row.getIsExpanded() ? 'navigate_minus' : 'navigate_plus'}"
                        size="xsmall"
                      ></dss-icon>
                    </dss-button>
                  `)}
                </td>
              `)}
              ${when(this.selectable, () => this.renderRowSelection(row))}
              ${row.getVisibleCells().map((cell) => html`
                <td style="${cell.column.getCanResize() ? `width: ${cell.column.getSize()}px` : ''}">
                  ${this.flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext(),
                  )}
                </td>
              `)}
            </tr>
          `)}
          </tbody>
        </table>
      </div>
      ${when(this.shouldRenderFooter(), () => this.renderFooter())}
    `;
  }

  private renderFilterRow(headerGroup: HeaderGroup<any>): TemplateResult<1> {
    return html`
      <tr>
        ${when(this.selectable, () => html`
          <td></td>
        `)}
        ${when(this.table?.getCanSomeRowsExpand(), () => html`
          <td></td>
        `)}
        ${headerGroup.headers.map((header) => html`
          <td>
            <dss-column-filter .header=${header as any}></dss-column-filter>
          </td>
        `)}
      </tr>
    `;
  }

  private shouldRenderFooter() {
    return this.paginate || this.selectable || this.filterable;
  }

  private renderFooter() {
    return html`
      <div class="footer">
        <span class="footer-information">
          <span>${this.translations.totalElements} ${this.table!.getCoreRowModel().flatRows.length}</span>
          ${when(this.filterable, () => html`
            <span>${this.translations.filteredElements} ${this.table!.getFilteredRowModel().flatRows.length}</span>
          `)}
          ${when(this.selectable, () => html`
            <span>${this.translations.selectedElements} ${this.table!.getSelectedRowModel().flatRows.length}</span>
          `)}
        </span>
        ${when(this.paginate, () => html`
          <dss-pagination
            .activePageIndex=${this.table!.getState().pagination.pageIndex}
            .pageCount=${this.table!.getPageCount()}
            .firstPage=${() => this.table!.setPageIndex(0)}
            .previousPage=${() => this.table!.previousPage()}
            .nextPage=${() => this.table!.nextPage()}
            .lastPage=${() => this.table!.setPageIndex(this.table!.getPageCount() - 1)}
            .canGetPreviousPage=${this.table!.getCanPreviousPage}
            .canGetNextPage=${this.table!.getCanNextPage}
            @dss-pagination-page-index-selected=${({ detail }: DssPaginationPageIndexSelectedEvent) => this.table!.setPageIndex(detail)}
          ></dss-pagination>
        `)}
      </div>
    `;
  }

  private renderHeaderSelection(): TemplateResult {
    return html`
      <th>
        <dss-checkbox
          size="compact"
          @change=${this.table!.getToggleAllRowsSelectedHandler()}
          .checked=${this.table!.getIsAllRowsSelected()}
          .indeterminate=${this.table!.getIsSomeRowsSelected()}
        ></dss-checkbox>
      </th>
    `;
  }

  private renderRowSelection(row: RowSelectionRow): TemplateResult {
    return html`
      <td>
        <dss-checkbox
          size="compact"
          @change=${row.getToggleSelectedHandler()}
          .checked=${row.getIsSelected()}
          .indeterminate=${row.getIsSomeSelected()}
        ></dss-checkbox>
      </td>
    `;
  }

  private renderHeaderCell(header: CoreHeader<any, unknown>) {
    if (header.isPlaceholder) {
      return nothing;
    }
    return this.flexRender(
      header.column.columnDef.header,
      header.getContext(),
    );
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.necessaryPropertiesSet()) {
      this.initTable();
      this.requestUpdate();
    }
  }


  override willUpdate(_changedProperties: PropertyValues) {
    const keys = Array.from(_changedProperties.keys());
    if (keys.some((key) => WATCHED_PROPS.includes(key as keyof Table))
      && this.necessaryPropertiesSet()) {
      if (this.table) {
        this.table.setOptions((prev) => ({
          ...prev,
          ...this.getFeatureRowModels(),
          data: this.data!,
          columns: this.columns!,
          state: {
            ...prev.state,
            pagination: {
              pageIndex: prev.state.pagination?.pageIndex ?? 0,
              pageSize: PAGE_SIZE,
            },
          },
        }));
      } else {
        this.initTable();
      }
    }
  }

  private necessaryPropertiesSet(): boolean {
    return this.columns !== undefined && this.data !== undefined;
  }

  private initTable() {
    this.table = createTable(this.createOptions());
    this.table.setOptions((prev) => ({
      ...prev,
      state: {
        ...this.table!.initialState,
        columnOrder: this.columns!.map(column => column.id as string),
        pagination: {
          pageIndex: 0,
          pageSize: PAGE_SIZE,
        },
      },
    }));
  }

  private getFeatureRowModels(): Partial<TableOptionsResolved<any>> {
    const rowModels: Partial<TableOptionsResolved<any>> = {};
    if (this.sortable) {
      rowModels.getSortedRowModel = getSortedRowModel();
    }
    if (this.paginate) {
      rowModels.getPaginationRowModel = getPaginationRowModel();
    }
    if (this.filterable) {
      rowModels.getFilteredRowModel = getFilteredRowModel();
    }
    return rowModels;
  }

  private createOptions() {
    const options: TableOptionsResolved<any> = {
      data: this.data!,
      columns: this.columns!,
      state: {},
      filterFns: {
        multipleBand: multipleBandFilter,
      },
      renderFallbackValue: null,
      columnResizeMode: 'onChange',
      enableColumnResizing: this.resizable,
      getSubRows: (row) => row.subRows,
      onStateChange: () => {
      },
      getCoreRowModel: getCoreRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      ...this.getFeatureRowModels(),
      onRowSelectionChange: (updaterOrValue) => this.handleRowSelectionChange(updaterOrValue),
      onSortingChange: (updaterOrValue) => this.updatePartialTableState(updaterOrValue, 'sorting'),
      onColumnOrderChange: (updaterOrValue) => this.updatePartialTableState(updaterOrValue, 'columnOrder'),
      onExpandedChange: (updaterOrValue) => this.updatePartialTableState(updaterOrValue, 'expanded'),
      onPaginationChange: (updaterOrValue) => this.updatePartialTableState(updaterOrValue, 'pagination'),
      onColumnFiltersChange: (updaterOrValue) => this.updatePartialTableState(updaterOrValue, 'columnFilters'),
      onColumnSizingChange: (updaterOrValue) => this.updatePartialTableState(updaterOrValue, 'columnSizing'),
      onColumnSizingInfoChange: (updaterOrValue) => this.updatePartialTableState(updaterOrValue, 'columnSizingInfo'),
    };
    return options;
  }

  private handleRowSelectionChange(updaterOrValue: Updater<RowSelectionState>) {
    this.updatePartialTableState(updaterOrValue, 'rowSelection');
    this.dispatchCustomEvent('dss-table-selection-change', this.table!.getSelectedRowModel().rows.map(row => row.original));
  }

  private startResizing(event: MouseEvent | TouchEvent, header: Header<any, unknown>) {
    event.preventDefault();
    header.getResizeHandler()(event);
  }

  private flexRender<TProps extends object>(component: any, props: TProps) {
    if (typeof component === 'function') {
      return component(props);
    }
    return component;
  }

  private updatePartialTableState(updaterOrValue: Updater<any>, field: keyof TableState): any {
    this.table!.setOptions((prev) => ({
      ...prev,
      state: {
        ...prev.state,
        [field]: typeof updaterOrValue === 'function'
          ? updaterOrValue(this.table!.getState()[field])
          : updaterOrValue,
      },
    }));
    this.requestUpdate();
  }

  private dropHeader(dropColumnId: string, dragColumnId?: string) {
    if (!dragColumnId || dropColumnId === dragColumnId) {
      return;
    }
    const newColumnOrder = [...this.table!.getState().columnOrder];
    newColumnOrder.splice(
      newColumnOrder.indexOf(dropColumnId),
      0,
      newColumnOrder.splice(newColumnOrder.indexOf(dragColumnId), 1)[0],
    );
    this.updatePartialTableState(newColumnOrder, 'columnOrder');
  }

  private getEvenOddOfParentRow(row: Row<any>, topLevelRows: Row<any>[]): 'even' | 'odd' {
    let index: number;
    if (row.depth === 0) {
      index = topLevelRows.findIndex((currentRow) => currentRow === row);
    } else {
      const parentId = parseInt(row.id);
      index = topLevelRows.findIndex((currentRow) => parseInt(currentRow.id) === parentId);
    }
    return index % 2 === 0
      ? 'even'
      : 'odd';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-table': Table;
  }

  interface WindowEventMap {
    'dss-table-selection-change': DssTableSelectionChangeEvent;
  }
}
