'use client';

import React from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Sun, Moon, Sparkles, Languages, User } from 'lucide-react';
import { soundbox } from '@/lib/soundbox';
import { translations, Language } from '@/lib/translations';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  sunlightMode: boolean;
  setSunlightMode: (val: boolean) => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  onOpenSettings: () => void;
  onOpenClosing: () => void;
}

export function Header({
  language,
  setLanguage,
  sunlightMode,
  setSunlightMode,
  isMuted,
  setIsMuted,
  onOpenSettings,
  onOpenClosing,
}: HeaderProps) {
  const toggleSoundbox = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundbox.setMuted(next);
    if (!next) {
      soundbox.speak('साउंडबॉक्स चालू है।', 'hi-IN');
    }
  };

  const cycleLanguage = () => {
    const nextLang: Language =
      language === 'hinglish' ? 'hindi' :
      language === 'hindi' ? 'english' : 'hinglish';
    setLanguage(nextLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bahikhaata_language', nextLang);
      window.dispatchEvent(new CustomEvent('bahikhaata_language_changed', { detail: nextLang }));
    }
    if (!isMuted) {
      const msg =
        nextLang === 'hindi'
          ? 'भाषा बदली: हिन्दी'
          : nextLang === 'hinglish'
          ? 'Language changed to Hinglish'
          : 'Language changed to English';
      soundbox.speak(msg, nextLang === 'english' ? 'en-IN' : 'hi-IN');
    }
  };

  const t = translations[language];

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-slate-900/90 border-b border-slate-800 px-4 py-3 shadow-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-xl tracking-tighter group-hover:scale-105 transition-transform">
            खा
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                {t.common.appName}
                <span className="text-emerald-400 font-extrabold text-xs px-1.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30">
                  {t.common.badge}
                </span>
              </h1>
            </div>
            <p className="text-[11px] font-medium text-slate-400 tracking-wide">
              {t.common.tagline}
            </p>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Soundbox toggle */}
          <button
            onClick={toggleSoundbox}
            title={isMuted ? 'Soundbox Muted' : 'Soundbox Active'}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              !isMuted
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 shadow-sm shadow-emerald-500/10'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {!isMuted ? <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{!isMuted ? t.nav.soundboxOn : t.nav.soundboxMute}</span>
          </button>

          {/* Sunlight Mode Toggle */}
          <button
            onClick={() => setSunlightMode(!sunlightMode)}
            title="Dhoop Mode (High Contrast for bright sunlight)"
            className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
              sunlightMode
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {sunlightMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* 1-Tap Language Switch Button */}
          <button
            onClick={cycleLanguage}
            title={`Language: ${language.toUpperCase()}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-emerald-500/50 transition-all active:scale-95 shadow-sm"
          >
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">
              {language === 'hindi' ? 'हिन्दी' : language === 'hinglish' ? 'Hinglish' : 'English'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">⇄</span>
          </button>

          {/* Dukaan Bandh / Closing Button */}
          <button
            onClick={onOpenClosing}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md shadow-orange-500/20 transition-transform active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{t.nav.closingBtn}</span>
          </button>

          {/* Profile & Logout */}
          <button
            onClick={onOpenSettings}
            title={t.nav.settingsTooltip}
            aria-label="Profile and Logout"
            className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-750 transition-all active:scale-95 shadow-sm"
          >
            <User className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
