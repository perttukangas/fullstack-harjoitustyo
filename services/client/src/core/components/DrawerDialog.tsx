import { Suspense, lazy } from 'react';

import { useIsMobile } from '@cc/hooks/use-is-mobile';

const Dialog = lazy(() =>
  import('@cc/components/Dialog').then((module) => ({ default: module.Dialog }))
);
const DialogContent = lazy(() =>
  import('@cc/components/Dialog').then((module) => ({
    default: module.DialogContent,
  }))
);
const DialogDescription = lazy(() =>
  import('@cc/components/Dialog').then((module) => ({
    default: module.DialogDescription,
  }))
);
const DialogHeader = lazy(() =>
  import('@cc/components/Dialog').then((module) => ({
    default: module.DialogHeader,
  }))
);
const DialogTitle = lazy(() =>
  import('@cc/components/Dialog').then((module) => ({
    default: module.DialogTitle,
  }))
);

const Drawer = lazy(() =>
  import('@cc/components/Drawer').then((module) => ({ default: module.Drawer }))
);
const DrawerContent = lazy(() =>
  import('@cc/components/Drawer').then((module) => ({
    default: module.DrawerContent,
  }))
);
const DrawerDescription = lazy(() =>
  import('@cc/components/Drawer').then((module) => ({
    default: module.DrawerDescription,
  }))
);
const DrawerHeader = lazy(() =>
  import('@cc/components/Drawer').then((module) => ({
    default: module.DrawerHeader,
  }))
);
const DrawerTitle = lazy(() =>
  import('@cc/components/Drawer').then((module) => ({
    default: module.DrawerTitle,
  }))
);

interface DrawerDialogProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DrawerDialog({
  title,
  description,
  children,
  footer,
  open,
  setOpen,
}: DrawerDialogProps) {
  const { isMobile, loading } = useIsMobile();

  if (loading) {
    return null;
  }

  if (isMobile) {
    return (
      <Suspense>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="flex max-h-full flex-col">
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            {children}
            <div className="sticky bottom-0">{footer}</div>
          </DrawerContent>
        </Drawer>
      </Suspense>
    );
  }

  return (
    <Suspense>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[90%] flex-col">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
          <div className="sticky bottom-0">{footer}</div>
        </DialogContent>
      </Dialog>
    </Suspense>
  );
}
