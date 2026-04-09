"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Image from 'next/image';
import { LogOut, Loader2 } from 'lucide-react';
import OverviewTab from './components/OverviewTab';
import DataAgentTab from './components/DataAgentTab';
import MediationAgentTab from './components/MediationAgentTab';
import RatingEngineTab from './components/RatingEngineTab';
import AnomalyDetectionTab from './components/AnomalyDetectionTab';
import ActionAgentTab from './components/ActionAgentTab';
import ImpactDashboardTab from './components/ImpactDashboardTab';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', number: null },
    { id: 'data-agent', label: 'Data Agent', number: 1 },
    { id: 'mediation-agent', label: 'Mediation Agent', number: 2 },
    { id: 'rating-engine', label: 'Rating Engine', number: 3 },
    { id: 'anomaly-detection', label: 'Anomaly Detection', number: 4 },
    { id: 'action-agent', label: 'Action Agent', number: 5 },
    { id: 'impact-dashboard', label: 'Impact Dashboard', number: null },
  ];

  return (
    <div className="w-full">

      {/* Secondary Tab Navigation (Pill-shaped) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center">
          <div className="bg-white border border-slate-200 rounded-full p-1.5 flex items-center gap-1 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
                  ${activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-md scale-105 z-10' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }
                `}
              >
                {tab.label}
                {tab.number && (
                  <span className={`
                    flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold
                    ${activeTab === tab.id ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-500'}
                  `}>
                    {tab.number}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'data-agent' && <DataAgentTab />}
        {activeTab === 'mediation-agent' && <MediationAgentTab />}
        {activeTab === 'rating-engine' && <RatingEngineTab />}
        {activeTab === 'anomaly-detection' && <AnomalyDetectionTab />}
        {activeTab === 'action-agent' && <ActionAgentTab />}
        {activeTab === 'impact-dashboard' && <ImpactDashboardTab />}
      </main>
    </div>
  );
}
