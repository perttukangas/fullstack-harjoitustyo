import { ColumnDef } from '@tanstack/react-table';
import { Expand, MoreHorizontal, Shrink } from 'lucide-react';

import { IconButton } from '@cc/components/Button';
import { DataTableColumnHeader } from '@cc/components/DataTable/DataTableColumnHeader';
import { createSelectColumn } from '@cc/components/DataTable/DataTableSelect';
import { type RouterOutputs } from '@cc/lib/trpc';

type InfinitePost = RouterOutputs['post']['infiniteCreator']['posts'][0];

export const columns: ColumnDef<InfinitePost>[] = [
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
    id: 'actions',
    header: () => <MoreHorizontal />,
    cell: () => <MoreHorizontal />,
    enableSorting: false,
    enableHiding: false,
  },
];
