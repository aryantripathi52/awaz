'use client';

import React, { useEffect } from 'react';
import { CashSale, CreditEntry } from '@/types/ledger';
import { X, Sparkles, Share2, Copy, Volume2, CheckCircle2, TrendingUp, AlertCircle, Wallet } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundbox } from '@/lib/soundbox';

interface ClosingSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sales: CashSale[];
  credits: CreditEntry[];
  language: 'hinglish' | 'hindi' | 'english';
  todayStr: string;
}

export function ClosingSummaryModal({
  isOpen,
  onClose,
  sales,
  credits,
  language,
  todayStr,
}: ClosingSummaryModalProps) {
  const [formattedDate, setFormattedDate] = React.useState('');

  useEffect(() => {
    setFormattedDate(
      new Date().toLocaleDateString([], {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );
  }, [isOpen]);

  const todaySales = sales.filter((s) => s.timestamp.startsWith(todayStr));
  const totalCashSales = todaySales.reduce((sum, s) => sum + s.amount, 0);

  const todayCreditsGiven = credits.filter((c) => c.timestamp.startsWith(todayStr));
  const totalUdhaarGivenToday = todayCreditsGiven.reduce((sum, c) => sum + c.amount, 0);

  const todayCreditsSettled = credits.filter(
    (c) => c.status === 'settled' && c.settledAt && c.settledAt.startsWith(todayStr)
  );
  const totalUdhaarRecoveredToday = todayCreditsSettled.reduce((sum, c) => sum + c.amount, 0);

  const netCashInHand = totalCashSales + totalUdhaarRecoveredToday;

  const totalMarketPending = credits
    .filter((c) => c.status === 'pending')
    .reduce((sum, c) => sum + c.amount, 0);

  // Top pending debtors
  const pendingMap: Record<string, { amount: number; identifier?: string }> = {};
  for (const c of credits.filter((c) => c.status === 'pending')) {
    if (!pendingMap[c.customerName]) {
      pendingMap[c.customerName] = { amount: 0, identifier: c.customerIdentifier };
    }
    pendingMap[c.customerName].amount += c.amount;
  }
  const topDebtors = Object.entries(pendingMap)
    .sort((a, b) => b[1].amount - a[1].amount)
    .slice(0, 4);

  // Trigger confetti and audio speech on open
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#F59E0B', '#06B6D4'],
        });
      } catch {}

      const speech = `दुकान बंद हिसाब। आज की कुल नकद कमाई ₹${totalCashSales} हुई। ₹${totalUdhaarGivenToday} का उधार दिया गया और ₹${totalUdhaarRecoveredToday} की वसूली हुई। गल्ले में ₹${netCashInHand} होने चाहिए।`;
      soundbox.speak(speech, 'hi-IN');
    }
  }, [isOpen, totalCashSales, totalUdhaarGivenToday, totalUdhaarRecoveredToday, netCashInHand]);

  if (!isOpen) return null;

  const generateReportText = () => {
    const d = new Date().toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return `📊 *दुकान बंद हिसाब (${d})*
-----------------------------
💵 *आज की नकद कमाई:* ₹${totalCashSales}
📝 *आज का नया उधार:* ₹${totalUdhaarGivenToday}
🔄 *उधार वसूली (जमा):* ₹${totalUdhaarRecoveredToday}
💰 *गल्ला (नकद हाथ में):* ₹${netCashInHand}
⚠️ *कुल बाज़ार बाकी उधार:* ₹${totalMarketPending}
-----------------------------
_बहीखाता आवाज़ द्वारा जनरेट किया गया_`;
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(generateReportText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportText());
    alert('Closing report copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-6 h-6 animate-spin duration-3000" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {language === 'hindi' ? 'दुकान बंद • आज का हिसाब' : 'Day Closing Summary'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {formattedDate || 'आज का दिन'}
          </p>
        </div>

        {/* Grand Total Cash in Hand Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/40 text-center mb-4 shadow-lg shadow-emerald-950/40">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
            {language === 'hindi' ? 'गल्ले में कुल नकद होना चाहिए' : 'Net Cash In Drawer (Galla)'}
          </span>
          <div className="text-3xl sm:text-4xl font-black text-white flex items-center justify-center gap-1">
            <span className="text-emerald-400 text-2xl">₹</span>
            <span>{netCashInHand.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            (नकद बिक्री ₹{totalCashSales} + वसूली ₹{totalUdhaarRecoveredToday})
          </p>
        </div>

        {/* 4 Key Stat Tiles */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>नकद बिक्री</span>
            </div>
            <span className="text-xl font-black text-slate-100">
              ₹{totalCashSales.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {todaySales.length} ट्रांजैक्शन
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>आज का उधार</span>
            </div>
            <span className="text-xl font-black text-slate-100">
              ₹{totalUdhaarGivenToday.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {todayCreditsGiven.length} ग्राहकों को
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>उधार वसूली</span>
            </div>
            <span className="text-xl font-black text-slate-100">
              ₹{totalUdhaarRecoveredToday.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {todayCreditsSettled.length} जमा हुए
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold mb-1">
              <Wallet className="w-3.5 h-3.5" />
              <span>कुल बाकी उधारी</span>
            </div>
            <span className="text-xl font-black text-rose-400">
              ₹{totalMarketPending.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              मार्केट में फंसा हुआ
            </span>
          </div>
        </div>

        {/* Top Debtors List */}
        {topDebtors.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              ⚠️ सबसे बड़े बकायेदार (Top Pending Accounts):
            </h3>
            <div className="space-y-1.5">
              {topDebtors.map(([name, data]) => (
                <div
                  key={name}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/40 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{name}</span>
                    {data.identifier && (
                      <span className="text-[10px] text-cyan-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        {data.identifier}
                      </span>
                    )}
                  </div>
                  <span className="font-black text-amber-400">₹{data.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp पर रिपोर्ट भेजें</span>
          </button>

          <button
            onClick={handleCopy}
            title="Copy Report"
            className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              const speech = `आज की कुल नकद कमाई ₹${totalCashSales}। गल्ले में ₹${netCashInHand} होने चाहिए।`;
              soundbox.speak(speech, 'hi-IN');
            }}
            title="Replay Voice Summary"
            className="p-3 rounded-xl bg-slate-800 text-emerald-400 hover:bg-slate-700 border border-slate-700"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
