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
  postIds: UnparsedDefaultId[];
  onSuccessFn?: () => void;
}

export default function RemoveMany({
  open,
  setOpen,
  postIds,
  onSuccessFn,
}: RemoveProps) {
  const { toast } = useToast();
  const tUtils = t.useUtils();

  const postsAmount = postIds.length;

  const removeManyMutation = t.post.removeMany.useMutation({
    onSuccess: async () => {
      await tUtils.post.infinite.invalidate({});
      await tUtils.post.infiniteCreator.reset({});
      if (onSuccessFn) onSuccessFn();
      toast({
        description: `You have successfully removed ${postsAmount} of your posts!`,
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirm {postsAmount} posts deletion
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {postsAmount} posts? This action is
            irreversible and the {postsAmount} posts will be permanently
            removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => removeManyMutation.mutate({ ids: postIds })}
          >
            Remove All
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
