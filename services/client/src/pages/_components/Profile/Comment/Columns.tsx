import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { DataTableColumnHeader } from '@cc/components/DataTable/DataTableColumnHeader';
import { createSelectColumn } from '@cc/components/DataTable/DataTableColumnSelect';
import { type RouterOutputs } from '@cc/lib/trpc';

type InfiniteComment =
  RouterOutputs['post']['comment']['infiniteCreator']['comments'][0];

export const columns: ColumnDef<InfiniteComment>[] = [
  { ...createSelectColumn() },
  {
    accessorKey: 'content',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Content" />
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
