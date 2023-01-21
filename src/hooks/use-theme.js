import { useEffect } from 'react';

import { THEMES } from '_constants';

import useLocalStorage from './use-local-storage';

const useTheme = () => {
  const isSystemThemeDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches === true;

  const [storedTheme, setStoredTheme] = useLocalStorage(
    'selected_theme',
    isSystemThemeDark() ? THEMES.DARK : THEMES.LIGHT,
  );

  useEffect(() => {
    if (storedTheme === THEMES.DARK) {
      document.body.classList.add(THEMES.DARK);
    } else {
      document.body.classList.remove(THEMES.DARK);
    }
  }, [storedTheme]);

  const toggleTheme = () => {
    setStoredTheme(storedTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
  };

  return { storedTheme, toggleTheme };
};

export default useTheme;
