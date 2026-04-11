"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, Target, Users, Settings2, Receipt, 
  Phone, Globe, Wifi, MessageSquare, Zap, ShieldCheck, 
  Calendar, Info, Loader2, AlertCircle 
} from 'lucide-react';
import { api } from '@/lib/api';

interface TariffPlan {
  plan_id: string;
  plan_name: string;
  plan_category: string;
  account_type: string;
  plan_price: number;
  validity_days: number;
  validity_type: string;
  voice_unlimited_flag: boolean;
  free_voice_local_min: number;
  free_voice_std_min: number;
  free_voice_isd_min: number;
  daily_data_mb: number;
  free_sms_per_day: number;
  free_sms_total: number;
  post_fup_speed_kbps: number;
  is_unlimited_plan: boolean;
  is_5g_plan: boolean;
  is_data_only_plan: boolean;
  roaming_included: boolean;
  overage_rate_per_gb: number;
  effective_from: string;
  effective_to: string | null;
}

export default function TariffDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [tariff, setTariff] = useState<TariffPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchTariffDetail();
  }, [id]);

  const fetchTariffDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/tariffs/${id}`);
      setTariff(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-slate-500 font-medium">Fetching plan details...</p>
      </div>
    );
  }

  if (error || !tariff) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Link href="/tariffs" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Tariff Plans
        </Link>
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Error Loading Plan</h2>
          <p className="text-slate-500 mt-2">{error || 'Plan not found'}</p>
          <button onClick={fetchTariffDetail} className="mt-6 bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-semibold">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <Link href="/tariffs" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Tariff Plans
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">{tariff.plan_name}</h1>
            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200`}>
              {tariff.plan_category}
            </span>
            {tariff.is_5g_plan && (
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Zap className="w-3 h-3" /> 5G Ready
              </span>
            )}
          </div>
          <p className="text-slate-500 mt-2 font-mono text-sm">
            {tariff.plan_id} • {tariff.account_type} • Effective From: {tariff.effective_from}
          </p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-colors flex items-center gap-2">
           <Settings2 className="w-4 h-4" /> Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Left Column: Summary Cards */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-black tracking-widest text-slate-500 uppercase mb-5">Cost & Validity</h3>
            
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Receipt className="w-6 h-6" />
                 </div>
                 <div>
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Base Price</p>
                   <p className="text-2xl font-black text-slate-900">₹{tariff.plan_price}</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                    <Calendar className="w-6 h-6" />
                 </div>
                 <div>
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Validity Period</p>
                   <p className="text-lg font-bold text-slate-900">
                     {tariff.validity_days === -1 ? 'Ongoing' : `${tariff.validity_days} ${tariff.validity_type}`}
                   </p>
                 </div>
              </div>

              <div className="pt-5 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div>
                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Post-FUP Speed</p>
                   <p className="font-bold text-slate-700">{tariff.post_fup_speed_kbps} Kbps</p>
                </div>
                <div>
                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Overage Rate</p>
                   <p className="font-bold text-slate-700">₹{tariff.overage_rate_per_gb}/GB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
               <ShieldCheck className="w-8 h-8 text-blue-400 mb-4" />
               <h4 className="font-bold text-lg">Plan Integrity</h4>
               <p className="text-slate-400 text-sm mt-1 leading-relaxed">This plan is part of the standard {tariff.plan_category} ruleset. All billing audits will follow these rating rules.</p>
             </div>
             <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Right Column: Entitlements Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Entitlements Matrix</h3>
                <p className="text-xs text-slate-500 mt-1">Resource allocation and rate limiting for this plan.</p>
              </div>
              <Info className="w-5 h-5 text-slate-300" />
            </div>
            
            <div className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Voice */}
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Phone className="w-5 h-5" /></div>
                      <h4 className="font-bold text-slate-800">Voice Entitlements</h4>
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between text-sm">
                         <span className="text-slate-500">Local Calls</span>
                         <span className="font-bold text-slate-900">{tariff.voice_unlimited_flag ? 'Unlimited' : `${tariff.free_voice_local_min} Mins`}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-slate-500">STD Calls</span>
                         <span className="font-bold text-slate-900">{tariff.voice_unlimited_flag ? 'Unlimited' : `${tariff.free_voice_std_min} Mins`}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-slate-500">ISD Calls</span>
                         <span className="font-bold text-slate-900">{tariff.free_voice_isd_min} Mins</span>
                       </div>
                    </div>
                  </div>

                  {/* Data */}
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-emerald-200 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Wifi className="w-5 h-5" /></div>
                      <h4 className="font-bold text-slate-800">Data Allocation</h4>
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between text-sm">
                         <span className="text-slate-500">Daily Quota</span>
                         <span className="font-bold text-slate-900">{tariff.daily_data_mb === -1 ? 'Unlimited' : `${tariff.daily_data_mb} MB`}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-slate-500">Unlimited Option</span>
                         <span className="font-bold text-slate-900">{tariff.is_unlimited_plan ? 'Yes' : 'No'}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-slate-500">Network Priority</span>
                         <span className="font-bold text-slate-900">{tariff.is_5g_plan ? 'Premium' : 'Standard'}</span>
                       </div>
                    </div>
                  </div>

                  {/* SMS */}
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-purple-200 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><MessageSquare className="w-5 h-5" /></div>
                      <h4 className="font-bold text-slate-800">SMS / Messaging</h4>
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between text-sm">
                         <span className="text-slate-500">Daily SMS</span>
                         <span className="font-bold text-slate-900">{tariff.free_sms_per_day} Messages</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-slate-500">Total Bundle</span>
                         <span className="font-bold text-slate-900">{tariff.free_sms_total} Messages</span>
                       </div>
                    </div>
                  </div>

                  {/* Extras */}
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-amber-200 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Globe className="w-5 h-5" /></div>
                      <h4 className="font-bold text-slate-800">Additional Perks</h4>
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between text-sm">
                         <span className="text-slate-500">Roaming Incl.</span>
                         <span className="font-bold text-slate-900">{tariff.roaming_included ? 'Yes' : 'No'}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-slate-500">Account Type</span>
                         <span className="font-bold text-slate-900">{tariff.account_type}</span>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
