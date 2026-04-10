"use client";
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Database, Trash2, ArrowRight } from 'lucide-react';

interface PreviewData {
  table_name: string;
  headers: string[];
  preview_data: any[];
  total_rows: number;
  validation_errors: string[];
  is_valid: boolean;
}

export default function LifecycleIngestionPage() {
  const [tableName, setTableName] = useState("customer_plan_history");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ingesting, setIngesting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreview(null);
      setError(null);
      setSuccess(false);
    }
  };

  const validateFile = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`http://localhost:8000/api/ingest/preview?table_name=${tableName}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Validation failed");
      }
      
      const data = await response.json();
      setPreview(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const [stats, setStats] = useState<{processed: number, skipped: number} | null>(null);

  const startIngestion = async () => {
    if (!preview || !preview.is_valid || !file) return;
    
    setIngesting(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`http://localhost:8000/api/ingest/commit?table_name=${tableName}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Ingestion failed");
      }
      const data = await response.json();
      setStats({processed: data.rows_processed, skipped: data.rows_skipped_null_pk});
      setSuccess(true);
      setPreview(null);
      setFile(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIngesting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Lifecycle Data Ingestion</h1>
        <p className="text-slate-500 font-medium">Upload, validate and sync plan history and billing cycles to the database.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Configuration Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-5">Ingestion Config</h3>
            
            <div className="space-y-4">
               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Target Table</label>
                 <select 
                   value={tableName}
                   onChange={(e) => setTableName(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                 >
                   <option value="customer_plan_history">Customer Plan History</option>
                   <option value="billing_cycle">Billing Cycle</option>
                 </select>
               </div>

               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Upload File (CSV)</label>
                 {!file ? (
                   <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-10 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-all group">
                     <Upload className="w-10 h-10 text-slate-300 group-hover:text-blue-500 transition-colors mb-4" />
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Drag & Drop or Click</p>
                     <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                   </label>
                 ) : (
                   <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                         <FileText className="w-5 h-5" />
                       </div>
                       <div className="overflow-hidden">
                         <p className="text-sm font-bold text-blue-900 truncate">{file.name}</p>
                         <p className="text-[10px] text-blue-500 font-bold uppercase">{(file.size / 1024).toFixed(1)} KB</p>
                       </div>
                     </div>
                     <button onClick={() => setFile(null)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 )}
               </div>

               {file && !preview && !success && (
                 <button 
                   onClick={validateFile}
                   disabled={uploading}
                   className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                 >
                   {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Validate Data Structure"}
                 </button>
               )}
            </div>
          </div>

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col items-center text-center animate-in zoom-in duration-300">
               <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                 <CheckCircle2 className="w-8 h-8 text-emerald-600" />
               </div>
               <h4 className="font-bold text-emerald-900">Ingestion Complete!</h4>
               <p className="text-sm text-emerald-700 mt-1 font-medium">Data has been securely synced to the database.</p>
               {stats && (
                 <div className="mt-4 flex gap-4">
                   <div className="text-center">
                     <p className="text-[10px] font-black text-emerald-600 uppercase">Processed</p>
                     <p className="text-lg font-bold text-emerald-900">{stats.processed}</p>
                   </div>
                   <div className="text-center border-l border-emerald-200 pl-4">
                     <p className="text-[10px] font-black text-rose-500 uppercase">Skipped</p>
                     <p className="text-lg font-bold text-rose-900">{stats.skipped}</p>
                   </div>
                 </div>
               )}
               <button onClick={() => setSuccess(false)} className="mt-6 text-xs font-black uppercase text-emerald-600 hover:underline">Start New Ingestion</button>
            </div>
          )}
        </div>

        {/* Right: Preview & Validation area */}
        <div className="lg:col-span-2 space-y-6">
          {!preview && !error && !success && (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center text-center opacity-50">
               <Database className="w-16 h-16 text-slate-200 mb-6" />
               <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Awaiting file validation...</p>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex items-start gap-4 animate-in slide-in-from-top duration-300">
               <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
               <div>
                 <h4 className="font-bold text-rose-900">Data Validation Error</h4>
                 <p className="text-sm text-rose-700 mt-1">{error}</p>
               </div>
            </div>
          )}

          {preview && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Validation Summary Card */}
              <div className={`rounded-3xl p-6 border ${preview.is_valid ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900' : 'bg-amber-50 border-amber-100 text-amber-900'}`}>
                <div className="flex items-center justify-between mb-4">
                   <h3 className="flex items-center gap-2 font-bold uppercase text-xs tracking-widest">
                     {preview.is_valid ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
                     Validation Summary
                   </h3>
                   <span className="text-[10px] font-black bg-white/50 px-2 py-0.5 rounded-full">{preview.total_rows} Rows Detected</span>
                </div>
                
                {preview.validation_errors.length > 0 ? (
                  <ul className="space-y-2">
                    {preview.validation_errors.map((err, i) => (
                      <li key={i} className="text-sm font-medium flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                        {err}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm font-semibold">Schema match successful. All required fields are present and valid.</p>
                )}
                
                {preview.is_valid && (
                  <div className="mt-6 flex items-center justify-between">
                     <p className="text-xs font-bold text-emerald-700/60 uppercase tracking-tighter">Ready for direct database commit</p>
                     <button 
                       disabled={ingesting}
                       onClick={startIngestion}
                       className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
                     >
                       {ingesting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Commit to Database"}
                       <ArrowRight className="w-4 h-4" />
                     </button>
                  </div>
                )}
              </div>

              {/* Data Preview Table */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 tracking-tight text-sm">Data Preview (First 10 Rows)</h3>
                  <span className="text-[10px] text-slate-400 font-black uppercase">Sample View Only</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-50 text-slate-400 uppercase font-black tracking-tighter border-b border-slate-200">
                      <tr>
                        {preview.headers.map((h: string) => (
                          <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {preview.preview_data.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          {preview.headers.map((h: string) => (
                            <td key={h} className={`px-4 py-3 whitespace-nowrap font-medium ${row[h] === null ? 'text-rose-400 italic' : 'text-slate-600'}`}>
                              {row[h] === null ? 'NULL' : String(row[h])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
