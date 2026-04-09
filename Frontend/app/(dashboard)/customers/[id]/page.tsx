"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, User, Phone, MapPin, Activity, AlertTriangle, Receipt, CreditCard } from 'lucide-react';

export default function CustomerDetailPage() {
  const params = useParams();
  // Safe extraction for Next.js where params might be a promise or object depending on version setup
  const id = (params?.id as string) || 'CUST-8001';

  // Mock data for the view
  const customer = {
    id,
    name: 'Acme Corporation',
    msisdn: '+1-555-0192',
    plan: 'Enterprise Postpaid Master',
    status: 'Active',
    joinedDate: '2022-04-15',
    address: '100 Tech Blvd, Silicon Valley, CA',
    arpu: '$4,250.00',
    anomalies: 3,
    lastInvoice: '$3,050.00' // Underbilled
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <Link href="/customers" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Customers
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            {customer.name}
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
              {customer.status}
            </span>
          </h1>
          <p className="text-slate-500 mt-2 font-mono">{customer.id} • {customer.msisdn}</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-colors">
           Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Left Column: 360 Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-black tracking-widest text-slate-500 uppercase mb-4">Account Profile</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                 <User className="w-5 h-5 text-slate-400" />
                 <div className="flex-1">
                   <p className="text-slate-500 text-xs">Primary Contact</p>
                   <p className="font-semibold text-slate-900">Jane Doe</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                 <Phone className="w-5 h-5 text-slate-400" />
                 <div className="flex-1">
                   <p className="text-slate-500 text-xs">Registered MSISDN</p>
                   <p className="font-semibold text-slate-900">{customer.msisdn}</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                 <MapPin className="w-5 h-5 text-slate-400" />
                 <div className="flex-1">
                   <p className="text-slate-500 text-xs">Billing Address</p>
                   <p className="font-semibold text-slate-900">{customer.address}</p>
                 </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100">
               <div className="flex items-center gap-3 text-sm">
                 <CreditCard className="w-5 h-5 text-slate-400" />
                 <div className="flex-1">
                   <p className="text-slate-500 text-xs">Active Tariff Plan</p>
                   <p className="font-semibold text-slate-900">{customer.plan}</p>
                 </div>
                 <Link href="/tariffs/TAR-1001" className="text-xs text-blue-600 hover:underline">View Matrix</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Analytics & Ledger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                 <Activity className="w-5 h-5 text-blue-500" />
               </div>
               <div>
                 <p className="text-xs text-slate-500 font-semibold uppercase">Mtd Usage (ARPU)</p>
                 <p className="text-2xl font-bold text-slate-900 mt-0.5">{customer.arpu}</p>
               </div>
             </div>
             
             <div className="bg-rose-50 p-6 rounded-3xl border border-rose-200 shadow-sm flex items-center gap-4 relative overflow-hidden">
               <div className="absolute -right-4 -bottom-4 opacity-10">
                 <AlertTriangle className="w-32 h-32 text-rose-500" />
               </div>
               <div className="relative z-10 w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center border border-rose-200">
                 <Receipt className="w-5 h-5 text-rose-600" />
               </div>
               <div className="relative z-10">
                 <p className="text-xs text-rose-600 font-semibold uppercase">Actual Billed</p>
                 <p className="text-2xl font-bold text-rose-700 mt-0.5">{customer.lastInvoice}</p>
                 <p className="text-[10px] text-rose-600 mt-1 font-bold bg-rose-100 px-1.5 py-0.5 rounded w-fit inline-block">-$1,200.00 Leakage</p>
               </div>
             </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-900 tracking-wide">Historical Discrepancy Ledger</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Event Type</th>
                    <th className="px-6 py-3 text-right">Delta</th>
                    <th className="px-6 py-3 text-center">Root Cause</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500">Oct 12, 2026</td>
                    <td className="px-6 py-4 font-medium text-slate-900">Missing Billing Record</td>
                    <td className="px-6 py-4 text-right font-bold text-rose-600">-$1,200.00</td>
                    <td className="px-6 py-4 text-center"><span className="text-[10px] font-bold uppercase bg-slate-100 border border-slate-200 px-2 py-1 rounded">Tariff Mismatch</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500">Sep 28, 2026</td>
                    <td className="px-6 py-4 font-medium text-slate-900">Duplicate CDR Reversal</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">+$45.00</td>
                    <td className="px-6 py-4 text-center"><span className="text-[10px] font-bold uppercase bg-slate-100 border border-slate-200 px-2 py-1 rounded">Auto-Resolved</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
