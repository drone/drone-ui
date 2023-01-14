import { useEffect, useCallback, useState } from 'react';

import useLocalStorage from './use-local-storage';

const useTheme = () => {
  const [storedTheme, setStoredTheme] = useLocalStorage('selected_theme', 'system');
  const [selectedTheme, setSelectedTheme] = useState(storedTheme);

  const isSystemThemeDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches === true;

  useEffect(() => {
    if (
      (selectedTheme === 'system' && isSystemThemeDark()) || (selectedTheme === 'dark')
    ) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [selectedTheme]);

  const toggleTheme = useCallback(() => {
    let newTheme = 'system';
    if (selectedTheme === 'system') {
      newTheme = isSystemThemeDark() ? 'light' : 'dark';
    } else {
      newTheme = selectedTheme === 'dark' ? 'light' : 'dark';
    }

    setStoredTheme(newTheme);
    setSelectedTheme(newTheme);
  }, [selectedTheme, setStoredTheme, setSelectedTheme]);

  return { selectedTheme, toggleTheme };
};

export default useTheme;
