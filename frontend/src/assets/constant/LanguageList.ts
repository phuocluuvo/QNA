export const Language = {
  en: { code: "en", name: "English" },
  vi: { code: "vi", name: "Tiếng Việt" },
};

export const LanguageList = (): LanguageType[] => {
  return [Language.en, Language.vi];
};

export type LanguageType = {
  code: string;
  name: string;
};
