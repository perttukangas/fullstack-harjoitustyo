import { CirclePower, User } from 'lucide-react';
import { Suspense, lazy, useState } from 'react';

import { Button } from '@cc/components/Button';
import Loader from '@cc/components/Loader';
import { useSession } from '@cc/hooks/use-session';

const LoginSignup = lazy(() => import('./LoginSignup'));
const Logout = lazy(() => import('./Logout'));

export default function AuthLoader() {
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
