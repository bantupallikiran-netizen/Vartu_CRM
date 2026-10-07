import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext.tsx';
import { UserRole } from '../types.ts';
import { Settings, Shield, Check, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, currentRole, setCurrentRole } = useCrm();

  const [form, setForm] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <h2 className="text-base font-bold text-stone-900">Vartu Creations Studio & Business Settings</h2>
        <p className="text-xs text-stone-500">
          Configure artisan brand identity, GST taxation rates, bank payment coordinates, and RBAC user permissions.
        </p>
      </div>

      {/* Role Permission Preview */}
      <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-800" />
            <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
              Active Role Simulation (RBAC)
            </span>
          </div>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            className="p-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 cursor-pointer"
          >
            <option value="Owner/Admin">Owner/Admin (Full Unrestricted Access)</option>
            <option value="Sales/Order Manager">Sales/Order Manager (Leads, Quotes, Orders)</option>
            <option value="Production">Production Artisan (Work in Progress & QC)</option>
            <option value="Accounts">Accounts (Payments, Ledger & Invoices)</option>
            <option value="Viewer">Viewer (Read-Only Consultation)</option>
          </select>
        </div>

        <p className="text-stone-600">
          Current active session role: <strong>{currentRole}</strong>. The application enforces permissions dynamically.
        </p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Brand Information */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-sm text-stone-900">Studio & Brand Profile</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-600 mb-1 font-medium">Business Name</label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-stone-600 mb-1 font-medium">Tagline / Brand Subtitle</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-600 mb-1 font-medium">WhatsApp Number</label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-stone-600 mb-1 font-medium">Instagram Handle</label>
              <input
                type="text"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-medium"
              />
            </div>
            <div>
              <label className="block text-stone-600 mb-1 font-medium">Website URL</label>
              <input
                type="text"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-2">
              <label className="block text-stone-600 mb-1 font-medium">Studio Physical Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-stone-600 mb-1 font-medium">City & State</label>
              <input
                type="text"
                value={`${form.city}, ${form.state}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setForm({ ...form, city: parts[0]?.trim() || '', state: parts[1]?.trim() || '' });
                }}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-stone-600 mb-1 font-medium">GSTIN</label>
              <input
                type="text"
                value={form.gstin}
                onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>

        {/* Bank & Tax Rates */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-sm text-stone-900">Banking & Taxation Coordinates</h3>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-stone-600 mb-1 font-medium">Bank Name</label>
              <input
                type="text"
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-stone-600 mb-1 font-medium">Account Number</label>
              <input
                type="text"
                value={form.bankAccount}
                onChange={(e) => setForm({ ...form, bankAccount: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-stone-600 mb-1 font-medium">IFSC Code</label>
              <input
                type="text"
                value={form.bankIfsc}
                onChange={(e) => setForm({ ...form, bankIfsc: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-stone-600 mb-1 font-medium">UPI ID</label>
              <input
                type="text"
                value={form.bankUpi}
                onChange={(e) => setForm({ ...form, bankUpi: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono text-amber-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-stone-600 mb-1 font-medium">Default GST Rate (%)</label>
              <input
                type="number"
                value={form.defaultGstRate}
                onChange={(e) => setForm({ ...form, defaultGstRate: Number(e.target.value) })}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-stone-600 mb-1 font-medium">Default Advance Required (%)</label>
              <input
                type="number"
                value={form.defaultAdvancePercent}
                onChange={(e) => setForm({ ...form, defaultAdvancePercent: Number(e.target.value) })}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-stone-600 mb-1 font-medium">Order Prefix</label>
              <input
                type="text"
                value={form.orderPrefix}
                onChange={(e) => setForm({ ...form, orderPrefix: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {savedSuccess ? (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Settings updated successfully!
            </span>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Company Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
