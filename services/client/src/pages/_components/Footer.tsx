import { useSession } from '@cc/hooks/use-session';

import AuthLoader from './Auth/AuthLoader';
import PostFormLoader from './Post/PostFormLoader';

export default function Footer() {
  const { user } = useSession();

  return (
    <div className="flex w-full flex-row items-center justify-center gap-4 bg-background pt-2">
      {user && <PostFormLoader />}
      <AuthLoader />
    </div>
  );
}
