import PipelineVisualizer from './PipelineVisualizer';

export default function OverviewTab() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Pipeline Visualizer */}
      <PipelineVisualizer />

      {/* 2. Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white p-6 rounded-3xl border border-blue-100 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
          <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-2">Total CDR Processed</h3>
          <p className="text-3xl font-bold text-blue-600">2.4M</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-semibold text-slate-400">Daily Ingestion Volume</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-6 rounded-3xl border border-amber-100 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
          <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-2">Revenue Leakage</h3>
          <p className="text-3xl font-bold text-amber-500">1.24%</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-semibold text-slate-400">Estimated Monthly Loss</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-6 rounded-3xl border border-rose-100 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>
          <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-2">Anomalies Detected</h3>
          <p className="text-3xl font-bold text-rose-500 mb-1">1,419</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-semibold text-slate-400">Unresolved discrepancies</p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
          <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-2">Records Auto-Fixed</h3>
          <p className="text-3xl font-bold text-emerald-500 mb-1">8,294</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-semibold text-slate-400">Via Action Agent Rules</p>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white p-6 rounded-3xl border border-indigo-100 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
          <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-2">Revenue Recovered</h3>
          <p className="text-3xl font-bold text-indigo-500 mb-1">$42.1K</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-semibold text-slate-400">Cumulative Current Month</p>
          </div>
        </div>

      </div>
    </div>
  );
}
