import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext.tsx';
import { Customer, CustomerType } from '../types.ts';
import { formatCurrency } from '../utils/calculations.ts';
import {
  Search,
  Users2,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Star,
  Package,
  ShoppingBag,
  Clock,
  ArrowRight,
  Plus,
  X,
  FileText,
  DollarSign,
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { customers, orders, quotations, payments, selectedCustomerId, setSelectedCustomerId, setQuickAction } = useCrm();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mobile.includes(searchTerm) ||
      c.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'all' || c.customerType === typeFilter;
    return matchesSearch && matchesType;
  });

  const activeCustomer = customers.find((c) => c.id === selectedCustomerId) || null;

  // Past orders & quotations for active customer
  const customerOrders = orders.filter((o) => o.customerId === selectedCustomerId);
  const customerQuotations = quotations.filter((q) => q.customerId === selectedCustomerId);
  const customerPayments = payments.filter((p) => p.customerId === selectedCustomerId);

  const customerTypes: CustomerType[] = [
    'Retail',
    'Corporate',
    'Wholesale',
    'Reseller',
    'Event',
    'Gift Buyer',
    'Repeat Customer',
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-stone-900">Customer 360° Directory</h2>
          <p className="text-xs text-stone-500">
            {customers.length} registered clients with lifetime transaction history & communication records.
          </p>
        </div>

        <button
          onClick={() => {
            alert('Customers are automatically created when leads confirm orders, or you can register new ones via Quick Lead.');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Customer</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-xl border border-stone-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, company, mobile, GSTIN..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700 focus:bg-white text-stone-800"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none"
        >
          <option value="all">All Customer Types</option>
          {customerTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Grid of Customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => {
          const isRepeat = cust.totalOrders > 1;

          return (
            <div
              key={cust.id}
              className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between cursor-pointer"
              onClick={() => setSelectedCustomerId(cust.id)}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm text-stone-900">{cust.name}</h3>
                    <div className="text-[11px] text-stone-400 font-mono mt-0.5">{cust.customerNumber}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {cust.customerType}
                    </span>
                    {isRepeat && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60">
                        ★ Repeat VIP
                      </span>
                    )}
                  </div>
                </div>

                {cust.company && (
                  <div className="text-xs text-stone-600 font-medium mt-1 truncate">{cust.company}</div>
                )}

                <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="font-mono text-[11px]">{cust.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate text-[11px]">
                      {cust.address.city}, {cust.address.state}
                    </span>
                  </div>
                </div>

                {/* Lifetime Value Metric */}
                <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase font-medium">Orders</div>
                    <div className="font-mono font-bold text-xs text-stone-900 mt-0.5">{cust.totalOrders}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase font-medium">Total Spent</div>
                    <div className="font-mono font-bold text-xs text-stone-900 mt-0.5">
                      {formatCurrency(cust.totalPurchaseValue)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase font-medium">Balance</div>
                    <div
                      className={`font-mono font-bold text-xs mt-0.5 ${
                        cust.outstandingAmount > 0 ? 'text-rose-600' : 'text-stone-400'
                      }`}
                    >
                      {formatCurrency(cust.outstandingAmount)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between text-xs text-amber-800 font-medium">
                <span>View 360° Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer 360° Drawer / Modal */}
      {activeCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-bold text-stone-900">{activeCustomer.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-medium">
                    {activeCustomer.customerType}
                  </span>
                </div>
                <div className="text-xs text-stone-500 font-mono mt-0.5">
                  ID: {activeCustomer.customerNumber} · First Ordered: {activeCustomer.firstOrderDate || 'Recent'}
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Financial Highlights */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200 text-center">
              <div>
                <div className="text-[11px] text-stone-500 font-medium">Customer Lifetime Value</div>
                <div className="font-mono text-base font-bold text-stone-900 mt-1">
                  {formatCurrency(activeCustomer.lifetimeValue || activeCustomer.totalPurchaseValue)}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-stone-500 font-medium">Completed Orders</div>
                <div className="font-mono text-base font-bold text-stone-900 mt-1">{activeCustomer.totalOrders}</div>
              </div>
              <div>
                <div className="text-[11px] text-stone-500 font-medium">Outstanding Balance</div>
                <div
                  className={`font-mono text-base font-bold mt-1 ${
                    activeCustomer.outstandingAmount > 0 ? 'text-rose-600' : 'text-emerald-700'
                  }`}
                >
                  {formatCurrency(activeCustomer.outstandingAmount)}
                </div>
              </div>
            </div>

            {/* Customer Details Card */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">Contact & Tax Information</h4>
              <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-lg border border-stone-200">
                <div>
                  <span className="text-stone-400">Mobile / WhatsApp:</span>
                  <div className="font-mono font-medium text-stone-800 mt-0.5">{activeCustomer.mobile}</div>
                </div>
                <div>
                  <span className="text-stone-400">Email:</span>
                  <div className="text-stone-800 mt-0.5">{activeCustomer.email || '—'}</div>
                </div>
                <div>
                  <span className="text-stone-400">Company & GSTIN:</span>
                  <div className="text-stone-800 mt-0.5">
                    {activeCustomer.company || 'Individual'} {activeCustomer.gstin ? `(${activeCustomer.gstin})` : ''}
                  </div>
                </div>
                <div>
                  <span className="text-stone-400">Delivery Address:</span>
                  <div className="text-stone-800 mt-0.5">
                    {activeCustomer.address.street}, {activeCustomer.address.city}, {activeCustomer.address.state} -{' '}
                    {activeCustomer.address.pincode}
                  </div>
                </div>
              </div>
            </div>

            {/* Past Orders History */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">Orders History</h4>
              {customerOrders.length === 0 ? (
                <div className="p-3 bg-stone-50 rounded-lg text-stone-500 text-center">No orders linked yet.</div>
              ) : (
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-lg overflow-hidden">
                  {customerOrders.map((ord) => (
                    <div key={ord.id} className="p-3 bg-white flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-stone-900">{ord.orderNumber}</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {ord.orderDate} · {ord.orderType} · Due: {ord.requiredDeliveryDate}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-stone-900">{formatCurrency(ord.totalValue)}</div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-900 font-medium">
                          {ord.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Quotations */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">Past Quotations</h4>
              {customerQuotations.length === 0 ? (
                <div className="p-3 bg-stone-50 rounded-lg text-stone-500 text-center">No quotations generated yet.</div>
              ) : (
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-lg overflow-hidden">
                  {customerQuotations.map((qt) => (
                    <div key={qt.id} className="p-3 bg-white flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-stone-900">{qt.quotationNumber}</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          Date: {qt.quotationDate} · Valid till: {qt.validUntil}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-stone-900">{formatCurrency(qt.grandTotal)}</div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                          {qt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
