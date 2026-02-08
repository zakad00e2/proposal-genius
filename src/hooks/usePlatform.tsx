import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Platform } from "@/components/ProposalForm";
import { Lang, t, TranslationKey } from "@/lib/translations";

interface PlatformContextValue {
  platform: Platform;
  setPlatform: (p: Platform) => void;
  lang: Lang;
  isArabic: boolean;
  dir: 'rtl' | 'ltr';
  t: (key: TranslationKey) => string;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

const STORAGE_KEY = "offerly_platform";

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [platform, setPlatformState] = useState<Platform>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "upwork" || saved === "mostaql") return saved;
    } catch { /* ignore localStorage errors */ }
    return "mostaql";
  });

  const lang: Lang = platform === "mostaql" ? "ar" : "en";
  const isArabic = lang === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  const setPlatform = (p: Platform) => {
    setPlatformState(p);
    try {
      localStorage.setItem(STORAGE_KEY, p);
    } catch { /* ignore localStorage errors */ }
  };

  // Apply global dir and lang attributes
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  const translate = (key: TranslationKey) => t(key, lang);

  return (
    <PlatformContext.Provider value={{ platform, setPlatform, lang, isArabic, dir, t: translate }}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform must be used within PlatformProvider");
  return ctx;
}
