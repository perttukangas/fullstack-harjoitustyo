import {
  ColumnDef,
  ExpandedState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Fragment, ReactNode, useState } from 'react';

import { Button } from '@cc/components/Button';
import { DataTableViewOptions } from '@cc/components/DataTable/DataTableViewOptions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@cc/components/Table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  columnsData: TData[];
  expandedRender?: (data: TData) => ReactNode;

  fetchNextPage: () => Promise<unknown>;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;

  fetchPreviousPage: () => Promise<unknown>;
  isFetchingPreviousPage: boolean;
  hasPreviousPage: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  columnsData,
  expandedRender,

  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,

  fetchPreviousPage,
  isFetchingPreviousPage,
  hasPreviousPage,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data: columnsData,
    columns,
    state: {
      rowSelection,
      columnVisibility,
      sorting,
      expanded,
    },

    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    ...(expandedRender && {
      getRowCanExpand: () => true,
      onExpandedChange: setExpanded,
      getExpandedRowModel: getExpandedRowModel(),
    }),
  });

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <DataTableViewOptions table={table} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Fragment key={`${row.id}-fragment`}>
                  <TableRow
                    key={`${row.id}-row`}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={`${cell.id}-cell`}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expandedRender && row.getIsExpanded() && (
                    <TableRow key={`${row.id}-expanded-row`}>
                      <TableCell
                        key={`${row.id}-expanded-cell`}
                        colSpan={row.getVisibleCells().length}
                        className="[&:has([role=checkbox])]:pr-2"
                      >
                        {expandedRender(row.original)}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nothing more to load
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => void fetchPreviousPage()}
          disabled={!hasPreviousPage || isFetchingPreviousPage}
        >
          Previous Page
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          Next Page
        </Button>
      </div>
    </div>
  );
}
