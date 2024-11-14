import LoginSignup from './Auth/LoginSignup';
import PostForm from './Post/PostForm';

export default function Footer() {
  return (
    <div className="flex w-full flex-row items-center justify-center gap-4 bg-background pt-2">
      <PostForm />
      <LoginSignup />
    </div>
  );
}
