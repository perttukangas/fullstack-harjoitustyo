import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@cc/components/AlertDialog';
import { useToast } from '@cc/hooks/use-toast';
import { type RouterOutputs, t } from '@cc/lib/trpc';

type InfinitePost = RouterOutputs['post']['infinite']['posts'][0];

interface RemoveProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  row: InfinitePost;
}

export default function Remove({ open, setOpen, row }: RemoveProps) {
  const { toast } = useToast();
  const tUtils = t.useUtils();

  const removeMutation = t.post.remove.useMutation({
    onSuccess: async () => {
      await tUtils.post.infinite.invalidate({});
      toast({ description: 'You have successfully removed your post!' });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm post deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this post? This action is
            irreversible and the post will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => removeMutation.mutate({ id: row.id })}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
