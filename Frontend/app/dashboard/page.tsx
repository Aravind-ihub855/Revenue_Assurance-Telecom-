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

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/users/me');
        setUser(response.data);
      } catch (err) {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="bg-[#0a0c1a] border-b border-gray-800/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left Section: Logo & Titles */}
            <div className="flex items-center gap-6">
              {/* Logo Container */}
              <div className="bg-white rounded-2xl py-2 px-4 flex items-center shadow-xl shadow-white/5 border border-white/10">
                <Image 
                  src="/corp_logo.svg" 
                  alt="CenturyLink Logo" 
                  width={160} 
                  height={40} 
                  priority
                />
              </div>

              {/* Page Titles */}
              <div className="flex flex-col">
                <h2 className="text-white font-bold text-xl leading-snug">Revenue Assurance & Billing Anomaly Detection</h2>
                <p className="text-gray-400 text-sm font-medium">AI-Powered Multi-Agent Platform</p>
              </div>
            </div>

            {/* Right Section: User Profile */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 border-l border-gray-800 pl-6 py-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center border-2 border-white/10 shadow-md">
                  <span className="text-white font-bold text-xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-white font-bold text-sm tracking-wide">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="group flex items-center justify-end gap-1.5 text-blue-400 hover:text-white text-[10px] font-black tracking-widest uppercase transition-all mt-0.5"
                  >
                    SIGN OUT
                    <LogOut className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

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
