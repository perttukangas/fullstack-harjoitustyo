import { CirclePlus, CirclePower, User } from 'lucide-react';
import { lazy } from 'react';

import LazyButton from '@cc/components/LazyButton';
import { useSession } from '@cc/hooks/use-session';
import { lazyPrefetch } from '@cc/lib/lazy-prefetch';

const LoginSignup = lazyPrefetch(() => import('./Auth/LoginSignup'));
const Logout = lazyPrefetch(() => import('./Auth/Logout'));
const Create = lazyPrefetch(() => import('./Post/Create'));

const ThemeButton = lazy(() => import('./ThemeButton'));

export default function Footer() {
  const { user } = useSession();

  return (
    <div className="flex w-full flex-row items-center justify-center gap-4 bg-background pt-2">
      {user ? (
        <LazyButton
          icon={<CirclePower />}
          ariaLabel="logout"
          onMouseEnter={() => {
            void Logout.prefetch();
          }}
        >
          {(openState) => <Logout {...openState} />}
        </LazyButton>
      ) : (
        <LazyButton
          icon={<User />}
          ariaLabel="login or signup"
          onMouseEnter={() => {
            void LoginSignup.prefetch();
          }}
        >
          {(openState) => <LoginSignup {...openState} />}
        </LazyButton>
      )}
      {user && (
        <LazyButton
          icon={<CirclePlus />}
          ariaLabel="create post"
          onMouseEnter={() => {
            void Create.prefetch();
          }}
        >
          {(openState) => <Create {...openState} />}
        </LazyButton>
      )}
      <ThemeButton />
    </div>
  );
}
