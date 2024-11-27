import { Moon, Sun } from 'lucide-react';

import { Button } from '@cc/components/Button';
import { useTheme } from '@cc/hooks/use-theme';

export default function ThemeButton() {
  const { setTheme, isDark } = useTheme();
  return (
    <>
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
    </>
  );
}
