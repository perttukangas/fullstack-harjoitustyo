import { Trash } from 'lucide-react';

import type { RemoveInput } from '@apiv1/post/comment/validators';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@cc/components/AlertDialog';
import { Button } from '@cc/components/Button';
import { useToast } from '@cc/hooks/use-toast';
import { t } from '@cc/lib/trpc';

export default function RemoveComment({
  id,
  postId,
}: RemoveInput & { postId: number }) {
  const { toast } = useToast();
  const tUtils = t.useUtils();
  const removeMutation = t.post.comment.remove.useMutation({
    onSuccess: async () => {
      await tUtils.post.comment.infinite.invalidate({ postId });
      toast({ description: 'You have successfully removed your comment!' });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash />
        </Button>
      </AlertDialogTrigger>
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
          <AlertDialogAction onClick={() => removeMutation.mutate({ id })}>
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
