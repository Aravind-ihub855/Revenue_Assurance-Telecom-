import { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, CheckCircle2, AlertCircle, FileX, Database, 
  Loader2, Activity, ShieldAlert, BarChart3, PieChart as PieChartIcon,
  ChevronRight, RefreshCw, Layers
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Cell, Pie
} from 'recharts';
import { api } from '@/lib/api';

interface ErrorBreakdown {
  error_type: string;
  affected_count: number;
  severity: string;
  action: string;
}

interface BatchHealth {
  total_records: number;
  valid_records: number;
  rejected_records: number;
  duplicate_records: number;
  valid_percentage: number;
}

interface BatchSummary {
  batch_id: string;
  target_type: string;
  total: number;
  valid: number;
  rejected: number;
  percentage: number;
  timestamp: string;
}

interface SystemStats {
  total_batches: number;
  overall_health: number;
  total_volume: number;
  critical_alerts: number;
  historical_trend: BatchSummary[];
  error_distribution: { name: string; value: number }[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function DataAgentTab() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null); // target_type being uploaded
  const [lastResult, setLastResult] = useState<{health: BatchHealth, errors: ErrorBreakdown[], batchId: string} | null>(null);
  
  const cdrRef = useRef<HTMLInputElement>(null);
  const smsRef = useRef<HTMLInputElement>(null);
  const dataRef = useRef<HTMLInputElement>(null);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/data-agent/stats');
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpload = async (file: File, type: string) => {
    setUploading(type);
    setLastResult(null);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_type', type);
    
    try {
      const response = await api.post('/api/data-agent/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const data = response.data;
      setLastResult({
        health: data.batch_health,
        errors: data.error_breakdown,
        batchId: data.message.match(/Batch-[\dA-F]+/)?.[0] || 'Unknown'
      });
      fetchStats(); // Refresh dashboard
    } catch (err: any) {
      alert("Error uploading batch: " + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(null);
    }
  };

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Total Batches" 
          value={stats?.total_batches || 0} 
          subtitle="Processed last 24h"
          icon={<Layers className="w-5 h-5 text-blue-600" />}
          trend="+12%"
          color="blue"
        />
        <KpiCard 
          title="System Health" 
          value={`${stats?.overall_health || 0}%`} 
          subtitle="Avg Validation Rate"
          icon={<Activity className="w-5 h-5 text-emerald-600" />}
          trend="Stable"
          color="emerald"
        />
        <KpiCard 
          title="Total Volume" 
          value={(stats?.total_volume || 0).toLocaleString()} 
          subtitle="Records Ingested"
          icon={<Database className="w-5 h-5 text-purple-600" />}
          trend="+2.4k"
          color="purple"
        />
        <KpiCard 
          title="Critical Alerts" 
          value={stats?.critical_alerts || 0} 
          subtitle="Rejected Records"
          icon={<ShieldAlert className="w-5 h-5 text-rose-600" />}
          trend="-5%"
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Ingestion Zones */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                 <UploadCloud className="w-6 h-6 text-blue-500" />
                 Specialized Ingestion Zones
               </h3>
               <button onClick={fetchStats} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                 <RefreshCw className="w-4 h-4" />
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <UploadZone 
                 title="CDR Ingestion" 
                 type="cdr" 
                 desc="Mandatory Event Data" 
                 isUploading={uploading === 'cdr'}
                 onFileSelect={(f: File) => handleUpload(f, 'cdr')}
                 inputRef={cdrRef}
               />
               <UploadZone 
                 title="SMS Detail" 
                 type="sms_detail" 
                 desc="Optional P2P/A2P Data" 
                 isUploading={uploading === 'sms_detail'}
                 onFileSelect={(f: File) => handleUpload(f, 'sms_detail')}
                 inputRef={smsRef}
               />
               <UploadZone 
                 title="Data Sessions" 
                 type="data_session" 
                 desc="IPDR & Session Logs" 
                 isUploading={uploading === 'data_session'}
                 onFileSelect={(f: File) => handleUpload(f, 'data_session')}
                 inputRef={dataRef}
               />
            </div>
          </div>

          {/* Performance Trends */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm h-80">
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
               <BarChart3 className="w-4 h-4" />
               Batch Performance Trend
             </h3>
             <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={stats?.historical_trend || []}>
                      <defs>
                        <linearGradient id="colorValid" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="timestamp" hide />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="percentage" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValid)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Status & Error Distribution */}
        <div className="space-y-6">
           {/* Current Batch Stats */}
           {lastResult && (
             <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-xl animate-in zoom-in duration-500">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    Latest Batch Result
                  </h4>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg font-mono font-bold">
                    {lastResult.batchId}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-3xl">
                    <p className="text-[10px] uppercase text-slate-400 font-black">Valid</p>
                    <p className="text-xl font-bold">{lastResult.health.valid_records}</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-3xl">
                    <p className="text-[10px] uppercase text-slate-400 font-black">Rejected</p>
                    <p className="text-xl font-bold text-rose-400">{lastResult.health.rejected_records}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                   <p className="text-xs text-slate-400 mb-2 font-medium">Validation Breakdown</p>
                   <div className="space-y-2">
                     {lastResult.errors.length === 0 ? (
                       <p className="text-[11px] text-emerald-400 font-bold italic">Perfect Batch - 100% Quality</p>
                     ) : (
                       lastResult.errors.slice(0, 3).map((err, i) => (
                         <div key={i} className="flex justify-between items-center text-[11px]">
                           <span className="text-slate-300 truncate max-w-[120px]">{err.error_type}</span>
                           <span className="font-bold text-rose-400">{err.affected_count}</span>
                         </div>
                       ))
                     )}
                   </div>
                </div>
             </div>
           )}

           <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
               <PieChartIcon className="w-4 h-4" />
               Global Error Composition
             </h3>
             <div className="h-48">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={stats?.error_distribution || []}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats?.error_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="grid grid-cols-2 gap-2 mt-4">
                {stats?.error_distribution.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>

      {/* Batch History Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 underline decoration-blue-500/30 decoration-4 underline-offset-4">
             Ingestion History
          </h3>
          <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Live Stream</span>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">Batch ID</th>
                  <th className="px-8 py-4">Type</th>
                  <th className="px-8 py-4 text-center">Volume</th>
                  <th className="px-8 py-4 text-center">Status</th>
                  <th className="px-8 py-4 text-center">Pass Rate</th>
                  <th className="px-8 py-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats?.historical_trend.map((batch, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                    <td className="px-8 py-4 font-bold text-slate-900 text-sm font-mono">{batch.batch_id}</td>
                    <td className="px-8 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-[10px] uppercase">
                        {batch.target_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-center text-sm font-medium text-slate-600">{batch.total.toLocaleString()}</td>
                    <td className="px-8 py-4 text-center">
                       {batch.percentage > 95 ? (
                         <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                       ) : (
                         <span className="w-2 h-2 rounded-full bg-amber-500 inline-block shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                       )}
                    </td>
                    <td className="px-8 py-4 text-center">
                       <span className={`text-sm font-black ${batch.percentage > 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                         {batch.percentage}%
                       </span>
                    </td>
                    <td className="px-8 py-4 text-right text-xs font-medium text-slate-400 italic">
                       {batch.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend: string;
  color: 'blue' | 'emerald' | 'purple' | 'rose';
}

function KpiCard({ title, value, subtitle, icon, trend, color }: KpiCardProps) {
  const colorMap: any = {
    blue: 'border-blue-100 text-blue-600 bg-blue-50/30',
    emerald: 'border-emerald-100 text-emerald-600 bg-emerald-50/30',
    purple: 'border-purple-100 text-purple-600 bg-purple-50/30',
    rose: 'border-rose-100 text-rose-600 bg-rose-50/30',
  };
  
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
      <div className="flex justify-between items-start relative z-10">
        <div className={`p-3 rounded-2xl ${colorMap[color]}`}>
          {icon}
        </div>
        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${colorMap[color]}`}>
          {trend}
        </span>
      </div>
      <div className="mt-4 relative z-10">
        <p className="text-3xl font-black text-slate-900">{value}</p>
        <div className="flex flex-col mt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
          <span className="text-[10px] text-slate-300">{subtitle}</span>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
        {icon && <div className="scale-[4]">{icon}</div>}
      </div>
    </div>
  );
}

interface UploadZoneProps {
  title: string;
  type: string;
  desc: string;
  isUploading: boolean;
  onFileSelect: (file: File) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

function UploadZone({ title, type, desc, isUploading, onFileSelect, inputRef }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files.length > 0) onFileSelect(e.dataTransfer.files[0]);
      }}
      className={`
        relative overflow-hidden p-6 rounded-[2rem] border-2 border-dashed transition-all duration-300 cursor-pointer
        ${isDragOver ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}
        ${isUploading ? 'pointer-events-none' : ''}
      `}
      onClick={() => inputRef.current?.click()}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`p-3 rounded-full ${isUploading ? 'bg-blue-100' : 'bg-slate-100 text-slate-400'}`}>
          {isUploading ? (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          ) : (
            <UploadCloud className="w-5 h-5" />
          )}
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{title}</h4>
          <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-widest">{desc}</p>
        </div>
        {isUploading ? (
          <div className="w-full bg-slate-100 rounded-full h-1 mt-2">
            <div className="bg-blue-500 h-1 rounded-full animate-pulse px-2" style={{ width: '40%' }}></div>
          </div>
        ) : (
          <button className="text-[10px] font-black text-blue-600 flex items-center gap-1 group">
            SELECT FILE <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
      <input 
        type="file" 
        className="hidden" 
        ref={inputRef}
        onChange={(e) => {
          if (e.target.files?.length) onFileSelect(e.target.files[0]);
          e.target.value = ''; // Reset
        }} 
      />
    </div>
  );
}
