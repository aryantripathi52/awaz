'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '@/lib/auth';
import {
  Sparkles,
  ArrowRight,
  Store,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  Shield,
  AlertCircle,
  Languages,
} from 'lucide-react';
import { soundbox } from '@/lib/soundbox';
import { translations, Language } from '@/lib/translations';

export default function LoginPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>('hinglish');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('bahikhaata_language') as Language | null;
      if (savedLang) setLanguage(savedLang);
    }
  }, []);

  const cycleLanguage = () => {
    const nextLang: Language =
      language === 'hinglish' ? 'hindi' : language === 'hindi' ? 'english' : 'hinglish';
    setLanguage(nextLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bahikhaata_language', nextLang);
      window.dispatchEvent(new CustomEvent('bahikhaata_language_changed', { detail: nextLang }));
    }
  };

  const t = translations[language];
  const tLogin = t.login;
  const voiceLang = language === 'english' ? 'en-IN' : 'hi-IN';

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMsg(error.message);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google login error';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (mode === 'signup') {
        const { error } = await signUpWithEmail(email, password, shopName);
        if (error) {
          setErrorMsg(error.message);
        } else {
          const successText =
            language === 'english'
              ? 'Account created! Redirecting to dashboard...'
              : language === 'hinglish'
              ? 'Account ban gaya! Dashboard khul raha hai...'
              : 'खाता बन गया! आप सीधे डैशबोर्ड पर जा रहे हैं...';
          setSuccessMsg(successText);
          soundbox.speak(
            language === 'english'
              ? 'Account created successfully.'
              : 'खाता सफलतापूर्वक बन गया है।',
            voiceLang
          );
          setTimeout(() => router.push('/dashboard'), 1000);
        }
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMsg(error.message);
        } else {
          const loginText =
            language === 'english'
              ? 'Login successful! Opening dashboard...'
              : language === 'hinglish'
              ? 'Login safal raha! Dashboard khul raha hai...'
              : 'लॉगिन सफल रहा! डैशबोर्ड खुल रहा है...';
          setSuccessMsg(loginText);
          soundbox.speak(
            language === 'english' ? 'Login successful.' : 'लॉगिन सफल रहा।',
            voiceLang
          );
          setTimeout(() => router.push('/dashboard'), 800);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'bahikhaata_demo_user',
        JSON.stringify({
          id: 'guest-' + Date.now(),
          email: 'guest@bahikhaata.app',
          fullName:
            language === 'english'
              ? 'Guest Merchant'
              : language === 'hinglish'
              ? 'Guest Dukandaar'
              : 'अतिथि दुकानदार',
          shopName:
            language === 'english'
              ? 'My Tea & Kirana Store'
              : 'मेरी चाय & किराना दुकान',
        })
      );
    }
    soundbox.speak(
      language === 'english'
        ? 'Opening ledger in guest mode.'
        : 'अतिथि मोड में बहीखाता खुल रहा है।',
      voiceLang
    );
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-8 selection:bg-emerald-500 selection:text-slate-950 relative">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top bar with language switcher */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={cycleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-emerald-500/50 transition-all shadow-md active:scale-95"
        >
          <Languages className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            {language === 'hindi' ? 'हिन्दी' : language === 'hinglish' ? 'Hinglish' : 'English'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">⇄</span>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-2xl group-hover:scale-105 transition-transform">
              खा
            </div>
            <div className="text-left">
              <span className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                {t.common.appName}
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  {t.common.badge}
                </span>
              </span>
              <p className="text-xs text-slate-400 font-medium">{t.common.tagline}</p>
            </div>
          </Link>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight mt-3">
            {mode === 'signin' ? tLogin.titleSignIn : tLogin.titleSignUp}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'signin' ? tLogin.subSignIn : tLogin.subSignUp}
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/80 rounded-2xl mb-6 border border-slate-800">
            <button
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 text-xs font-black rounded-xl transition-all ${
                mode === 'signin'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tLogin.tabSignIn}
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 text-xs font-black rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tLogin.tabSignUp}
            </button>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google OAuth One-Tap Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-md transition-transform active:scale-[0.98] mb-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{tLogin.googleBtn}</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-800 w-full"></div>
            <span className="bg-slate-900 px-3 text-[11px] font-bold text-slate-500 uppercase">
              {tLogin.orEmail}
            </span>
            <div className="border-t border-slate-800 w-full"></div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {tLogin.shopNameLabel}
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder={tLogin.shopNamePlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {tLogin.emailLabel}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {tLogin.passwordLabel}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? tLogin.btnSignIn : tLogin.btnSignUp}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Guest / Demo Mode Button */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <button
              onClick={handleGuestAccess}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1.5 mx-auto group"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span>{tLogin.guestBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center text-[11px] text-slate-500 mt-5 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>{tLogin.footerText}</span>
        </p>
      </div>
    </div>
  );
}
