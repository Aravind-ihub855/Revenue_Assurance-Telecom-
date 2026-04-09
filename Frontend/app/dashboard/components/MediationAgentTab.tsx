import { Cog, ArrowRightLeft, FileWarning, Filter } from 'lucide-react';

export default function MediationAgentTab() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Cog className="w-6 h-6 text-amber-500" />
            Mediation Agent
          </h2>
          <p className="text-slate-500 mt-1">Transform, normalize, and distribute raw CDRs to the rating engine.</p>
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200">
          <button className="bg-white shadow text-amber-600 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all">Active Stream</button>
          <button className="text-slate-500 hover:text-slate-900 px-4 py-1.5 rounded-lg text-sm font-medium transition-all">Historical Batch</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Processing Funnel */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Filter className="w-32 h-32" />
          </div>
          <h3 className="text-sm font-black tracking-widest text-slate-500 uppercase mb-6">Mediation Funnel</h3>
          
          <div className="space-y-6 relative z-10">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Raw Input (Post Validation)</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-slate-900">448,901</span>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">100%</span>
              </div>
              <div className="w-full bg-slate-200 h-1 mt-2 rounded">
                <div className="bg-blue-500 h-1 rounded" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Normalized Records</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-slate-900">445,120</span>
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">99.1%</span>
              </div>
              <div className="w-full bg-slate-200 h-1 mt-2 rounded">
                <div className="bg-amber-500 h-1 rounded" style={{ width: '99.1%' }}></div>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Output to Rating</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-slate-900">444,950</span>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">99.1%</span>
              </div>
              <div className="w-full bg-slate-200 h-1 mt-2 rounded">
                <div className="bg-emerald-500 h-1 rounded" style={{ width: '99.1%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Breakdown */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-black tracking-widest text-slate-500 uppercase">Data Loss Detection</h3>
              <p className="text-xs text-slate-500 mt-1">Breakdown of records dropped during normalization</p>
            </div>
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2">
              <FileWarning className="w-4 h-4" />
              -3,951 Records
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-grow">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-center">
              <span className="text-slate-500 text-xs font-semibold uppercase">Transformation Failure</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">2,105</p>
              <p className="text-xs text-red-500 mt-1">Could not map to unified schema</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-center">
              <span className="text-slate-500 text-xs font-semibold uppercase">Duplicate/Stale</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">1,676</p>
              <p className="text-xs text-amber-500 mt-1">Already processed in prior batch</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-center">
              <span className="text-slate-500 text-xs font-semibold uppercase">Format Corruption</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">130</p>
              <p className="text-xs text-rose-500 mt-1">Unreadable character encoding</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-center">
              <span className="text-slate-500 text-xs font-semibold uppercase">Missing Timestamps</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">40</p>
              <p className="text-xs text-blue-500 mt-1">Dropped due to strict sequential rules</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
