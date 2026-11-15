'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { MetricCards } from '@/components/MetricCards';
import { CashKamaiTab } from '@/components/CashKamaiTab';
import { UdhaarBookTab } from '@/components/UdhaarBookTab';
import { VoiceActionHub } from '@/components/VoiceActionHub';
import { ClosingSummaryModal } from '@/components/ClosingSummaryModal';
import { SettingsModal } from '@/components/SettingsModal';
import { QuickManualAddModal } from '@/components/QuickManualAddModal';
import {
  getLocalCashSales,
  saveLocalCashSales,
  getLocalCreditEntries,
  saveLocalCreditEntries,
  supabase,
  isSupabaseConfigured,
  syncCashSaleToDb,
  syncCreditEntryToDb,
} from '@/lib/supabase';
import { getCurrentUser, signOut } from '@/lib/auth';
import { CashSale, CreditEntry, VoiceProcessResult } from '@/types/ledger';
import { Plus, Coffee, BookOpen, LogOut, User as UserIcon } from 'lucide-react';
import { soundbox } from '@/lib/soundbox';
import { translations, Language } from '@/lib/translations';

export default function DashboardPage() {
  const router = useRouter();
  const [sales, setSales] = useState<CashSale[]>([]);
  const [credits, setCredits] = useState<CreditEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'cash' | 'udhaar'>('cash');
  const [language, setLanguage] = useState<Language>('hinglish');
  const [sunlightMode, setSunlightMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [todayStr, setTodayStr] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Modals
  const [isClosingOpen, setIsClosingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isManualAddOpen, setIsManualAddOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    setSales(getLocalCashSales());
    setCredits(getLocalCreditEntries());
    setIsMuted(soundbox.getMuted());
    setTodayStr(new Date().toISOString().split('T')[0]);

    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('bahikhaata_language') as Language | null;
      if (savedLang) setLanguage(savedLang);
    }

    // Check user profile
    getCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    });

    // Listen for cross-tab storage sync events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bahikhaata_cash_sales' || e.key === 'bahikhaata_credit_ledger') {
        setSales(getLocalCashSales());
        setCredits(getLocalCreditEntries());
      } else if (e.key === 'bahikhaata_language') {
        const newLang = e.newValue as Language;
        if (newLang === 'hindi' || newLang === 'hinglish' || newLang === 'english') {
          setLanguage(newLang);
        }
      }
    };

    // Listen for in-app language switch events
    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<Language>;
      if (customEvent.detail) {
        setLanguage(customEvent.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bahikhaata_language_changed', handleLangChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bahikhaata_language_changed', handleLangChange);
    };
  }, []);

  // Supabase Real-Time Listener if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel('realtime:bahikhaata')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sales_ledger' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const raw = payload.new;
            const newSale: CashSale = {
              id: raw.id,
              amount: Number(raw.amount),
              description: raw.description,
              quantity: raw.quantity,
              unit: raw.unit,
              category: raw.category || 'other',
              paymentMode: raw.payment_mode || 'cash',
              timestamp: raw.created_at,
            };
            setSales((prev) => {
              if (prev.some((s) => s.id === newSale.id)) return prev;
              const next = [newSale, ...prev];
              saveLocalCashSales(next);
              return next;
            });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'credit_ledger' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const raw = payload.new;
            const newCredit: CreditEntry = {
              id: raw.id,
              customerName: raw.customer_name,
              customerIdentifier: raw.customer_identifier,
              phoneNumber: raw.phone_number,
              amount: Number(raw.amount),
              description: raw.description,
              status: raw.status || 'pending',
              timestamp: raw.created_at,
              settledAt: raw.settled_at,
            };
            setCredits((prev) => {
              if (prev.some((c) => c.id === newCredit.id)) return prev;
              const next = [newCredit, ...prev];
              saveLocalCreditEntries(next);
              return next;
            });
          }
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // Handle voice recognition result with batched updates and deduplication
  const handleVoiceProcessed = useCallback((result: VoiceProcessResult) => {
    const now = new Date().toISOString();
    const newSalesToAdd: CashSale[] = [];
    const newCreditsToAdd: CreditEntry[] = [];
    const paymentsToApply: { customerName: string; amount: number }[] = [];

    for (const action of result.actions) {
      if (action.type === 'cash_sale') {
        newSalesToAdd.push({
          id: `cs-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          amount: action.amount,
          description: action.description || 'नकद बिक्री',
          quantity: action.quantity || 1,
          unit: action.unit,
          category: action.category || 'chai',
          paymentMode: action.paymentMode || 'cash',
          timestamp: now,
        });
      } else if (action.type === 'udhaar') {
        newCreditsToAdd.push({
          id: `cr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          customerName: action.customerName || 'Grahak',
          customerIdentifier: action.customerIdentifier,
          amount: action.amount,
          description: action.description || 'उधार',
          status: 'pending',
          timestamp: now,
        });
      } else if (action.type === 'udhaar_payment') {
        paymentsToApply.push({
          customerName: action.customerName || '',
          amount: action.amount,
        });
      }
    }

    if (newSalesToAdd.length > 0) {
      setSales((prev) => {
        const existingIds = new Set(prev.map((s) => s.id));
        const uniqueToAdd = newSalesToAdd.filter((s) => !existingIds.has(s.id));
        if (uniqueToAdd.length === 0) return prev;
        const next = [...uniqueToAdd, ...prev];
        saveLocalCashSales(next);
        return next;
      });
      newSalesToAdd.forEach((s) => syncCashSaleToDb(s));
      setActiveTab('cash');
    }

    if (newCreditsToAdd.length > 0) {
      setCredits((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const uniqueToAdd = newCreditsToAdd.filter((c) => !existingIds.has(c.id));
        if (uniqueToAdd.length === 0) return prev;
        const next = [...uniqueToAdd, ...prev];
        saveLocalCreditEntries(next);
        return next;
      });
      newCreditsToAdd.forEach((c) => syncCreditEntryToDb(c));
      setActiveTab('udhaar');
    }

    if (paymentsToApply.length > 0) {
      setCredits((prev) => {
        let changed = false;
        let updated = [...prev];

        for (const payment of paymentsToApply) {
          const targetName = payment.customerName.toLowerCase().trim();
          let settledOne = false;

          updated = updated.map((entry) => {
            if (
              !settledOne &&
              entry.status === 'pending' &&
              (entry.customerName.toLowerCase().includes(targetName) ||
                targetName.includes(entry.customerName.toLowerCase()))
            ) {
              settledOne = true;
              changed = true;
              return {
                ...entry,
                status: 'settled' as const,
                settledAt: now,
              };
            }
            return entry;
          });
        }

        if (changed) {
          saveLocalCreditEntries(updated);
        }
        return updated;
      });
      setActiveTab('udhaar');
    }
  }, []);

  // Manual actions
  const handleAddCashSale = (newSale: CashSale) => {
    setSales((prev) => {
      const updated = [newSale, ...prev];
      saveLocalCashSales(updated);
      return updated;
    });
    syncCashSaleToDb(newSale);
    setActiveTab('cash');
  };

  const handleAddCreditEntry = (newCredit: CreditEntry) => {
    setCredits((prev) => {
      const updated = [newCredit, ...prev];
      saveLocalCreditEntries(updated);
      return updated;
    });
    syncCreditEntryToDb(newCredit);
    setActiveTab('udhaar');
  };

  const handleDeleteCashSale = (id: string) => {
    setSales((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveLocalCashSales(updated);
      return updated;
    });
  };

  const handleDeleteCreditEntry = (id: string) => {
    setCredits((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveLocalCreditEntries(updated);
      return updated;
    });
  };

  const handleSettleCreditEntry = (id: string) => {
    const now = new Date().toISOString();
    setCredits((prev) => {
      const updated = prev.map((c) =>
        c.id === id ? { ...c, status: 'settled' as const, settledAt: now } : c
      );
      saveLocalCreditEntries(updated);
      return updated;
    });
  };

  const handleResetData = () => {
    localStorage.removeItem('bahikhaata_cash_sales');
    localStorage.removeItem('bahikhaata_credit_ledger');
    setSales(getLocalCashSales());
    setCredits(getLocalCreditEntries());
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentUser(null);
    soundbox.speak('लॉगआउट हो गया है।', 'hi-IN');
    router.push('/login');
  };

  // Metrics
  const totalCashToday = sales
    .filter((s) => !todayStr || s.timestamp.startsWith(todayStr))
    .reduce((sum, s) => sum + s.amount, 0);

  const todayUdhaar = credits
    .filter((c) => !todayStr || c.timestamp.startsWith(todayStr))
    .reduce((sum, c) => sum + c.amount, 0);

  const totalMarketUdhaar = credits
    .filter((c) => c.status === 'pending')
    .reduce((sum, c) => sum + c.amount, 0);

  const recoveredToday = credits
    .filter((c) => c.status === 'settled' && (!todayStr || (c.settledAt && c.settledAt.startsWith(todayStr))))
    .reduce((sum, c) => sum + c.amount, 0);

  const t = translations[language];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 flex flex-col ${
        sunlightMode
          ? 'bg-black text-white selection:bg-emerald-400 selection:text-black'
          : 'bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950'
      }`}
    >
      {/* Top Header */}
      <Header
        language={language}
        setLanguage={setLanguage}
        sunlightMode={sunlightMode}
        setSunlightMode={setSunlightMode}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenClosing={() => setIsClosingOpen(true)}
      />

      {/* User Status Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-1.5 text-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">
              {currentUser
                ? `${currentUser.user_metadata?.full_name || currentUser.fullName || currentUser.email} (${currentUser.user_metadata?.shop_name || currentUser.shopName || (language === 'english' ? 'Shop' : 'दुकान')})`
                : t.nav.guestModeText}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-emerald-400 transition-colors">
              {t.nav.home}
            </Link>
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors"
                title={t.nav.logout}
              >
                <LogOut className="w-3 h-3" />
                <span>{t.nav.logout}</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                <UserIcon className="w-3 h-3" />
                <span>{t.nav.login}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 pt-4 sm:pt-6 space-y-4 sm:space-y-6">
        {/* Metric Summary Cards */}
        <MetricCards
          totalCash={totalCashToday}
          todayUdhaar={todayUdhaar}
          totalMarketUdhaar={totalMarketUdhaar}
          recoveredUdhaarToday={recoveredToday}
          language={language}
          sunlightMode={sunlightMode}
          onSelectTab={(tab) => setActiveTab(tab)}
        />

        {/* Tab Selector & Quick Add Button */}
        <div className="flex items-center justify-between gap-2 pt-2">
          {/* 2 Primary Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 flex-1 max-w-xs">
            <button
              onClick={() => setActiveTab('cash')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all ${
                activeTab === 'cash'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>{t.tabs.cashTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('udhaar')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all ${
                activeTab === 'udhaar'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{t.tabs.udhaarTab}</span>
            </button>
          </div>

          {/* Quick Manual Entry Button */}
          <button
            onClick={() => setIsManualAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all shadow-sm active:scale-95"
            title={t.tabs.quickAdd}
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span className="hidden xs:inline">
              {t.tabs.quickAdd}
            </span>
          </button>
        </div>

        {/* Active Tab View */}
        <div>
          {activeTab === 'cash' ? (
            <CashKamaiTab
              sales={sales}
              onDeleteSale={handleDeleteCashSale}
              language={language}
              sunlightMode={sunlightMode}
            />
          ) : (
            <UdhaarBookTab
              creditEntries={credits}
              onSettleCredit={handleSettleCreditEntry}
              onDeleteCredit={handleDeleteCreditEntry}
              language={language}
              sunlightMode={sunlightMode}
            />
          )}
        </div>
      </main>

      {/* Permanent Giant Voice Action Hub */}
      <VoiceActionHub
        onVoiceProcessed={handleVoiceProcessed}
        language={language}
        sunlightMode={sunlightMode}
      />

      {/* Modals */}
      <ClosingSummaryModal
        isOpen={isClosingOpen}
        onClose={() => setIsClosingOpen(false)}
        sales={sales}
        credits={credits}
        language={language}
        todayStr={todayStr}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetData={handleResetData}
        language={language}
      />

      <QuickManualAddModal
        isOpen={isManualAddOpen}
        onClose={() => setIsManualAddOpen(false)}
        onAddCashSale={handleAddCashSale}
        onAddCreditEntry={handleAddCreditEntry}
        language={language}
      />
    </div>
  );
}
