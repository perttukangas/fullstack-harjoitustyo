import { Trash } from 'lucide-react';

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
} from '@c/core/components/AlertDialog';
import { Button } from '@c/core/components/Button';
import { useToast } from '@c/core/hooks/use-toast';
import { t } from '@c/core/lib/trpc';

import { type RemoveInput } from '@apiv1/post/validators';

export default function RemovePost({ id }: RemoveInput) {
  const { toast } = useToast();
  const tUtils = t.useUtils();
  const removeMutation = t.post.remove.useMutation({
    onSuccess: async () => {
      await tUtils.post.infinite.invalidate({});
      toast({ description: 'You have successfully removed your post!' });
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
          <AlertDialogTitle>Confirm post deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this post? This action is
            irreversible and the post will be permanently removed.
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
