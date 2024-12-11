import { produce } from 'immer';

import { UnparsedDefaultId } from '@shared/zod/common';

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
import { t } from '@cc/lib/trpc';

interface RemoveProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  postId: UnparsedDefaultId;
  commentId: UnparsedDefaultId;
  onSuccessFn?: () => void;
}

export default function Remove({
  open,
  setOpen,
  postId,
  commentId,
  onSuccessFn,
}: RemoveProps) {
  const { toast } = useToast();
  const tUtils = t.useUtils();

  const removeMutation = t.post.comment.remove.useMutation({
    onSuccess: async () => {
      await tUtils.post.comment.infinite.invalidate({ postId });
      await tUtils.post.comment.infiniteCreator.reset({ postId });
      tUtils.post.infinite.setInfiniteData({}, (oldData) => {
        return !oldData
          ? oldData
          : produce(oldData, (draft) => {
              for (const page of draft.pages) {
                if (!page.nextCursor || page.nextCursor < postId) {
                  for (const post of page.posts) {
                    if (post.id === postId) {
                      post.comments -= 1;
                      break;
                    }
                  }
                  break;
                }
              }
            });
      });
      if (onSuccessFn) onSuccessFn();
      toast({ description: 'You have successfully removed your comment!' });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm comment deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this comment? This action is
            irreversible and the comment will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => removeMutation.mutate({ id: commentId })}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
