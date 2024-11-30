import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@cc/components/Checkbox';
import { DataTableColumnHeader } from '@cc/components/DataTable/DataTableColumnHeader';
import { type RouterOutputs } from '@cc/lib/trpc';

type InfiniteComment =
  RouterOutputs['post']['comment']['infinite']['comments'][0];

export const columns: ColumnDef<InfiniteComment>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="select row"
        className="mr-2 translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'content',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Content" />
    ),
  },
  {
    accessorKey: 'likes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Likes" />
    ),
  },
];
