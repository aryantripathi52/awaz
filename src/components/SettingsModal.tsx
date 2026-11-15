'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  User,
  Store,
  Mail,
  ShieldCheck,
  Volume2,
  RotateCcw,
  LogOut,
  Save,
  CheckCircle2,
  LogIn,
  Receipt,
  BookOpen,
} from 'lucide-react';
import { soundbox } from '@/lib/soundbox';
import { translations, Language } from '@/lib/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
  language?: Language;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentUser?: any;
  onLogout?: () => void;
  salesCount?: number;
  creditsCount?: number;
}

export function SettingsModal({
  isOpen,
  onClose,
  onResetData,
  language = 'hindi',
  currentUser,
  onLogout,
  salesCount = 0,
  creditsCount = 0,
}: SettingsModalProps) {
  const router = useRouter();
  const t = translations[language].settingsModal;
  const voiceLang = language === 'english' ? 'en-IN' : 'hi-IN';

  const [shopName, setShopName] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      const demoRaw = localStorage.getItem('bahikhaata_demo_user');
      if (demoRaw) {
        try {
          const parsed = JSON.parse(demoRaw);
          setShopName(parsed.shopName || '');
        } catch {
          // ignore
        }
      } else if (currentUser?.user_metadata?.shop_name) {
        setShopName(currentUser.user_metadata.shop_name);
      }
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const displayName =
    currentUser?.user_metadata?.full_name ||
    currentUser?.fullName ||
    currentUser?.email?.split('@')[0] ||
    (language === 'english'
      ? 'Guest Merchant'
      : language === 'hinglish'
      ? 'Guest Dukandaar'
      : 'अतिथि दुकानदार');

  const displayEmail =
    currentUser?.email ||
    (language === 'english'
      ? 'Local Device Session'
      : language === 'hinglish'
      ? 'Local Device Account'
      : 'स्थानीय डिवाइस खाता');

  const isGuest =
    !currentUser ||
    currentUser.id?.startsWith('guest-') ||
    currentUser.email === 'guest@bahikhaata.app';

  const handleSaveShopName = () => {
    if (typeof window !== 'undefined') {
      const demoRaw = localStorage.getItem('bahikhaata_demo_user');
      if (demoRaw) {
        try {
          const parsed = JSON.parse(demoRaw);
          parsed.shopName = shopName.trim();
          localStorage.setItem('bahikhaata_demo_user', JSON.stringify(parsed));
        } catch {
          // ignore
        }
      } else {
        localStorage.setItem(
          'bahikhaata_demo_user',
          JSON.stringify({
            id: 'guest-' + Date.now(),
            fullName: displayName,
            email: currentUser?.email || 'guest@bahikhaata.app',
            shopName: shopName.trim(),
          })
        );
      }
    }

    setSavedSuccess(true);
    soundbox.speak(t.saveSuccess, voiceLang);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 1500);
  };

  const handleTestSoundbox = () => {
    soundbox.speak(t.testSpeech, voiceLang);
  };

  const handleReset = () => {
    if (window.confirm(t.resetConfirm)) {
      onResetData();
      soundbox.speak(
        language === 'english'
          ? 'Ledger data reset.'
          : language === 'hinglish'
          ? 'Saara data reset ho gaya.'
          : 'सारा डेटा हटा दिया गया है।',
        voiceLang
      );
      onClose();
    }
  };

  const handleLogoutAction = () => {
    onClose();
    if (onLogout) {
      onLogout();
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('bahikhaata_demo_user');
      }
      soundbox.speak(t.logoutSuccess, voiceLang);
      router.push('/login');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-xl flex-shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {t.title}
            </h2>
            <p className="text-xs text-slate-400">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t.profileInfo}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isGuest
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {isGuest ? t.guestBadge : t.cloudBadge}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-200">
            <User className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-bold text-white truncate">{displayName}</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span className="truncate">{displayEmail}</span>
          </div>

          {/* Shop Name Input */}
          <div className="pt-2 border-t border-slate-800">
            <label className="text-[11px] font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.shopNameLabel}</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder={t.shopNamePlaceholder}
                className="flex-1 px-3 py-2 bg-slate-850 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSaveShopName}
                className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-transform active:scale-95 shadow-md shadow-emerald-500/20"
                title={t.saveBtn}
              >
                {savedSuccess ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{savedSuccess ? '✓' : t.saveBtn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Ledger Statistics Snapshot */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-2xl flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">
                {language === 'english' ? 'Cash Sales' : 'नकद पर्ची'}
              </p>
              <p className="text-sm font-black text-white">{salesCount}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-2xl flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">
                {language === 'english' ? 'Credit Accounts' : 'उधारी खाते'}
              </p>
              <p className="text-sm font-black text-white">{creditsCount}</p>
            </div>
          </div>
        </div>

        {/* Zero-Config Offline Guarantee */}
        <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 mb-4 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-emerald-300/90 leading-relaxed">
            <strong>{t.offlineBadge}</strong> {t.offlineDesc}
          </p>
        </div>

        {/* Audio Utilities */}
        <div className="space-y-2 mb-5">
          <button
            onClick={handleTestSoundbox}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>{t.soundboxTestBtn}</span>
          </button>

          <button
            onClick={handleReset}
            className="w-full py-2 px-3 rounded-xl bg-slate-950/60 hover:bg-rose-950/30 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>{t.resetBtn}</span>
          </button>
        </div>

        {/* Account Actions: Logout or Sign In */}
        <div className="space-y-2 pt-3 border-t border-slate-800">
          <button
            onClick={handleLogoutAction}
            className="w-full py-3 px-4 rounded-2xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 border border-rose-500/40 text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-md"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>{t.logoutBtn}</span>
          </button>

          {isGuest && (
            <Link
              href="/login"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t.loginBtn}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
