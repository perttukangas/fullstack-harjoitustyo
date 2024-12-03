import { ColumnDef } from '@tanstack/react-table';
import { Expand, Shrink, Trash } from 'lucide-react';

import { IconButton } from '@cc/components/Button';
import { DataTableColumnHeader } from '@cc/components/DataTable/DataTableColumnHeader';
import { createSelectColumn } from '@cc/components/DataTable/DataTableColumnSelect';
import LazyButton from '@cc/components/LazyButton';
import { lazyPrefetch } from '@cc/lib/lazy-prefetch';
import { type RouterOutputs } from '@cc/lib/trpc';

const Remove = lazyPrefetch(() => import('../../Post/Remove'));
const RemoveMany = lazyPrefetch(() => import('../../Post/RemoveMany'));

type InfinitePost = RouterOutputs['post']['infiniteCreator']['posts'][0];

export default function Columns(): ColumnDef<InfinitePost>[] {
  return [
    { ...createSelectColumn() },
    {
      id: 'expander',
      header: () => null,
      cell: ({ row }) => {
        return row.getCanExpand() ? (
          row.getIsExpanded() ? (
            <IconButton
              onClick={row.getToggleExpandedHandler()}
              aria-label="shrink comments"
            >
              <Shrink />
            </IconButton>
          ) : (
            <IconButton
              onClick={row.getToggleExpandedHandler()}
              aria-label="expand comments"
            >
              <Expand />
            </IconButton>
          )
        ) : (
          ''
        );
      },
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
    },
    {
      id: 'Comments',
      accessorFn: (row) => row._count.comments,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Comments" />
      ),
    },
    {
      id: 'Likes',
      accessorFn: (row) => row._count.likes,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Likes" />
      ),
    },
    {
      id: 'remove',
      header: ({ table }) => (
        <LazyButton
          icon={<Trash />}
          ariaLabel="remove selected posts"
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onMouseEnter={() => {
            void RemoveMany.prefetch();
          }}
        >
          {(openState) => (
            <RemoveMany
              onSuccessFn={table.resetRowSelection}
              postIds={table
                .getSelectedRowModel()
                .rows.map((row) => row.original.id)}
              {...openState}
            />
          )}
        </LazyButton>
      ),
      cell: ({ table, row }) => (
        <LazyButton
          icon={<Trash />}
          ariaLabel="remove post"
          onMouseEnter={() => {
            void Remove.prefetch();
          }}
        >
          {(openState) => (
            <Remove
              onSuccessFn={table.resetRowSelection}
              postId={row.original.id}
              {...openState}
            />
          )}
        </LazyButton>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
