import { api } from '@/services/api';

export type AdminLanguage = {
  code: string;
  name: string;
  nativeName: string;
  isIndic: boolean;
  script: string | null;
};

export type LanguagesResponse = { languages: AdminLanguage[]; source: string };

export const listLanguages = () => api<LanguagesResponse>('/api/admin/languages');
