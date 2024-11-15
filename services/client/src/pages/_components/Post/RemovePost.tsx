import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@c/core/components/AlertDialog';
import { useToast } from '@c/core/hooks/use-toast';
import { t } from '@c/core/lib/trpc';

import { type RemoveInput } from '@apiv1/post/validators';

interface RemovePostProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: RemoveInput['id'];
}

export default function RemovePost({ open, setOpen, id }: RemovePostProps) {
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
          <AlertDialogAction onClick={() => removeMutation.mutate({ id })}>
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
