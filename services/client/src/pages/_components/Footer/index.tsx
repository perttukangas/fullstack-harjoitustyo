import { useLocation } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { CirclePlus, CirclePower, Home, User } from 'lucide-react';
import { lazy } from 'react';

import type { UnparsedSessionSchema } from '@shared/zod/user';

import { IconButton } from '@cc/components/Button';
import LazyButton from '@cc/components/LazyButton';
import { useSession } from '@cc/hooks/use-session';
import { lazyPrefetch } from '@cc/lib/lazy-prefetch';

const LoginSignup = lazyPrefetch(() => import('../Auth/LoginSignup'));
const Create = lazyPrefetch(() => import('../Post/Create'));
const Logout = lazyPrefetch(() => import('../Auth/Logout'));

const ThemeButton = lazy(() => import('./ThemeButton'));

const logout = () => (
  <LazyButton
    icon={<CirclePower />}
    ariaLabel="logout"
    onMouseEnter={() => {
      void Logout.prefetch();
    }}
  >
    {(openState) => <Logout {...openState} />}
  </LazyButton>
);

const loginSignup = () => (
  <LazyButton
    icon={<User />}
    ariaLabel="login or signup"
    onMouseEnter={() => {
      void LoginSignup.prefetch();
    }}
  >
    {(openState) => <LoginSignup {...openState} />}
  </LazyButton>
);

const profile = () => (
  <Link to={'/profile'}>
    <IconButton aria-label={'profile'}>
      <User />
    </IconButton>
  </Link>
);

const createPost = () => (
  <LazyButton
    icon={<CirclePlus />}
    ariaLabel="create post"
    onMouseEnter={() => {
      void Create.prefetch();
    }}
  >
    {(openState) => <Create {...openState} />}
  </LazyButton>
);

const home = () => (
  <Link to={'/'}>
    <IconButton aria-label={'home'}>
      <Home />
    </IconButton>
  </Link>
);

const homeLayout = (user: UnparsedSessionSchema | undefined) => {
  if (user) {
    return (
      <>
        <div>
          {profile()}
          {logout()}
        </div>
        {createPost()}
        <ThemeButton />
      </>
    );
  }

  return (
    <>
      {loginSignup()}
      <ThemeButton />
    </>
  );
};

const profileLayout = () => {
  return (
    <>
      {home()}
      {logout()}
      <ThemeButton />
    </>
  );
};

const fallbackLayout = () => {
  return <>{home()}</>;
};

export default function Index() {
  const { user } = useSession();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isProfile = location.pathname === '/profile';

  return (
    <div className="flex w-full flex-row items-center justify-center gap-4 bg-background pt-2">
      {isHome
        ? homeLayout(user)
        : isProfile
          ? profileLayout()
          : fallbackLayout()}
    </div>
  );
}
