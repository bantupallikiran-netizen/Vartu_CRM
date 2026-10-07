import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext.tsx';
import { FolderOpen, FileText, Image, Upload, Download, Search, CheckCircle2 } from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { quotations, invoices, orders } = useCrm();
  const [searchTerm, setSearchTerm] = useState('');

  const docList = [
    ...quotations.map((q) => ({
      id: q.id,
      name: `Quotation_${q.quotationNumber}.pdf`,
      type: 'Quotation PDF',
      linkedTo: q.customerName,
      date: q.quotationDate,
      size: '142 KB',
    })),
    ...invoices.map((inv) => ({
      id: inv.id,
      name: `GST_Invoice_${inv.invoiceNumber}.pdf`,
      type: 'Tax Invoice',
      linkedTo: inv.customerName,
      date: inv.invoiceDate,
      size: '185 KB',
    })),
    {
      id: 'doc-ref-1',
      name: 'Pooja_Reddy_Ocean_Geode_Wave_Reference.jpg',
      type: 'Customer Reference Image',
      linkedTo: 'Pooja Reddy',
      date: '2026-09-29',
      size: '2.4 MB',
    },
    {
      id: 'doc-ref-2',
      name: 'Aditya_Birla_Hamper_Brass_Logo_Coin_Proof_V2.pdf',
      type: 'Design Approval Proof',
      linkedTo: 'Aditya Birla Capital',
      date: '2026-10-06',
      size: '1.1 MB',
    },
    {
      id: 'doc-ref-3',
      name: 'UrbanSprout_Ganesha_Idols_30pcs_Dispatch_Slip.pdf',
      type: 'Delivery & Courier Proof',
      linkedTo: 'UrbanSprout Events',
      date: '2026-10-07',
      size: '310 KB',
    },
  ];

  const filtered = docList.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.linkedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-stone-900">Document Management & Cloud Attachments</h2>
          <p className="text-xs text-stone-500">
            Secure storage for client reference images, artwork approval proofs, quotation PDFs & courier dispatch receipts.
          </p>
        </div>

        <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs transition-colors cursor-pointer">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File / Proof</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) alert(`File "${e.target.files[0].name}" attached to document archive!`);
            }}
          />
        </label>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-xl border border-stone-200">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search document name, customer, proof..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700 text-stone-800"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Document Category</th>
                <th className="py-3 px-4">Linked Customer / Order</th>
                <th className="py-3 px-4">Date Uploaded</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((doc, idx) => (
                <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-700 shrink-0" />
                      <span className="font-semibold text-stone-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-stone-600 font-medium">{doc.type}</td>
                  <td className="py-3 px-4 text-stone-800">{doc.linkedTo}</td>
                  <td className="py-3 px-4 font-mono text-stone-500">{doc.date}</td>
                  <td className="py-3 px-4 font-mono text-stone-500">{doc.size}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => alert(`Downloading ${doc.name}...`)}
                      className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                      title="Download File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
