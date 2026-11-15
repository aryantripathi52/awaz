'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, Database, MessageSquare, Volume2, Save, RotateCcw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { soundbox } from '@/lib/soundbox';
import { translations, Language } from '@/lib/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
  language?: Language;
}

export function SettingsModal({ isOpen, onClose, onResetData, language = 'hindi' }: SettingsModalProps) {
  const [geminiKey, setGeminiKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const t = translations[language].settingsModal;
  const voiceLang = language === 'english' ? 'en-IN' : 'hi-IN';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setGeminiKey(localStorage.getItem('bahikhaata_gemini_key') || '');
      setGroqKey(localStorage.getItem('bahikhaata_groq_key') || '');
      setSupabaseUrl(localStorage.getItem('bahikhaata_supabase_url') || '');
      setSupabaseAnonKey(localStorage.getItem('bahikhaata_supabase_anon_key') || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bahikhaata_gemini_key', geminiKey.trim());
      localStorage.setItem('bahikhaata_groq_key', groqKey.trim());
      localStorage.setItem('bahikhaata_supabase_url', supabaseUrl.trim());
      localStorage.setItem('bahikhaata_supabase_anon_key', supabaseAnonKey.trim());
    }
    setSavedSuccess(true);
    soundbox.speak(t.saveSuccess, voiceLang);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleTestSoundbox = () => {
    soundbox.speak(t.testSpeech, voiceLang);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              {t.title}
            </h2>
            <p className="text-xs text-slate-400">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Notice of Built-in Offline Fallback */}
        <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 mb-5 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-300/90 leading-relaxed">
            <strong>{t.offlineBadge}</strong> {t.offlineDesc}
          </p>
        </div>

        <div className="space-y-4">
          {/* Groq Whisper API Key */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
              <span>{t.groqLabel}</span>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:underline"
              >
                {t.groqLink}
              </a>
            </label>
            <input
              type="password"
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          {/* Google Gemini API Key */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
              <span>{t.geminiLabel}</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:underline"
              >
                {t.geminiLink}
              </a>
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          {/* Supabase URL */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.supabaseUrlLabel}</span>
            </label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
            />
          </div>

          {/* Supabase Anon Key */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              {t.supabaseAnonLabel}
            </label>
            <input
              type="password"
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
              placeholder="eyJhbGciOi..."
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
            />
          </div>

          {/* Soundbox Test */}
          <div className="pt-2">
            <button
              onClick={handleTestSoundbox}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-bold text-emerald-400 flex items-center justify-center gap-2 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>{t.soundboxTestBtn}</span>
            </button>
          </div>

          {/* Reset Demo Data */}
          <div>
            <button
              onClick={() => {
                if (confirm(t.resetConfirm)) {
                  onResetData();
                  soundbox.speak(language === 'english' ? 'Ledger data reset.' : 'डेमो डेटा रीसेट हो गया है।', voiceLang);
                  onClose();
                }
              }}
              className="w-full py-2 px-3 rounded-xl bg-rose-950/30 hover:bg-rose-950/50 border border-rose-800/40 text-xs font-semibold text-rose-300 flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetBtn}</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={savedSuccess}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.saveSuccess}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{t.saveBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
