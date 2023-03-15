import './table.component';
import { html } from 'lit-html';
import { format } from 'date-fns';
import { makeData, Person } from './makeData.story-utils';
import { classMap } from 'lit-html/directives/class-map.js';
import DssTable from './table.component';
import Table, { ColumnDef } from './table.component';
import { Meta, Story } from '@storybook/web-components';
import docs from './table.md?raw';
import docsFilterable from './table.filterable.md?raw';

const numberTypes: Intl.NumberFormatPartTypes[] = [
  'minusSign',
  'integer',
  'group',
  'decimal',
  'fraction',
];

export default {
  title: 'Components/Table',
  component: 'dss-table',
  parameters: {
    actions: {
      handles: ['dss-table-selection-change'],
    },
    docs: {
      description: {
        component: docs,
      },
    },
  },
} as Meta;

const Template: Story<Table> = ({
  data,
  columns,
  customStyles,
  selectable,
  sortable,
  paginate,
  filterable,
  resizable,
  translations,
}: DssTable) => html`
  <dss-table
    .data=${data}
    .columns=${columns as any}
    .customStyles=${customStyles}
    .selectable=${selectable}
    .sortable="${sortable}"
    .paginate="${paginate}"
    .filterable="${filterable}"
    .resizable="${resizable ?? false}"
    .translations="${translations}"
  ></dss-table>
`;

export const Default = Template.bind({});
Default.args = {
  data: makeData(20),
  columns: [
    {
      id: 'firstName',
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: 'Last Name',
    },
    {
      id: 'createdAt',
      header: 'Created At',
      accessorFn: (row) => format(row.createdAt as Date, 'dd.MM.yyyy hh:mm:ss'),
    },
  ] as ColumnDef<Person>[],
};

export const CustomRender = Template.bind({});
CustomRender.args = {
  data: makeData(20),
  // language=CSS
  customStyles: `
    .wealth {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      background-color: #A4D1A2;
      margin: calc(var(--size-spacing-0-25) * -1) calc(var(--size-spacing-0-5) * -1);
      padding: var(--size-spacing-0-25) var(--size-spacing-0-5);
    }

    .wealth-negative {
      background-color: #ffb6b6;
    }
  `,
  columns: [
    {
      id: 'firstName',
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: 'Last Name',
    },
    {
      accessorKey: 'wealth',
      id: 'wealth',
      accessorFn: ({ wealth }) => new Intl.NumberFormat(navigator.language, {
        style: 'currency',
        currency: wealth.currency,
        maximumFractionDigits: 2,

      }).format(wealth.amount),
      header: () => html`
        <marquee>Wealth</marquee>`,
      cell: ({ row: { original } }) => {
        const { amount, currency } = original.wealth;
        const formattedParts = new Intl.NumberFormat(navigator.language, {
          style: 'currency',
          currency,
          maximumFractionDigits: 2,

        }).formatToParts(amount);
        return html`
          <div
            class=${classMap({
              wealth: true,
              'wealth-negative': amount < 0,
            })}
          >
            <span>${formattedParts.find(part => part.type === 'currency')?.value}</span>
            <span>
                  ${formattedParts
                    .filter(part => numberTypes.includes(part.type))
                    .map(part => part.value)
                    .join('')}
                </span>
          </div>
        `;
      },
      filterFn: (row, columnId, filterValue: string) => {
        const separatedValues = filterValue.split(' ');
        const formattedPrice: string = row.getValue(columnId);
        return separatedValues.every(value => formattedPrice.includes(value));
      },
    },
  ] as ColumnDef<Person>[],
};

export const Resizable = Template.bind({});
Resizable.parameters = {
  docs: {
    description: {
      story: 'Resizing of specific columns can be turned off with setting `enableResizing` in the column config.',
    },
  },
};
Resizable.args = {
  resizable: true,
  data: makeData(20),
  columns: [
    {
      id: 'firstName',
      accessorKey: 'firstName',
      header: 'Resizable column',
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: 'Fixed column',
      enableResizing: false,
    },
  ] as ColumnDef<Person>[],
};

export const Selectable = Template.bind({});
Selectable.args = {
  selectable: true,
  data: makeData(20),
  columns: [
    {
      id: 'firstName',
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: 'Last Name',
    },
  ] as ColumnDef<Person>[],
};

export const Sortable = Template.bind({});
Sortable.args = {
  sortable: true,
  data: makeData(20),
  columns: [
    {
      id: 'firstName',
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: 'Last Name',
    },
  ] as ColumnDef<Person>[],
};

export const Expandable = Template.bind({});
Expandable.args = {
  sortable: true,
  data: makeData(20, 3, 2),
  columns: [
    {
      id: 'firstName',
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: 'Last Name',
    },
  ] as ColumnDef<Person>[],
};

export const Pagination = Template.bind({});
Pagination.args = {
  paginate: true,
  data: makeData(200),
  columns: [
    {
      id: 'firstName',
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: 'Last Name',
    },
  ] as ColumnDef<Person>[],
};


export const Filterable = Template.bind({});
Filterable.parameters = {
  docs: {
    description: {
      story: docsFilterable,
    },
  },
};
Filterable.args = {
  filterable: true,
  data: makeData(100),
  columns: [
    {
      id: 'firstName',
      accessorKey: 'firstName',
      header: 'First Name (Case-sensitive Filter)',
      filterFn: 'includesStringSensitive',
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: 'Last Name (Default Filter: case-insensitive)',
    },
    {
      accessorKey: 'wealth',
      id: 'wealth',
      header: 'Wealth (Multiple Band Filter)',
      accessorFn: ({ wealth }) => wealth.amount,
      filterFn: 'multipleBand',
    },
  ] as ColumnDef<Person>[],
};
