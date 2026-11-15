'use client';

import React, { useState } from 'react';
import { CreditEntry } from '@/types/ledger';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { CheckCircle2, Clock, MapPin, Send, Trash2, Search, Check, RefreshCw } from 'lucide-react';
import { soundbox } from '@/lib/soundbox';
import { translations, Language } from '@/lib/translations';

interface UdhaarBookTabProps {
  creditEntries: CreditEntry[];
  onSettleCredit: (id: string) => void;
  onDeleteCredit: (id: string) => void;
  language: Language;
  sunlightMode: boolean;
}

export function UdhaarBookTab({
  creditEntries,
  onSettleCredit,
  onDeleteCredit,
  language,
  sunlightMode,
}: UdhaarBookTabProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'settled'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const t = translations[language].tabs;

  const filtered = creditEntries.filter((entry) => {
    if (filter !== 'all' && entry.status !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = entry.customerName.toLowerCase().includes(q);
      const matchIdentifier = entry.customerIdentifier?.toLowerCase().includes(q);
      const matchDesc = entry.description.toLowerCase().includes(q);
      return matchName || matchIdentifier || matchDesc;
    }
    return true;
  });

  const totalPending = creditEntries
    .filter((e) => e.status === 'pending')
    .reduce((acc, e) => acc + e.amount, 0);

  const handleSettle = (entry: CreditEntry) => {
    onSettleCredit(entry.id);
    const speech =
      language === 'english'
        ? `Settled ₹${entry.amount} credit payment from ${entry.customerName}.`
        : `${entry.customerName} से ₹${entry.amount} उधार जमा हो गया।`;
    soundbox.speak(speech, language === 'english' ? 'en-IN' : 'hi-IN');
  };

  const handleSendReminder = (entry: CreditEntry) => {
    let phone = entry.phoneNumber;
    if (!phone) {
      const input = prompt(
        `${entry.customerName}: ${t.phonePrompt}`,
        ''
      );
      if (input !== null && input.trim()) {
        phone = input.trim();
      }
    }
    const storeName = language === 'english' ? 'BahiKhaata Store' : 'बहीखाता चाय & जनरल स्टोर';
    const link = generateWhatsAppLink(
      entry.customerName,
      entry.amount,
      phone,
      storeName
    );
    window.open(link, '_blank');
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-3 pb-32">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
            <span>{t.udhaarTitle}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 font-bold border border-amber-600/30">
              ₹{totalPending} {t.udhaarPendingCount}
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            {t.udhaarSubtitle}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              filter === 'pending'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.filterPending}
          </button>
          <button
            onClick={() => setFilter('settled')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              filter === 'settled'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.filterSettled}
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.filterAll}
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Credit Cards */}
      {filtered.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400">
          <Clock className="w-10 h-10 mx-auto mb-2 text-slate-600 animate-pulse" />
          <p className="text-sm font-bold text-slate-300">
            {t.udhaarEmptyTitle}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {t.udhaarEmptyInstruction}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((entry) => {
            const isPending = entry.status === 'pending';

            return (
              <div
                key={entry.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                  sunlightMode
                    ? isPending
                      ? 'bg-black border-amber-400 text-amber-100'
                      : 'bg-black border-slate-800 text-slate-400'
                    : isPending
                    ? 'bg-slate-900/90 hover:bg-slate-850 border-amber-500/30 hover:border-amber-500/60 shadow-md shadow-amber-950/20'
                    : 'bg-slate-900/40 border-slate-800/60 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Customer Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-base sm:text-lg text-slate-100">
                        {entry.customerName}
                      </span>
                      {entry.customerIdentifier && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          {entry.customerIdentifier}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isPending
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isPending ? t.statusPending : t.statusSettled}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 font-medium">
                      {entry.description}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1.5">
                      <span>{formatDate(entry.timestamp)}</span>
                      {entry.settledAt && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400">
                            {t.settledAtPrefix} {formatDate(entry.settledAt)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount */}
                  <div className="text-right flex-shrink-0">
                    <span
                      className={`text-xl sm:text-2xl font-black tracking-tight ${
                        isPending ? 'text-amber-400' : 'text-slate-400 line-through'
                      }`}
                    >
                      ₹{entry.amount}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Bar for Pending Entries */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    {/* Settle / Jama Button */}
                    {isPending ? (
                      <button
                        onClick={() => handleSettle(entry)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition-transform active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        {t.settleBtn}
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t.settledFull}
                      </span>
                    )}

                    {/* WhatsApp Reminder Button (Taqaza) */}
                    {isPending && (
                      <button
                        onClick={() => handleSendReminder(entry)}
                        title="Send WhatsApp Reminder"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold text-xs border border-emerald-500/40 transition-transform active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t.reminderBtn}</span>
                      </button>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => onDeleteCredit(entry.id)}
                    title="Delete Entry"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
