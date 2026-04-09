"use client";
import React from 'react';
import Link from 'next/link';
import { Search, Filter, Eye, MoreVertical, CheckCircle2, AlertCircle } from 'lucide-react';

const mockTariffs = [
  { id: 'TAR-1001', name: 'Enterprise Postpaid Master', type: 'Postpaid', price: '$150.00/mo', subs: '1,240', status: 'Active' },
  { id: 'TAR-1002', name: 'Prepaid Daily Global', type: 'Prepaid', price: '$2.00/day', subs: '45,012', status: 'Active' },
  { id: 'TAR-1003', name: 'Family Shared Plan', type: 'Postpaid L2', price: '$80.00/mo', subs: '8,401', status: 'Active' },
  { id: 'TAR-1004', name: 'Corp Flex Hub', type: 'Enterprise', price: 'Custom/Usage', subs: '430', status: 'Active' },
  { id: 'TAR-1005', name: 'Legacy Data Max', type: 'Prepaid', price: '$40.00/mo', subs: '2,105', status: 'Deprecated' },
];

export default function TariffsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tariff Plans</h1>
          <p className="text-slate-500 mt-1">Manage billing matrices and rating engine logic rules.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Tariff ID..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 shadow-sm transition-all">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Tariff ID</th>
                <th className="px-6 py-4">Plan Name</th>
                <th className="px-6 py-4">Plan Type</th>
                <th className="px-6 py-4 text-right">Base Price</th>
                <th className="px-6 py-4 text-right">Total Subs</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {mockTariffs.map((tariff) => (
                <tr key={tariff.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-slate-600">{tariff.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{tariff.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">{tariff.type}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">{tariff.price}</td>
                  <td className="px-6 py-4 text-right font-medium">{tariff.subs}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       {tariff.status === 'Active' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                       {tariff.status === 'Deprecated' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                       <span className={`text-xs font-bold uppercase tracking-wider
                         ${tariff.status === 'Active' ? 'text-emerald-700' : 'text-amber-700'}
                       `}>
                         {tariff.status}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/tariffs/${tariff.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors" title="View Detail">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
