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

type InfinitePost = RouterOutputs['post']['infinite']['posts'][0]['id'];

interface RemoveProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  postId: InfinitePost;
  onSuccessFn?: () => void;
}

export default function Remove({
  open,
  setOpen,
  postId,
  onSuccessFn,
}: RemoveProps) {
  const { toast } = useToast();
  const tUtils = t.useUtils();

  const removeMutation = t.post.remove.useMutation({
    onSuccess: async () => {
      await tUtils.post.infinite.invalidate({});
      await tUtils.post.infiniteCreator.reset({});
      if (onSuccessFn) onSuccessFn();
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
            onClick={() => removeMutation.mutate({ id: postId })}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
