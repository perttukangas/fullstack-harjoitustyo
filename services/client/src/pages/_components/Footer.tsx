import { useSession } from '@c/core/hooks/use-session';

import LoginSignup from './Auth/LoginSignup';
import PostForm from './Post/PostForm';

export default function Footer() {
  const { user } = useSession();

  return (
    <div className="flex w-full flex-row items-center justify-center gap-4 bg-background pt-2">
      {user && <PostForm />}
      <LoginSignup />
    </div>
  );
}
