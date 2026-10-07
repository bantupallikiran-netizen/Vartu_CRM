import React from 'react';
import { useCrm } from '../context/CrmContext.tsx';
import { calculateGrossMarginPercent, calculateProductCost, formatCurrency } from '../utils/calculations.ts';
import { BarChart3, TrendingUp, Users, DollarSign, PieChart, ShoppingBag, ArrowUpRight } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { orders, leads, quotations, customers, products } = useCrm();

  const totalSales = orders.reduce((acc, o) => acc + (o.totalValue || 0), 0);
  const totalOrdersCount = orders.length;
  const aov = totalOrdersCount > 0 ? Math.round(totalSales / totalOrdersCount) : 0;

  const repeatCount = customers.filter((c) => c.totalOrders > 1).length;
  const repeatRate = customers.length > 0 ? Math.round((repeatCount / customers.length) * 100) : 0;

  const acceptedQuotations = quotations.filter((q) => q.status === 'Accepted').length;
  const quotationConversionRate =
    quotations.length > 0 ? Math.round((acceptedQuotations / quotations.length) * 100) : 0;

  const confirmedLeads = leads.filter((l) => l.status === 'Order Confirmed').length;
  const leadConversionRate = leads.length > 0 ? Math.round((confirmedLeads / leads.length) * 100) : 0;

  // Source breakdown
  const sourceStats: Record<string, { leads: number; orders: number; revenue: number }> = {};
  leads.forEach((l) => {
    if (!sourceStats[l.leadSource]) sourceStats[l.leadSource] = { leads: 0, orders: 0, revenue: 0 };
    sourceStats[l.leadSource].leads += 1;
    if (l.status === 'Order Confirmed') {
      sourceStats[l.leadSource].orders += 1;
      sourceStats[l.leadSource].revenue += l.expectedBudget || 1000;
    }
  });

  // Category breakdown
  const categoryStats: Record<string, number> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      const cat = prod?.category || 'Custom Handcrafted';
      categoryStats[cat] = (categoryStats[cat] || 0) + item.total;
    });
  });

  // Top products by margin
  const sortedProductsByMargin = [...products]
    .map((p) => {
      const cost = calculateProductCost(p.costing);
      const margin = calculateGrossMarginPercent(p.sellingPrice, cost);
      return { ...p, cost, margin };
    })
    .sort((a, b) => b.margin - a.margin);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <h2 className="text-base font-bold text-stone-900">Executive Sales & Business Analytics</h2>
        <p className="text-xs text-stone-500">
          Analyze sales channels, profit margins, conversion funnels & customer lifetime value to steer Vartu's growth.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium">Average Order Value (AOV)</span>
          <div className="font-mono font-bold text-lg text-stone-900 mt-1">{formatCurrency(aov)}</div>
          <div className="text-[10px] text-stone-400 mt-0.5">Across {totalOrdersCount} completed orders</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium">Repeat Purchase Rate</span>
          <div className="font-mono font-bold text-lg text-emerald-700 mt-1">{repeatRate}%</div>
          <div className="text-[10px] text-stone-400 mt-0.5">{repeatCount} repeat customers</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium">Quotation Win Rate</span>
          <div className="font-mono font-bold text-lg text-amber-900 mt-1">{quotationConversionRate}%</div>
          <div className="text-[10px] text-stone-400 mt-0.5">{acceptedQuotations} / {quotations.length} accepted</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium">Lead-to-Order Conversion</span>
          <div className="font-mono font-bold text-lg text-stone-900 mt-1">{leadConversionRate}%</div>
          <div className="text-[10px] text-stone-400 mt-0.5">{confirmedLeads} confirmed deals</div>
        </div>
      </div>

      {/* Channel Source Performance Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div>
            <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider">
              Marketing Channel ROI & Attribution
            </h3>
            <p className="text-[11px] text-stone-500">
              Evaluates which inbound channel generates the highest conversion and revenue.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Acquisition Channel</th>
                <th className="py-2.5 px-3 text-center">Total Inquiries</th>
                <th className="py-2.5 px-3 text-center">Confirmed Deals</th>
                <th className="py-2.5 px-3 text-center">Conversion %</th>
                <th className="py-2.5 px-3 text-right">Attributed Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {Object.entries(sourceStats).map(([source, stats]) => {
                const conv = stats.leads > 0 ? Math.round((stats.orders / stats.leads) * 100) : 0;

                return (
                  <tr key={source} className="hover:bg-stone-50/80">
                    <td className="py-2.5 px-3 font-semibold text-stone-900">{source}</td>
                    <td className="py-2.5 px-3 text-center font-mono">{stats.leads}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-semibold text-stone-900">
                      {stats.orders}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-amber-900 font-bold">{conv}%</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">
                      {formatCurrency(stats.revenue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Columns: Category Share & High Margin Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Revenue Distribution */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-3">
          <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider">
            Revenue Share by Craft Category
          </h3>
          <div className="space-y-2.5 mt-2">
            {Object.entries(categoryStats).map(([cat, rev]) => {
              const pct = totalSales > 0 ? Math.round((rev / totalSales) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-stone-800">{cat}</span>
                    <span className="font-mono font-bold text-stone-900">
                      {formatCurrency(rev)} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-700 rounded-full"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Highest Margin Products Ranking */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-3">
          <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider">
            Top Profitable Products (Gross Margin %)
          </h3>
          <div className="divide-y divide-stone-100">
            {sortedProductsByMargin.slice(0, 5).map((p) => (
              <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-stone-900 line-clamp-1">{p.name}</div>
                  <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                    Price: {formatCurrency(p.sellingPrice)} · Cost: {formatCurrency(p.cost)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-700 text-sm">{p.margin}%</div>
                  <div className="text-[10px] text-stone-400">Gross Margin</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
