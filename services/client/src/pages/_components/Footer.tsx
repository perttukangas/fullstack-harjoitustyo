import { useSession } from '@c/core/hooks/use-session';

import LoginSignupLoader from './Auth/LoginSignupLoader';
import PostFormLoader from './Post/PostFormLoader';

export default function Footer() {
  const { user } = useSession();

  return (
    <div className="flex w-full flex-row items-center justify-center gap-4 bg-background pt-2">
      {user && <PostFormLoader />}
      <LoginSignupLoader />
    </div>
  );
}
