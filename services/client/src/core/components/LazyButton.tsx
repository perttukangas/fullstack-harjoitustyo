import React, { ReactNode, Suspense, useState } from 'react';

import { IconButton } from './Button';
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
  ariaLabel?: never;
  onMouseEnter?: never;
}

interface LazyButtonWithIcon extends LazyButtonPropsBase {
  icon: ReactNode;
  ariaLabel: React.AriaAttributes['aria-label'];
  onMouseEnter?: () => void;
  button?: never;
}

type LazyButtonProps = LazyButtonWithButton | LazyButtonWithIcon;

export default function LazyButton({
  onMouseEnter,
  button,
  icon,
  ariaLabel,
  children,
}: LazyButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Suspense fallback={<Loader />}>
      {button ? (
        button({ open, setOpen })
      ) : (
        <IconButton
          aria-label={ariaLabel}
          onMouseEnter={onMouseEnter}
          onClick={() => setOpen(true)}
        >
          {icon}
        </IconButton>
      )}
      {open && children({ open, setOpen })}
    </Suspense>
  );
}
