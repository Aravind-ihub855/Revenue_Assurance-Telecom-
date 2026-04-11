"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Loader2, AlertCircle, ChevronRight, PlaySquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface TariffPlan {
  plan_id: string;
  plan_name: string;
  plan_category: string;
  account_type: string;
  plan_price: number;
  validity_days: number;
  validity_type: string;
  is_5g_plan: boolean;
  daily_data_mb: number;
  is_unlimited_plan: boolean;
  roaming_included: boolean;
}

export default function TariffsPage() {
  const [tariffs, setTariffs] = useState<TariffPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Plans');
  const router = useRouter();

  useEffect(() => {
    fetchTariffs();
  }, []);

  const fetchTariffs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/tariffs/');
      setTariffs(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All Plans',
    'JioPlus Plans',
    'International Roaming',
    'Prepaid Plans',
    '5G Plans'
  ];

  const filteredTariffs = tariffs.filter(t => {
    // Text search
    const matchesSearch = t.plan_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.plan_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    let matchesCategory = true;
    if (activeCategory === 'JioPlus Plans') matchesCategory = t.plan_name.includes('JioPlus');
    else if (activeCategory === 'International Roaming') matchesCategory = t.roaming_included;
    else if (activeCategory === 'Prepaid Plans') matchesCategory = t.plan_category === 'prepaid';
    else if (activeCategory === '5G Plans') matchesCategory = t.is_5g_plan;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-800 mb-4 px-4">Plan category</h2>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${
                  activeCategory === cat 
                    ? 'bg-[#edf2fa] text-[#0f3c8a] border-transparent shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-slate-900">{activeCategory}</h1>
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search plans" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
               <Loader2 className="w-10 h-10 text-[#0f3c8a] animate-spin" />
               <p className="text-slate-500 font-medium">Loading premium plans...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex items-center gap-3 border border-red-100">
               <AlertCircle className="w-6 h-6" />
               <p className="font-semibold">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTariffs.map((tariff) => (
                <div 
                  key={tariff.plan_id} 
                  className="bg-[#edf2fa] rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition-all border border-transparent hover:border-blue-200 group cursor-pointer"
                  onClick={() => router.push(`/tariffs/${tariff.plan_id}`)}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black uppercase text-[#0d738f] bg-white/50 px-2.5 py-1 rounded-full tracking-widest">
                        {tariff.plan_name.includes('Family') ? 'FAMILY PLAN' : 'INDIVIDUAL PLAN'}
                      </span>
                      {tariff.is_5g_plan && (
                        <span className="text-[12px] font-black italic text-red-600 tracking-tighter">
                          TRUE<span className="text-slate-900">5G</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mb-6">
                       <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                         ₹{tariff.plan_price}
                       </h2>
                       <button className="text-[#0f3c8a] p-1 group-hover:translate-x-1 transition-transform">
                         <ChevronRight className="w-5 h-5 font-bold" />
                       </button>
                    </div>

                    <div className="flex justify-between items-end mb-6">
                      <div className="flex gap-6">
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-0.5">Validity</p>
                          <p className="text-sm font-bold text-slate-900">
                            {tariff.validity_days === -1 ? 'Bill Cycle' : `${tariff.validity_days} days`}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-0.5">Benefits</p>
                          <p className="text-sm font-bold text-slate-900">
                            {tariff.daily_data_mb === -1 ? 'Unlimited' : `${(tariff.daily_data_mb / 1024) * (tariff.validity_days > 0 ? tariff.validity_days : 30)} GB`}
                          </p>
                        </div>
                      </div>
                      
                      {/* OTT Mock Icons */}
                      {tariff.plan_price >= 349 && (
                        <div className="flex items-center gap-1">
                           <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-[8px] font-black text-red-600">N</div>
                           <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white"><PlaySquare className="w-3.5 h-3.5" /></div>
                           <span className="text-[10px] font-bold text-slate-500 ml-1">+2 more</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button className="w-full bg-[#0f3c8a] hover:bg-[#0a2963] text-white font-bold py-3.5 rounded-full transition-colors mt-auto text-[15px]">
                    Get Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
