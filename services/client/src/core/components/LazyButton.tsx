import { ReactNode, Suspense, useState } from 'react';

import { Button } from './Button';
import Loader from './Loader';

interface LazyButtonPropsBase {
  children: (props: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => ReactNode;
}

interface LazyButtonWithButton extends LazyButtonPropsBase {
  button: (props: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => ReactNode;
  icon?: never;
  onMouseEnter?: never;
}

interface LazyButtonWithIcon extends LazyButtonPropsBase {
  icon: ReactNode;
  button?: never;
  onMouseEnter?: () => void;
}

type LazyButtonProps = LazyButtonWithButton | LazyButtonWithIcon;

export default function LazyButton({
  onMouseEnter,
  button,
  icon,
  children,
}: LazyButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Suspense fallback={<Loader />}>
      {button ? (
        button({ open, setOpen })
      ) : (
        <Button
          onMouseEnter={onMouseEnter}
          onClick={() => setOpen(true)}
          variant="ghost"
          size="icon"
        >
          {icon}
        </Button>
      )}
      {open && children({ open, setOpen })}
    </Suspense>
  );
}
