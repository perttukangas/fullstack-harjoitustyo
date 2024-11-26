import { Moon, Sun } from 'lucide-react';

import { Button } from '@cc/components/Button';
import { useSession } from '@cc/hooks/use-session';
import { useTheme } from '@cc/hooks/use-theme';

import AuthLoader from './Auth/AuthLoader';
import PostFormLoader from './Post/PostFormLoader';

export default function Footer() {
  const { user } = useSession();
  const { setTheme, isDark } = useTheme();

  return (
    <div className="flex w-full flex-row items-center justify-center gap-4 bg-background pt-2">
      <AuthLoader />
      {user && <PostFormLoader />}
      {isDark ? (
        <Button
          onClick={() => setTheme('light')}
          variant="ghost"
          size="icon"
          aria-label="switch-light-theme"
        >
          <Sun />
        </Button>
      ) : (
        <Button
          onClick={() => setTheme('dark')}
          variant="ghost"
          size="icon"
          aria-label="switch-dark-theme"
        >
          <Moon />
        </Button>
      )}
    </div>
  );
}
