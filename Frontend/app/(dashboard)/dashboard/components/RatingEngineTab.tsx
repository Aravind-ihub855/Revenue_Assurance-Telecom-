import { Calculator, PhoneCall, Wifi, MessageSquare, Receipt, ArrowRight } from 'lucide-react';

export default function RatingEngineTab() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-green-500" />
            Rating Engine
          </h2>
          <p className="text-slate-500 mt-1">Applies tariff models to compute expected billing charges from usage data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Overview Stats */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
              <PhoneCall className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Voice Processed</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">8.2M Mins</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <Wifi className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Data Processed</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">4,120 TB</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100">
              <MessageSquare className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">SMS Processed</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">14.5M Units</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-white p-5 rounded-2xl border border-green-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-md shadow-green-500/20">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-green-600 font-semibold uppercase">Expected Revenue</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">$3.42M</p>
            </div>
          </div>
        </div>

        {/* Plan Mapping Log */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl overflow-hidden h-full">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-semibold text-slate-900 tracking-wide">Live Rating Engine Output</h3>
                <p className="text-xs text-slate-500 mt-1">Real-time simulation of user mapping and charge computation</p>
              </div>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-50"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold">User Hash</th>
                    <th className="px-6 py-4 font-semibold">Plan Matrix</th>
                    <th className="px-6 py-4 font-semibold">Raw Usage</th>
                    <th className="px-6 py-4 font-semibold text-center">Tariff Logic</th>
                    <th className="px-6 py-4 font-semibold text-right">Computed Charge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500">c8bf...32a1</td>
                    <td className="px-6 py-4">
                      <span className="text-slate-900 font-medium">Enterprise Postpaid L2</span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      <div>340 Mins (Outside Bundle)</div>
                      <div className="text-xs text-slate-500 mt-0.5">Free allowance: 500/500 Used</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
                        Base + 340 * $0.05 <ArrowRight className="w-3 h-3 text-slate-400" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">$67.00</td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500">f2aa...98b0</td>
                    <td className="px-6 py-4">
                      <span className="text-slate-900 font-medium">Prepaid Unlimited Global</span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      <div>12.5 GB Data (Int. Roaming)</div>
                      <div className="text-xs text-slate-500 mt-0.5">Zone 2 Multiplier Applied</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
                        12.5 * $3.20 <ArrowRight className="w-3 h-3 text-slate-400" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">$40.00</td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500">a04f...b760</td>
                    <td className="px-6 py-4">
                      <span className="text-slate-900 font-medium">Family Shared Plan (Master)</span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      <div>205 SMS (Premium Shortcode)</div>
                      <div className="text-xs text-slate-500 mt-0.5">Excluded from free bundle</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
                        205 * $0.20 <ArrowRight className="w-3 h-3 text-slate-400" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">$41.00</td>
                  </tr>

                </tbody>
              </table>
            </div>
        </div>

      </div>
    </div>
  );
}
