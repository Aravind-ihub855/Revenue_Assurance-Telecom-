"use client";
import React from 'react';
import Link from 'next/link';
import { Search, Filter, MoreVertical, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

const mockCustomers = [
  { id: 'CUST-8001', name: 'Acme Corporation', msisdn: '+1-555-0192', plan: 'Enterprise Postpaid Master', arpu: '$4,250.00', status: 'Active', issue: 'Underbilling' },
  { id: 'CUST-8002', name: 'Global Tech LLC', msisdn: '+1-555-8841', plan: 'Prepaid Daily', arpu: '$85.00', status: 'Active', issue: 'Overbilling' },
  { id: 'CUST-8003', name: 'Sarah Jenkins', msisdn: '+1-555-3002', plan: 'Family Shared Plan', arpu: '$120.00', status: 'Suspended', issue: 'Missing Billing' },
  { id: 'CUST-8004', name: 'Michael Chen', msisdn: '+1-555-4421', plan: 'Corp Flex Plan', arpu: '$250.00', status: 'Active', issue: null },
  { id: 'CUST-8005', name: 'Nexus Logistics', msisdn: '+1-555-9182', plan: 'Enterprise SIP Trunk', arpu: '$3,200.00', status: 'Warning', issue: 'Tariff Mismatch' },
];

export default function CustomersPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-500 mt-1">Manage and view subscriber accounts and associated anomaly cases.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search MSISDN..." 
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
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">MSISDN</th>
                <th className="px-6 py-4">Current Plan</th>
                <th className="px-6 py-4 text-right">Mtd Usage (ARPU)</th>
                <th className="px-6 py-4">Status & Health</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {mockCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{customer.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{customer.id}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600">{customer.msisdn}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded text-xs font-semibold">{customer.plan}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">{customer.arpu}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       {customer.status === 'Active' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                       {customer.status === 'Suspended' && <AlertCircle className="w-4 h-4 text-rose-500" />}
                       {customer.status === 'Warning' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                       <span className={`text-xs font-bold uppercase tracking-wider
                         ${customer.status === 'Active' ? 'text-emerald-700' : ''}
                         ${customer.status === 'Suspended' ? 'text-rose-700' : ''}
                         ${customer.status === 'Warning' ? 'text-amber-700' : ''}
                       `}>
                         {customer.status}
                       </span>
                    </div>
                    {customer.issue && (
                      <div className="mt-1">
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded leading-none inline-block">
                          {customer.issue} Issue Detected
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/customers/${customer.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors" title="View Detail">
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
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
          <span>Showing 1 to 5 of 12,431 customers</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded bg-white text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded bg-white text-slate-700 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
