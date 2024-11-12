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

export default function RemovePost() {
  const { toast } = useToast();
  //open?: boolean | undefined;
  //slot?: string | undefined;
  //style?: React.CSSProperties | undefined;
  //title?: string | (string & React.ReactElement<any, string | React.JSXElementConstructor<any>>) | (string & Iterable<...>) | (string & React.ReactPortal) | undefined;
  //... 276 more ...;
  //description?: React.ReactNode
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            post.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => toast({ description: 'Removed', duration: 10000 })}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
