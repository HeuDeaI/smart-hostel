import React, { createContext, useContext } from "react";
import i18n from "./i18n";

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
};

export const useTranslation = () => {
  const i18n = useContext(I18nContext);
  return {
    t: (key) => i18n.t(key),
    locale: i18n.locale,
    setLocale: (locale) => {
      i18n.locale = locale;
    },
  };
};
