export type Language = 'en' | 'hi' | 'as' | 'mn' | 'mzo';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  shortLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', shortLabel: 'EN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', shortLabel: 'HI' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', shortLabel: 'AS' },
  { code: 'mn', name: 'Meiteilon (Manipuri)', nativeName: 'ꯃꯅꯤꯄꯨꯔꯤ', shortLabel: 'MN' },
  { code: 'mzo', name: 'Mizo', nativeName: 'Mizo ṭawng', shortLabel: 'MZO' }
];

export const DEFAULT_LANGUAGE: Language = 'en';
