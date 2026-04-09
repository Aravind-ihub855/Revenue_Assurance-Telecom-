import { TrendingUp, DollarSign, Activity, CheckCircle } from 'lucide-react';

export default function ImpactDashboardTab() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
            Impact Dashboard
          </h2>
          <p className="text-slate-500 mt-1">High-level business value tracking and operational efficiency metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Hero Impact Metrics */}
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-3xl border border-indigo-100 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center mb-4 shadow-md shadow-indigo-500/30">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-sm font-black tracking-widest text-indigo-600 uppercase mb-1">Mtd Recovered Revenue</h3>
          <p className="text-4xl font-bold text-slate-900">$42,105.00</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit border border-emerald-100">
            <TrendingUp className="w-3 h-3" />
            +12.4% vs Last Month
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <h3 className="text-sm font-black tracking-widest text-slate-500 uppercase mb-1">Billing Accuracy</h3>
          <p className="text-3xl font-bold text-emerald-600 mt-4">99.92%</p>
          <p className="text-xs text-slate-500 mt-2">Improved from 98.5% baseline</p>
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <CheckCircle className="w-32 h-32" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <h3 className="text-sm font-black tracking-widest text-slate-500 uppercase mb-1">Leakage Reduction</h3>
          <p className="text-3xl font-bold text-blue-600 mt-4">-84%</p>
          <p className="text-xs text-slate-500 mt-2">Reduction in unbilled events</p>
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <Activity className="w-32 h-32" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <h3 className="text-sm font-black tracking-widest text-slate-500 uppercase mb-1">Issues Auto-Resolved</h3>
          <p className="text-3xl font-bold text-purple-600 mt-4">8,294</p>
          <p className="text-xs text-slate-500 mt-2">By AI Action Agent interventions</p>
        </div>

      </div>

      {/* Comparisons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
           <h3 className="font-semibold text-slate-900 tracking-wide mb-6">Pipeline Performance (Before vs After)</h3>
           <div className="space-y-6">
             
             <div>
               <div className="flex justify-between text-sm mb-1">
                 <span className="text-slate-500">Manual Detection Time</span>
                 <span className="text-rose-600 font-bold">4.5 Days</span>
               </div>
               <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                 <div className="bg-rose-500 h-full" style={{ width: '80%' }}></div>
               </div>
             </div>

             <div>
               <div className="flex justify-between text-sm mb-1">
                 <span className="text-slate-500">AI Agent Detection Time</span>
                 <span className="text-emerald-600 font-bold">12 Minutes</span>
               </div>
               <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                 <div className="bg-emerald-500 h-full" style={{ width: '5%' }}></div>
               </div>
             </div>

           </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
            <TrendingUp className="w-12 h-12 text-indigo-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Automated Revenue Protection</h3>
            <p className="text-slate-500 text-sm max-w-sm">The multi-agent pipeline is currently operating at optimal efficiency, securing an estimated <strong className="text-slate-900">$14.2M</strong> in annualized revenue.</p>
        </div>
      </div>

    </div>
  );
}
