import { UploadCloud, CheckCircle2, AlertCircle, FileX, Database } from 'lucide-react';

export default function DataAgentTab() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-500" />
            Data Agent
          </h2>
          <p className="text-slate-500 mt-1">Ingestion and quality validation layer for telecom CDRs.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20">
          <UploadCloud className="w-4 h-4" />
          Upload New Batch
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Validation Summary */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black tracking-widest text-slate-500 uppercase mb-4">Batch Health Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-slate-700">Total Records</span>
                </div>
                <span className="font-bold text-slate-900">450,210</span>
              </div>
              <div className="flex justify-between items-center bg-green-50 p-3 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Valid</span>
                </div>
                <span className="font-bold text-green-600">448,901</span>
              </div>
              <div className="flex justify-between items-center bg-red-50 p-3 rounded-xl border border-red-200">
                <div className="flex items-center gap-3">
                  <FileX className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">Rejected</span>
                </div>
                <span className="font-bold text-red-600">1,309</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.7%' }}></div>
              </div>
              <p className="text-xs text-slate-500 text-center">99.7% Passage Rate</p>
            </div>
          </div>
        </div>

        {/* Validation Issues Table */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden h-full">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-semibold text-slate-900">Validation Errors</h3>
              <span className="text-xs font-medium bg-red-50 text-red-600 px-2.5 py-1 rounded-full border border-red-200">Needs Review</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Error Type</th>
                    <th className="px-6 py-4 font-semibold">Affected Count</th>
                    <th className="px-6 py-4 font-semibold">Severity</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        <span className="text-slate-700 font-medium">Missing B-Party Number</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">842</td>
                    <td className="px-6 py-4"><span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-xs font-medium border border-amber-100">Medium</span></td>
                    <td className="px-6 py-4"><button className="text-blue-600 hover:text-blue-500 font-medium text-xs">View Log</button></td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-slate-700 font-medium">Invalid Call Duration (-1)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">315</td>
                    <td className="px-6 py-4"><span className="text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-medium border border-red-100">High</span></td>
                    <td className="px-6 py-4"><button className="text-blue-600 hover:text-blue-500 font-medium text-xs">View Log</button></td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-slate-700 font-medium">Duplicate CDR Detection</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">152</td>
                    <td className="px-6 py-4"><span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-xs font-medium border border-blue-100">Low</span></td>
                    <td className="px-6 py-4"><button className="text-blue-600 hover:text-blue-500 font-medium text-xs">Auto-Merged</button></td>
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
