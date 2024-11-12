import Login from './Auth/Login';
import PostForm from './Post/PostForm';

export default function Footer() {
  return (
    <footer className="sticky bottom-0 flex w-full flex-row items-center justify-center gap-4 bg-background pt-2">
      <PostForm />
      <Login />
    </footer>
  );
}
