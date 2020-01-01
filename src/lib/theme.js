const localStorageKey = "theme";
export const THEME = Object.freeze({ DEFAULT: "DEFAULT", DARK: "DARK" });

export function fetchSavedTheme() {
  return localStorage.getItem(localStorageKey) || undefined;
}

export function applyDarkTheme(enabled) {
  const body = document.body;
  body.classList.add("no-transition");

  if (enabled) {
    localStorage.setItem(localStorageKey, THEME.DARK);
    body.classList.remove("theme--default");
    body.classList.add("theme--dark");
  } else {
    localStorage.setItem(localStorageKey, THEME.DEFAULT);
    body.classList.remove("theme--dark");
    body.classList.add("theme--default");
  }

  body.offsetHeight; // Trigger a reflow, flushing the CSS changes
  body.classList.remove("no-transition");
}

export function applySavedTheme() {
  applyDarkTheme(fetchSavedTheme() === THEME.DARK);
}
