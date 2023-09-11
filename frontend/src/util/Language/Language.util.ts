import {
  Language,
  LanguageList,
  LanguageType,
} from "@/assets/constant/LanguageList";
import { Pages } from "@/assets/constant/Pages";
import { useTranslation } from "react-i18next";

export const LanguageHelper = (ns: Pages) => {
  const { i18n, t } = useTranslation(ns);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const getCurrentLanguage = (): LanguageType => {
    switch (i18n.language) {
      case "en":
        return Language.en;
      case "vi":
        return Language.vi;
      default:
        return Language.vi;
    }
  };

  const getListLanguage = LanguageList;

  const getTranslate = (key: string) => {
    return t(key);
  };

  return {
    changeLanguage,
    getCurrentLanguage,
    getTranslate,
    getListLanguage,
  };
};
