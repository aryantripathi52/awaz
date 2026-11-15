'use client';

import React, { useState } from 'react';
import { X, PlusCircle, Check } from 'lucide-react';
import { CashSale, CreditEntry } from '@/types/ledger';
import { soundbox } from '@/lib/soundbox';
import { translations, Language } from '@/lib/translations';

interface QuickManualAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCashSale: (sale: CashSale) => void;
  onAddCreditEntry: (entry: CreditEntry) => void;
  language: Language;
}

export function QuickManualAddModal({
  isOpen,
  onClose,
  onAddCashSale,
  onAddCreditEntry,
  language,
}: QuickManualAddModalProps) {
  const [entryType, setEntryType] = useState<'cash' | 'udhaar'>('cash');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerIdentifier, setCustomerIdentifier] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [category, setCategory] = useState<CashSale['category']>('chai');

  const t = translations[language].manualAddModal;
  const voiceLang = language === 'english' ? 'en-IN' : 'hi-IN';

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      alert(t.amountAlert);
      return;
    }

    const now = new Date().toISOString();

    if (entryType === 'cash') {
      const defaultDesc = language === 'english' ? 'Cash sale' : 'नकद बिक्री';
      const newSale: CashSale = {
        id: `cs-${Date.now()}`,
        amount: numAmount,
        description: description.trim() || defaultDesc,
        category: category,
        paymentMode: 'cash',
        timestamp: now,
      };
      onAddCashSale(newSale);
      const msg = language === 'english' ? `Received ₹${numAmount} in cash.` : `₹${numAmount} नकद प्राप्त हुए।`;
      soundbox.speak(msg, voiceLang);
    } else {
      if (!customerName.trim()) {
        alert(t.customerNameAlert);
        return;
      }
      const defaultDesc = language === 'english' ? 'Credit recorded' : 'उधार';
      const newCredit: CreditEntry = {
        id: `cr-${Date.now()}`,
        customerName: customerName.trim(),
        customerIdentifier: customerIdentifier.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
        amount: numAmount,
        description: description.trim() || defaultDesc,
        status: 'pending',
        timestamp: now,
      };
      onAddCreditEntry(newCredit);
      const msg =
        language === 'english'
          ? `Recorded ₹${numAmount} credit for ${customerName}.`
          : `${customerName} का ₹${numAmount} उधार दर्ज हुआ।`;
      soundbox.speak(msg, voiceLang);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-black text-white tracking-tight mb-4 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-emerald-400" />
          <span>{t.title}</span>
        </h2>

        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-800 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setEntryType('cash')}
            className={`py-2 text-xs font-black rounded-xl transition-all ${
              entryType === 'cash'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.typeCash}
          </button>
          <button
            type="button"
            onClick={() => setEntryType('udhaar')}
            className={`py-2 text-xs font-black rounded-xl transition-all ${
              entryType === 'udhaar'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.typeCredit}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Amount */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {t.amountLabel}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">
                ₹
              </span>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-lg font-black text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Conditional Udhaar Fields */}
          {entryType === 'udhaar' && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {t.customerNameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={t.customerNamePlaceholder}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {t.tagLabel}
                  </label>
                  <input
                    type="text"
                    value={customerIdentifier}
                    onChange={(e) => setCustomerIdentifier(e.target.value)}
                    placeholder={t.tagPlaceholder}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {t.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="10 digit number"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Item Description */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {t.descriptionLabel}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descriptionPlaceholder}
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category for Cash */}
          {entryType === 'cash' && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {t.categoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CashSale['category'])}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="chai">{t.categories.chai}</option>
                <option value="snacks">{t.categories.snacks}</option>
                <option value="cigarettes">{t.categories.cigarettes}</option>
                <option value="beverages">{t.categories.beverages}</option>
                <option value="grocery">{t.categories.grocery}</option>
                <option value="other">{t.categories.other}</option>
              </select>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{t.submitBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
