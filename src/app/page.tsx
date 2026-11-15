'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Mic,
  Volume2,
  Sparkles,
  ArrowRight,
  Sun,
  MessageSquare,
  ChevronRight,
  Zap,
  Languages,
} from 'lucide-react';
import { parseVoiceIntentLocally } from '@/lib/parser';
import { soundbox } from '@/lib/soundbox';
import { VoiceProcessResult } from '@/types/ledger';
import { translations, Language } from '@/lib/translations';

export default function LandingPage() {
  const [demoResult, setDemoResult] = useState<VoiceProcessResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activePrompt, setActivePrompt] = useState<string>('');
  const [language, setLanguage] = useState<Language>('hindi');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bahikhaata_language') as Language | null;
      if (saved === 'hindi' || saved === 'hinglish' || saved === 'english') {
        setLanguage(saved);
      }
    }
  }, []);

  const cycleLanguage = () => {
    const nextLang: Language =
      language === 'hinglish' ? 'hindi' :
      language === 'hindi' ? 'english' : 'hinglish';
    setLanguage(nextLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bahikhaata_language', nextLang);
      window.dispatchEvent(new CustomEvent('bahikhaata_language_changed', { detail: nextLang }));
    }
    const msg =
      nextLang === 'hindi'
        ? 'भाषा बदली: हिन्दी'
        : nextLang === 'hinglish'
        ? 'Language changed to Hinglish'
        : 'Language changed to English';
    soundbox.speak(msg, nextLang === 'english' ? 'en-IN' : 'hi-IN');
  };

  const t = translations[language].landing;
  const sampleVoicePrompts = translations[language].voiceHub.samplePrompts;

  const handleSimulateVoice = (promptText: string) => {
    setActivePrompt(promptText);
    setIsSimulating(true);
    setDemoResult(null);

    setTimeout(() => {
      const result = parseVoiceIntentLocally(promptText, language);
      setDemoResult(result);
      setIsSimulating(false);
      soundbox.speak(result.soundboxMessage, language === 'english' ? 'en-IN' : 'hi-IN');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      {/* 1. Navigation Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-xl group-hover:scale-105 transition-transform">
              खा
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                BahiKhaata
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  {language === 'english' ? 'Voice' : 'आवाज़'}
                </span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium">
                {language === 'english' ? 'Hands Free, Perfect Books' : 'हाथ खाली, हिसाब पक्का'}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* 1-Tap Language Switch Button */}
            <button
              onClick={cycleLanguage}
              title={`Switch Language (Current: ${language.toUpperCase()})`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 hover:border-emerald-500/50 transition-all active:scale-95 shadow-sm"
            >
              <Languages className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold">
                {language === 'hindi' ? 'हिन्दी' : language === 'hinglish' ? 'Hinglish' : 'English'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">⇄</span>
            </button>

            <Link
              href="/login"
              className="text-xs sm:text-sm font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl transition-colors"
            >
              {t.navLogin}
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <span>{t.navOpen}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative px-4 pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden text-center max-w-5xl mx-auto">
        {/* Glow backdrop */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Micro-Economy Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-emerald-500/30 shadow-inner mb-6 animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-emerald-300 tracking-wide">
            {t.badge}
          </span>
        </div>

        {/* Main Punchy Tagline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
          {t.heroH1Line1} <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            {t.heroH1Gradient}
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          {t.heroDesc}
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-black text-base px-7 py-3.5 rounded-2xl shadow-xl shadow-emerald-500/25 active:scale-95 transition-all"
          >
            <Mic className="w-5 h-5 stroke-[2.5]" />
            <span>{t.ctaDashboard}</span>
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 text-slate-200 font-bold text-base px-6 py-3.5 rounded-2xl border border-slate-700/80 transition-all"
          >
            {/* Google Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>{t.ctaGoogle}</span>
          </Link>
        </div>

        {/* 3. Interactive Live Simulator on Landing Page */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl max-w-2xl mx-auto text-left relative backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              {t.simTitle}
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">{t.simListen}</span>
          </div>

          {/* Prompt Chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {sampleVoicePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSimulateVoice(p)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all text-left ${
                  activePrompt === p
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md'
                    : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 border-slate-700/80 hover:border-emerald-500/50'
                }`}
              >
                &ldquo;{p}&rdquo;
              </button>
            ))}
          </div>

          {/* Interactive Parsing Result Preview */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 min-h-[96px] flex flex-col justify-center">
            {isSimulating ? (
              <div className="flex items-center gap-2 text-xs text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>{t.simAnalyzing}</span>
              </div>
            ) : demoResult ? (
              <div className="space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">{demoResult.soundboxMessage}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {demoResult.actions.map((act, i) => (
                    <div
                      key={i}
                      className={`text-xs px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 ${
                        act.type === 'cash_sale'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : act.type === 'udhaar'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      <span>
                        {act.type === 'cash_sale'
                          ? `💵 ${language === 'english' ? 'Cash' : 'नकद'}: ₹${act.amount} (${act.description})`
                          : act.type === 'udhaar'
                          ? `📝 ${language === 'english' ? 'Credit' : 'उधार'}: ${act.customerName} ₹${act.amount} ${act.customerIdentifier ? `[${act.customerIdentifier}]` : ''}`
                          : `🔄 ${language === 'english' ? 'Settled' : 'जमा'}: ${act.customerName} ₹${act.amount}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center">
                {t.simEmpty}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 4. Why BahiKhaata Voice? (4 Pillars) */}
      <section className="px-4 py-16 bg-slate-900/50 border-t border-b border-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {t.pillarsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              {t.pillarsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pillar 1 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-white mb-1">{t.p1Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.p1Desc}
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-white mb-1">{t.p2Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.p2Desc}
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-white mb-1">{t.p3Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.p3Desc}
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-3">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-white mb-1">{t.p4Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.p4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Traditional Diary vs BahiKhaata Voice */}
      <section className="px-4 py-16 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t.compTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/40">
            <h3 className="font-extrabold text-rose-300 text-base mb-3 flex items-center gap-2">
              <span>{t.diaryTitle}</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              {t.diaryItems.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/40">
            <h3 className="font-extrabold text-emerald-300 text-base mb-3 flex items-center gap-2">
              <span>{t.voiceTitle}</span>
            </h3>
            <ul className="space-y-2 text-xs text-emerald-200/90 font-medium">
              {t.voiceItems.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Bottom Banner CTA */}
      <section className="px-4 py-12 mt-auto bg-gradient-to-t from-slate-900 to-slate-950 border-t border-slate-800 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            {t.footerCtaTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-6">
            {t.footerCtaSubtitle}
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 text-slate-950 font-black text-sm sm:text-base px-8 py-3.5 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-transform"
          >
            <span>{t.footerCtaBtn}</span>
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </Link>
          <p className="text-[11px] text-slate-500 mt-6">
            {t.footerCopyright}
          </p>
        </div>
      </section>
    </div>
  );
}
