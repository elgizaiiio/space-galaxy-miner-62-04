
export interface Language {
  code: string;
  name: string;
  flag: string;
  greeting: string;
}

export interface TranslationMap {
  [key: string]: {
    [languageCode: string]: string;
  };
}
