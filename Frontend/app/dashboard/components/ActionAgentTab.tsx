import { Zap, PlayCircle, Bot, CheckCircle, Clock } from 'lucide-react';

export default function ActionAgentTab() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-6 h-6 text-rose-500" />
            Action & Correction Agent
          </h2>
          <p className="text-slate-500 mt-1">Automated remediation workflow for detected discrepancies.</p>
        </div>
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/30 px-4 py-2 rounded-xl">
          <Bot className="w-5 h-5 text-rose-500" />
          <span className="text-sm font-semibold text-rose-500">Auto-Correction Active</span>
          <div className="w-12 h-6 bg-rose-500 rounded-full relative ml-2 cursor-pointer shadow-lg shadow-rose-500/20">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Suggested Fix Queue */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 text-slate-900">
            <h3 className="font-semibold text-slate-900 tracking-wide">Pending Action Queue</h3>
            <p className="text-xs text-slate-500 mt-1">Discrepancies awaiting manual approval or AI execution</p>
          </div>
          
          <div className="divide-y divide-slate-100">
            {/* Item 1 */}
            <div className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Reprocess CDR Batch #491A</h4>
                  <p className="text-sm text-slate-500 mt-1">Anomaly: Missing Billing (-$3,200.00)</p>
                </div>
                <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-bold border border-rose-200">High Priority</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-slate-500">Suggested Fix:</span>
                  <span className="text-slate-900 font-medium">Re-run through Mediation Agent with relaxed timestamp rules.</span>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2">
                  <PlayCircle className="w-4 h-4" /> Execute Fix
                </button>
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Correct Tariff Assignment</h4>
                  <p className="text-sm text-slate-500 mt-1">Anomaly: Underbilling (-$1,200.00)</p>
                </div>
                <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">Medium Priority</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-slate-500">Suggested Fix:</span>
                  <span className="text-slate-900 font-medium">Re-map +1-555-0192 to 'Enterprise Postpaid Master'</span>
                </div>
                <div className="flex gap-2">
                  <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm">Review</button>
                  <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2">
                    <PlayCircle className="w-4 h-4" /> Apply Tariff
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Logs */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-full">
          <h3 className="font-semibold text-slate-900 tracking-wide mb-6">Execution Log</h3>
          
          <div className="space-y-6 relative flex-grow">
            <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-200"></div>

            <div className="relative pl-10">
              <div className="absolute left-0 p-1 bg-white rounded-full border border-slate-200 shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-slate-900">Auto-Refund Initiated</p>
              <p className="text-xs text-slate-500 mt-1">Refunded $70.00 for Duplicate Data CDR on +1-555-8841</p>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> 2 mins ago by AI Action Agent</p>
            </div>

            <div className="relative pl-10">
              <div className="absolute left-0 p-1 bg-white rounded-full border border-slate-200 shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-slate-900">Tariff Synchronization Output</p>
              <p className="text-xs text-slate-500 mt-1">Synced 45 orphaned accounts to baseline prepaid tariff</p>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> 45 mins ago by System</p>
            </div>

            <div className="relative pl-10">
              <div className="absolute left-0 p-1 bg-white rounded-full border border-slate-200 shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-slate-900">CDR Batch Reprocessing</p>
              <p className="text-xs text-slate-500 mt-1">Successfully recovered 812 dropped records from Batch #490</p>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> 3 hours ago by Aravind</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
