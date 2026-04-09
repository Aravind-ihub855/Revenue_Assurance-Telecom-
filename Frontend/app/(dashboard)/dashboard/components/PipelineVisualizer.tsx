import { Activity, Shield, Cog, FileSearch, Zap, TrendingUp, ChevronRight } from 'lucide-react';

export default function PipelineVisualizer() {
  const steps = [
    {
      id: 1,
      title: 'Agent 1',
      subtitle: 'DATA INGESTED',
      icon: <FileSearch className="w-6 h-6" />,
      color: 'bg-blue-500',
      shadow: 'shadow-blue-500/20',
    },
    {
      id: 2,
      title: 'Agent 2',
      subtitle: 'MEDIATION LIVE',
      icon: <Cog className="w-6 h-6" />,
      color: 'bg-amber-500',
      shadow: 'shadow-amber-500/20',
    },
    {
      id: 3,
      title: 'Agent 3',
      subtitle: 'RATING ACTIVE',
      icon: <Activity className="w-6 h-6" />,
      color: 'bg-green-500',
      shadow: 'shadow-green-500/20',
    },
    {
      id: 4,
      title: 'Agent 4',
      subtitle: 'ANOMALY DETECTED',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-purple-500',
      shadow: 'shadow-purple-500/20',
    },
    {
      id: 5,
      title: 'Agent 5',
      subtitle: 'ACTION TAKEN',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-rose-500',
      shadow: 'shadow-rose-500/20',
    },
    {
      id: 6,
      title: 'Impact',
      subtitle: 'DASHBOARD LIVE',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-slate-700',
      shadow: 'shadow-slate-700/20',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
          <Activity className="text-white w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">AI Agent Orchestration</h2>
          <p className="text-xs font-bold tracking-widest text-slate-500 uppercase font-mono">Unified Intelligence Pipeline</p>
        </div>
      </div>

      <div className="flex items-center justify-between overflow-x-auto pb-4 custom-scrollbar">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center shrink-0">
            {/* Step Card */}
            <div className={`
              ${step.color} 
              w-40 h-32 rounded-2xl flex flex-col items-center justify-center text-white
              shadow-lg ${step.shadow} transition-transform hover:-translate-y-1 cursor-default
            `}>
              <div className="mb-2 bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                {step.icon}
              </div>
              <h3 className="font-bold text-sm">{step.title}</h3>
              <p className="text-[9px] font-black tracking-widest uppercase mt-1 opacity-90">{step.subtitle}</p>
            </div>

            {/* Connecting Arrow */}
            {index < steps.length - 1 && (
              <div className="w-10 flex justify-center mx-2">
                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
