'use client';

import React from 'react';
import { IndianRupee, TrendingUp, AlertCircle, Wallet } from 'lucide-react';

interface MetricCardsProps {
  totalCash: number;
  todayUdhaar: number;
  totalMarketUdhaar: number;
  recoveredUdhaarToday: number;
  language: 'hinglish' | 'hindi' | 'english';
  sunlightMode: boolean;
  onSelectTab: (tab: 'cash' | 'udhaar') => void;
}

export function MetricCards({
  totalCash,
  todayUdhaar,
  totalMarketUdhaar,
  recoveredUdhaarToday,
  language,
  sunlightMode,
  onSelectTab,
}: MetricCardsProps) {
  const gallaInHand = totalCash + recoveredUdhaarToday;

  const labels = {
    hinglish: {
      cash: 'Aaj Ki Kamai',
      todayUdhaar: 'Aaj Ka Udhaar',
      marketUdhaar: 'Kul Market Udhaar',
      galla: 'Galla (Cash In Hand)',
      recovered: 'Wapas Aaya',
    },
    hindi: {
      cash: 'आज की नकद कमाई',
      todayUdhaar: 'आज का नया उधार',
      marketUdhaar: 'कुल बाज़ार उधारी',
      galla: 'गल्ला (नकद हाथ में)',
      recovered: 'उधार वसूली',
    },
    english: {
      cash: "Today's Cash",
      todayUdhaar: "Today's Credit",
      marketUdhaar: 'Total Market Credit',
      galla: 'Cash in Drawer',
      recovered: 'Credit Recovered',
    },
  };

  const l = labels[language];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 w-full">
      {/* 1. Cash Kamai */}
      <div
        onClick={() => onSelectTab('cash')}
        className={`cursor-pointer group p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${
          sunlightMode
            ? 'bg-black border-emerald-400 text-emerald-300'
            : 'bg-slate-900/90 hover:bg-slate-850 border-emerald-500/30 hover:border-emerald-500/60 shadow-lg shadow-emerald-950/30'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {l.cash}
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-sm font-bold text-emerald-400">₹</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            {totalCash.toLocaleString('en-IN')}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          नकद + ऑनलाइन बिक्री
        </p>
      </div>

      {/* 2. Today's Udhaar */}
      <div
        onClick={() => onSelectTab('udhaar')}
        className={`cursor-pointer group p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${
          sunlightMode
            ? 'bg-black border-amber-400 text-amber-300'
            : 'bg-slate-900/90 hover:bg-slate-850 border-amber-500/30 hover:border-amber-500/60 shadow-lg shadow-amber-950/30'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {l.todayUdhaar}
          </span>
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-sm font-bold text-amber-400">₹</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
            {todayUdhaar.toLocaleString('en-IN')}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          आज दिया गया उधार
        </p>
      </div>

      {/* 3. Total Market Outstanding Udhaar */}
      <div
        onClick={() => onSelectTab('udhaar')}
        className={`cursor-pointer group p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${
          sunlightMode
            ? 'bg-black border-rose-500 text-rose-300'
            : 'bg-slate-900/90 hover:bg-slate-850 border-rose-500/30 hover:border-rose-500/60 shadow-lg shadow-rose-950/30'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {l.marketUdhaar}
          </span>
          <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <IndianRupee className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-sm font-bold text-rose-400">₹</span>
          <span className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight">
            {totalMarketUdhaar.toLocaleString('en-IN')}
          </span>
        </div>
        <p className="text-[11px] text-rose-400/80 mt-1">
          बाज़ार से लेना बाकी है
        </p>
      </div>

      {/* 4. Cash Galla in Hand */}
      <div
        className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 ${
          sunlightMode
            ? 'bg-black border-cyan-400 text-cyan-300'
            : 'bg-slate-900/90 border-cyan-500/30 shadow-lg shadow-cyan-950/30'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {l.galla}
          </span>
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-sm font-bold text-cyan-400">₹</span>
          <span className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight">
            {gallaInHand.toLocaleString('en-IN')}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {l.recovered}: ₹{recoveredUdhaarToday}
        </p>
      </div>
    </div>
  );
}
