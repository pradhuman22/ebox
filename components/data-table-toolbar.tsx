'use client';

import { Table } from '@tanstack/react-table';
import { DownloadIcon, PlusIcon, X } from 'lucide-react';

import { Input } from './ui/input';
import { Button } from './ui/button';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';
import { categories, statuses } from '@/constant';
import Link from 'next/link';
import * as XLSX from 'xlsx';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleExportToExcel = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const data =
      selectedRows.length > 0
        ? selectedRows.map(row => row.original)
        : table.getFilteredRowModel().rows.map(row => row.original);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Events');
    XLSX.writeFile(wb, `events_${selectedRows.length > 0 ? 'selected' : 'all'}.xlsx`);
  };

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="mb-2 flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={event => table.getColumn('title')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn('category') && (
          <DataTableFacetedFilter
            column={table.getColumn('category')}
            title="Category"
            options={categories}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DataTableViewOptions table={table} />
        <Button onClick={handleExportToExcel} variant="outline" size="sm">
          <DownloadIcon className="h-4 w-4" />
          Export to Excel
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={'/dashboard/events/create'}>
            <PlusIcon />
            <span className="lg:inline">Add Event</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
