'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { categories, statuses } from '@/constant';
import { Category, Event, Ticket } from '@/prisma/generated/prisma';
import { DataTableSortableHeader } from '@/components/data-table-sortable-header';
import EventActions from './EventActions';
import { formatEventDate } from '@/lib/utils';

export const EventColumns: ColumnDef<
  Event & {
    tickets: Ticket[];
    category: Category | null;
  }
>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: () => <DataTableSortableHeader field="title" title="Title" />,
    cell: ({ row }) => <div className="capitalize">{row.getValue('title')}</div>,
  },
  {
    accessorKey: 'status',
    header: () => <DataTableSortableHeader field="status" title="Status" />,
    cell: ({ row }) => {
      const status = statuses.find(status => status.value === row.getValue('status'));

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && <status.icon className="text-muted-foreground mr-2 h-4 w-4" />}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'category',
    header: () => <div className="font-bold">Category</div>,
    cell: ({ row }) => {
      const cat: Category = row.getValue('category');
      const category = categories.find(category => category.value === cat.slug);
      if (!category) {
        return null;
      }
      return (
        <div className="flex w-[100px] items-center">
          <span>{category.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const newId: Category = row.getValue(id);
      return value.includes(newId.slug);
    },
  },
  {
    accessorKey: 'schedule',
    header: () => <DataTableSortableHeader field="date" title="Time Schedule" />,
    cell: ({ row }) => (
      <div className="w-auto text-left">{formatEventDate(row.getValue('schedule'))}</div>
    ),
  },
  {
    accessorKey: 'venue',
    header: () => <div className="text-left font-bold">Venue</div>,
    cell: ({ row }) => <div className="w-auto overflow-hidden">{row.getValue('venue')}</div>,
  },
  {
    accessorKey: 'capacity',
    header: () => <div className="text-left font-bold">Attendees</div>,
    cell: ({ row }) => <div className="w-auto text-left">{row.getValue('capacity')}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="text-center">
        <EventActions slug={row.original.slug} />
      </div>
    ),
  },
];
