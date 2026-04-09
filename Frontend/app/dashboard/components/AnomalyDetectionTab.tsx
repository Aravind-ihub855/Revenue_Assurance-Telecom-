import { Shield, AlertTriangle, BugOff, TrendingDown, Eye } from 'lucide-react';

export default function AnomalyDetectionTab() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-500" />
            Anomaly Detection
          </h2>
          <p className="text-slate-500 mt-1">Cross-references Expected Billing (from Rating) vs Actual Billing to detect leakage and discrepancies.</p>
        </div>
        <button className="bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all border border-purple-500/30 shadow-lg shadow-purple-500/10">
          <BugOff className="w-4 h-4" />
          Run Deep Scan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Severity Summary */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-black tracking-widest text-slate-500 uppercase mb-4">Anomaly Severity</h3>
            
            <div className="space-y-4 relative">
              {/* Connecting line */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-100 z-0"></div>

              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-xl">184</p>
                  <p className="text-xs text-rose-600 font-semibold uppercase tracking-wider">High Risk</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">&gt; $1000 Leakage</p>
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <TrendingDown className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-xl">412</p>
                  <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider">Medium Risk</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">$100 - $1000 Leakage</p>
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-xl">823</p>
                  <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Low Risk</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">&lt; $100 Discrepancy</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Anomaly Ledger */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl overflow-hidden h-full shadow-sm">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-900 tracking-wide">Discrepancy Ledger</h3>
              <div className="flex gap-2">
                <span className="text-xs font-semibold bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full cursor-pointer hover:bg-slate-50 transition">Underbilling</span>
                <span className="text-xs font-semibold bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full cursor-pointer hover:bg-slate-50 transition">Overbilling</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Account / MSISDN</th>
                    <th className="px-6 py-4 font-semibold">Anomaly Type</th>
                    <th className="px-6 py-4 font-semibold text-right">Expected</th>
                    <th className="px-6 py-4 font-semibold text-right">Actual Billed</th>
                    <th className="px-6 py-4 font-semibold text-right">Delta / Leakage</th>
                    <th className="px-6 py-4 font-semibold text-center">Root Cause Tag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-slate-700">+1-555-0192</div>
                      <div className="text-xs text-slate-500 mt-0.5">Corp Flex Plan</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                        <span className="text-slate-900 font-medium">Massive Underbilling</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600">$1,450.00</td>
                    <td className="px-6 py-4 text-right text-slate-600">$250.00</td>
                    <td className="px-6 py-4 text-right font-bold text-rose-600">-$1,200.00</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Tariff Mismatch</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-slate-700">+1-555-8841</div>
                      <div className="text-xs text-slate-500 mt-0.5">Prepaid Daily</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <span className="text-slate-900 font-medium">Data Overbilling</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600">$15.00</td>
                    <td className="px-6 py-4 text-right text-slate-600">$85.00</td>
                    <td className="px-6 py-4 text-right font-bold text-amber-600">+$70.00</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Duplicate CDR</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-slate-700">+1-555-3002</div>
                      <div className="text-xs text-slate-500 mt-0.5">Enterprise SIP Trunk</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                        <span className="text-slate-900 font-medium">Missing Billing</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600">$3,200.00</td>
                    <td className="px-6 py-4 text-right text-slate-600">$0.00</td>
                    <td className="px-6 py-4 text-right font-bold text-rose-600">-$3,200.00</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Mediation Issue</span>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
        </div>

      </div>
    </div>
  );
}
