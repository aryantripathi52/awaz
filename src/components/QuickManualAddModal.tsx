'use client';

import React, { useState } from 'react';
import { X, PlusCircle, Check } from 'lucide-react';
import { CashSale, CreditEntry } from '@/types/ledger';
import { soundbox } from '@/lib/soundbox';

interface QuickManualAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCashSale: (sale: CashSale) => void;
  onAddCreditEntry: (entry: CreditEntry) => void;
  language: 'hinglish' | 'hindi' | 'english';
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      alert('कृपया सही राशि दर्ज करें');
      return;
    }

    const now = new Date().toISOString();

    if (entryType === 'cash') {
      const newSale: CashSale = {
        id: `cs-${Date.now()}`,
        amount: numAmount,
        description: description.trim() || 'नकद बिक्री',
        category: category,
        paymentMode: 'cash',
        timestamp: now,
      };
      onAddCashSale(newSale);
      soundbox.speak(`₹${numAmount} नकद प्राप्त हुए।`, 'hi-IN');
    } else {
      if (!customerName.trim()) {
        alert('कृपया ग्राहक का नाम लिखें');
        return;
      }
      const newCredit: CreditEntry = {
        id: `cr-${Date.now()}`,
        customerName: customerName.trim(),
        customerIdentifier: customerIdentifier.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
        amount: numAmount,
        description: description.trim() || 'उधार',
        status: 'pending',
        timestamp: now,
      };
      onAddCreditEntry(newCredit);
      soundbox.speak(`${customerName} का ₹${numAmount} उधार दर्ज हुआ।`, 'hi-IN');
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
          <span>{language === 'hindi' ? 'हाथ से नया हिसाब जोड़ें' : 'Quick Manual Entry'}</span>
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
            {language === 'hindi' ? '💵 नकद बिक्री (Cash)' : '💵 Cash Sale'}
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
            {language === 'hindi' ? '📝 उधार खाता (Udhaar)' : '📝 Udhaar Credit'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Amount */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {language === 'hindi' ? 'रुपये (Amount in ₹) *' : 'Amount (₹) *'}
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
                  {language === 'hindi' ? 'ग्राहक का नाम (Customer Name) *' : 'Customer Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="उदा. Ramesh, Sharma Ji"
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    पहचान / पता (Tag)
                  </label>
                  <input
                    type="text"
                    value={customerIdentifier}
                    onChange={(e) => setCustomerIdentifier(e.target.value)}
                    placeholder="उदा. 4th street, Nukkad"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    मोबाइल नंबर (WhatsApp)
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
              विवरण / सामान (Items Description)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="उदा. 2 chai, 1 samosa"
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category for Cash */}
          {entryType === 'cash' && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                कैटेगरी (Category)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CashSale['category'])}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="chai">चाय (Chai / Tea)</option>
                <option value="snacks">नाश्ता (Samosa / Snacks)</option>
                <option value="cigarettes">बीड़ी / सिगरेट (Cigarettes)</option>
                <option value="beverages">पेय पदार्थ (Cold Drinks / Milk)</option>
                <option value="grocery">किराना (Grocery)</option>
                <option value="other">अन्य (Other)</option>
              </select>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>दर्ज करें (Save Entry)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
