import { ColumnDef } from '@tanstack/react-table';
import { Trash } from 'lucide-react';

import { DataTableColumnHeader } from '@cc/components/DataTable/DataTableColumnHeader';
import { createSelectColumn } from '@cc/components/DataTable/DataTableColumnSelect';
import LazyButton from '@cc/components/LazyButton';
import { lazyPrefetch } from '@cc/lib/lazy-prefetch';
import { type RouterOutputs } from '@cc/lib/trpc';

const Remove = lazyPrefetch(() => import('../../Comment/Remove'));
const RemoveMany = lazyPrefetch(() => import('../../Comment/RemoveMany'));

type InfinitePost = RouterOutputs['post']['infiniteCreator']['posts'][0]['id'];
type InfiniteComment =
  RouterOutputs['post']['comment']['infiniteCreator']['comments'][0];

interface GetColumnsProps {
  postId: InfinitePost;
}

export default function Columns({
  postId,
}: GetColumnsProps): ColumnDef<InfiniteComment>[] {
  return [
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
      id: 'remove',
      header: ({ table }) => (
        <LazyButton
          icon={<Trash />}
          ariaLabel="remove selected comments"
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
              postId={postId}
              commentIds={table
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
          ariaLabel="remove comment"
          onMouseEnter={() => {
            void Remove.prefetch();
          }}
        >
          {(openState) => (
            <Remove
              onSuccessFn={table.resetRowSelection}
              postId={postId}
              commentId={row.original.id}
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
