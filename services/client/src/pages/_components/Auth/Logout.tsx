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
import { useSession } from '@cc/hooks/use-session';
import { useToast } from '@cc/hooks/use-toast';
import { t } from '@cc/lib/trpc';

interface LogoutProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Logout({ open, setOpen }: LogoutProps) {
  const { toast } = useToast();
  const tUtils = t.useUtils();
  const { setUser } = useSession();

  const logoutMutation = t.user.logout.useMutation({
    onSuccess: async () => {
      setUser(undefined);
      setOpen(false);
      toast({ description: 'You have successfully logged out!' });
      await tUtils.invalidate();
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm log out</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out? You will need to log in again to
            access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => logoutMutation.mutate()}>
            Log out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
