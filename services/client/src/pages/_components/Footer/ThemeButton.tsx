import { Moon, Sun } from 'lucide-react';

import { IconButton } from '@cc/components/Button';
import { useTheme } from '@cc/hooks/use-theme';

export default function ThemeButton() {
  const { setTheme, isDark } = useTheme();
  return (
    <>
      {isDark ? (
        <IconButton
          onClick={() => setTheme('light')}
          aria-label="switch light theme"
        >
          <Sun />
        </IconButton>
      ) : (
        <IconButton
          onClick={() => setTheme('dark')}
          aria-label="switch dark theme"
        >
          <Moon />
        </IconButton>
      )}
    </>
  );
}
