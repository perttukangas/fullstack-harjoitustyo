import { CirclePower, User } from 'lucide-react';
import { Suspense, lazy, useState } from 'react';

import { Button } from '@c/core/components/Button';
import Loader from '@c/core/components/Loader';
import { useSession } from '@c/core/hooks/use-session';

const LoginSignup = lazy(() => import('./LoginSignup'));
const Logout = lazy(() => import('./Logout'));

export default function LoginSignupLoader() {
  const [open, setOpen] = useState(false);
  const { user } = useSession();

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="ghost" size="icon">
        {user ? <CirclePower /> : <User />}
      </Button>
      {open && (
        <Suspense fallback={<Loader />}>
          {user ? (
            <Logout open={open} setOpen={setOpen} />
          ) : (
            <LoginSignup open={open} setOpen={setOpen} />
          )}
        </Suspense>
      )}
    </>
  );
}
