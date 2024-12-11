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
  commentIds: UnparsedDefaultId[];
  onSuccessFn?: () => void;
}

export default function RemoveMany({
  open,
  setOpen,
  postId,
  commentIds,
  onSuccessFn,
}: RemoveProps) {
  const { toast } = useToast();
  const tUtils = t.useUtils();

  const commentAmount = commentIds.length;

  const removeManyMutation = t.post.comment.removeMany.useMutation({
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
                      post.comments -= commentAmount;
                      break;
                    }
                  }
                  break;
                }
              }
            });
      });
      tUtils.post.infiniteCreator.setInfiniteData({}, (oldData) => {
        return !oldData
          ? oldData
          : produce(oldData, (draft) => {
              for (const page of draft.pages) {
                if (!page.nextCursor || page.nextCursor < postId) {
                  for (const post of page.posts) {
                    if (post.id === postId) {
                      post._count.comments -= commentAmount;
                      break;
                    }
                  }
                  break;
                }
              }
            });
      });
      if (onSuccessFn) onSuccessFn();
      toast({
        description: `You have successfully removed ${commentAmount} of your comments!`,
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirm {commentAmount} comments deletion
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {commentAmount} comments? This
            action is irreversible and the {commentAmount} comments will be
            permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => removeManyMutation.mutate({ ids: commentIds })}
          >
            Remove All
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
