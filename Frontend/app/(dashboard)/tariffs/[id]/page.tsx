"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, FileText, Target, Users, Settings2, Receipt } from 'lucide-react';

export default function TariffDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || 'TAR-1001';

  // Mock data for the view
  const tariff = {
    id,
    name: 'Enterprise Postpaid Master',
    type: 'Postpaid',
    price: '$150.00/mo',
    subs: '1,240',
    status: 'Active',
    description: 'High-tier corporate plan with pooled data, international roaming passes, and SLA priorities.',
    rules: {
      voiceLocal: 'Unlimited',
      voiceIntl: '$0.50 / minute (Zone 1)',
      data: '200GB Pooled / $1.20 per GB overage',
      sms: 'Unlimited'
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <Link href="/tariffs" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Tariff Plans
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            {tariff.name}
            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full
              ${tariff.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}
            `}>
              {tariff.status}
            </span>
          </h1>
          <p className="text-slate-500 mt-2 font-mono">{tariff.id} • {tariff.type}</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-colors flex items-center gap-2">
           <Settings2 className="w-4 h-4" /> Edit Ruleset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Left Column: Metadata */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-black tracking-widest text-slate-500 uppercase mb-4">Plan Specifications</h3>
            
            <p className="text-sm text-slate-700 leading-relaxed mb-6">
              {tariff.description}
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3 text-sm">
                 <Receipt className="w-5 h-5 text-slate-400" />
                 <div className="flex-1">
                   <p className="text-slate-500 text-xs">Base Monthly Price</p>
                   <p className="font-semibold text-slate-900">{tariff.price}</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                 <Target className="w-5 h-5 text-slate-400" />
                 <div className="flex-1">
                   <p className="text-slate-500 text-xs">Billing Type</p>
                   <p className="font-semibold text-slate-900">{tariff.type}</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                 <Users className="w-5 h-5 text-slate-400" />
                 <div className="flex-1">
                   <p className="text-slate-500 text-xs">Active Subscribers</p>
                   <p className="font-semibold text-slate-900">{tariff.subs}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Rules Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-900 tracking-wide">Charging Rules Matrix</h3>
              <p className="text-xs text-slate-500 mt-1">Logic matrix used by the connected Rating Engine.</p>
            </div>
            
            <div className="p-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Local Voice</h4>
                    <p className="text-slate-900 font-medium">{tariff.rules.voiceLocal}</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Intl Voice</h4>
                    <p className="text-slate-900 font-medium">{tariff.rules.voiceIntl}</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Data Allocation</h4>
                    <p className="text-slate-900 font-medium">{tariff.rules.data}</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">SMS / MMS</h4>
                    <p className="text-slate-900 font-medium">{tariff.rules.sms}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
