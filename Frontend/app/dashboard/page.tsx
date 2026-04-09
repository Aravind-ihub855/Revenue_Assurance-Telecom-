"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Image from 'next/image';
import { Users, LogOut, Activity, BarChart3, Loader2 } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100">
      <nav className="bg-[#0a0c1a] border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left Section: Logo & Titles */}
            <div className="flex items-center gap-6">
              {/* Logo Container */}
              <div className="bg-white rounded-2xl py-2 px-4 flex items-center shadow-xl shadow-white/5 border border-white/10">
                <Image 
                  src="/corp_logo.svg" 
                  alt="CenturyLink Logo" 
                  width={140} 
                  height={40} 
                  className="h-9 w-auto object-contain"
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
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] flex items-center justify-center border-2 border-white/10 shadow-lg shadow-purple-500/10">
                  <span className="text-white font-bold text-xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-white font-bold text-sm tracking-wide">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="group flex items-center justify-end gap-1.5 text-[#3b82f6] hover:text-white text-[10px] font-black tracking-widest uppercase transition-all mt-0.5"
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here is the overview of your telecom sub-systems.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Total Subscribers</h3>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">124,592</p>
            <p className="text-sm text-green-500 font-medium mt-2">+2.4% from last month</p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">System Uptime</h3>
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold">99.98%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">All nodes operational</p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Detected Anomalies</h3>
              <BarChart3 className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-600 dark:text-red-500">14</p>
            <p className="text-sm text-red-500/80 font-medium mt-2">Requires immediate attention</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold">Recent Alerts</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div>
                    <p className="text-sm font-medium">Unusual billing pattern detected in Region {i}</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago via Automated Scan</p>
                  </div>
                </div>
                <button className="text-sm text-primary-600 font-medium hover:text-primary-500">Review</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
