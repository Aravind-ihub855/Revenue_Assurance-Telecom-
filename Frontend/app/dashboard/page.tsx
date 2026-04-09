"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Shield, Users, LogOut, Activity, BarChart3, Loader2 } from 'lucide-react';

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
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 p-2 rounded-xl border border-primary-500/50">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">Century Link Revenue Assurance</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 mr-4">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center border border-primary-200 dark:border-primary-800">
                  <span className="text-primary-700 dark:text-primary-400 font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-sm font-medium hidden md:block">
                  <p className="leading-none">{user?.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
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
