import en from "./en";
import fr from "./fr";

/**
 * messages for all supported locales.
 */
export const messages = { en, fr };

/**
 * resolve returns the locale based on user preference, as
 * defined by the browser apis. If the browser language
 * preferences do not match any supported language, engish
 * is used as the fallback language.
 *
 * @param {object} window
 * @return {string} locale
 */
export const resolve = window => {
  let languages = [];
  if (navigator.languages != undefined) {
    languages = navigator.languages;
  } else if (navigator.language) {
    languages = [navigator.language];
  }
  return (
    languages.find(function(language) {
      return ["en"].find(supported => supported === language);
    }) || "en"
  );
};
