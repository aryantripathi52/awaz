'use client';

import React from 'react';
import { CashSale } from '@/types/ledger';
import { Coffee, Cookie, Cigarette, Milk, ShoppingBag, Trash2, Smartphone, Banknote } from 'lucide-react';
import { translations, Language } from '@/lib/translations';

interface CashKamaiTabProps {
  sales: CashSale[];
  onDeleteSale: (id: string) => void;
  language: Language;
  sunlightMode: boolean;
}

export function CashKamaiTab({
  sales,
  onDeleteSale,
  language,
  sunlightMode,
}: CashKamaiTabProps) {
  const t = translations[language].tabs;
  const getCategoryIcon = (category: CashSale['category']) => {
    switch (category) {
      case 'chai':
        return <Coffee className="w-4 h-4 text-amber-400" />;
      case 'snacks':
        return <Cookie className="w-4 h-4 text-orange-400" />;
      case 'cigarettes':
        return <Cigarette className="w-4 h-4 text-red-400" />;
      case 'beverages':
        return <Milk className="w-4 h-4 text-blue-400" />;
      case 'grocery':
        return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
      default:
        return <Banknote className="w-4 h-4 text-teal-400" />;
    }
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const totalAmount = sales.reduce((acc, s) => acc + s.amount, 0);

  return (
    <div className="space-y-3 pb-32">
      {/* Tab Header with quick summary */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
            <span>{t.cashTitle}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
              {sales.length} {t.cashEntriesCount}
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            {t.cashSubtitle}
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            {t.totalCashLabel}
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400">
            ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* List */}
      {sales.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400">
          <Coffee className="w-10 h-10 mx-auto mb-2 text-slate-600 animate-bounce" />
          <p className="text-sm font-bold text-slate-300">
            {t.cashEmptyTitle}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {t.cashEmptyInstruction}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sales.map((sale) => (
            <div
              key={sale.id}
              className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                sunlightMode
                  ? 'bg-black border-slate-700 hover:border-emerald-400'
                  : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800/80 shadow-sm'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                  {getCategoryIcon(sale.category)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-100 truncate">
                      {sale.description}
                    </span>
                    {sale.quantity && sale.quantity > 1 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400 font-bold border border-slate-700">
                        x{sale.quantity}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>{formatTime(sale.timestamp)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      {sale.paymentMode === 'upi' ? (
                        <>
                          <Smartphone className="w-3 h-3 text-cyan-400" />
                          <span className="text-cyan-400 font-semibold">UPI</span>
                        </>
                      ) : (
                        <>
                          <Banknote className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Cash</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Price & Actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <span className="text-base sm:text-lg font-black text-emerald-400 tracking-tight">
                    +₹{sale.amount}
                  </span>
                </div>

                <button
                  onClick={() => onDeleteSale(sale.id)}
                  title="Delete Entry"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
