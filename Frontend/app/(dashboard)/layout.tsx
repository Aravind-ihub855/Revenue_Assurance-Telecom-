"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut, Loader2, LayoutDashboard, Users, FileText, ChevronRight, ChevronLeft } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Customers', icon: Users, href: '/customers' },
    { label: 'Tariff Plans', icon: FileText, href: '/tariffs' },
    { label: 'Lifecycle Data', icon: FileText, href: '/lifecycle' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      {/* Top Navbar */}
      <nav className="bg-[#0a0c1a] border-b border-gray-800/60 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
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

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`
            bg-white border-r border-slate-200 transition-all duration-300 flex flex-col relative z-40
            ${isSidebarOpen ? 'w-64' : 'w-20'}
          `}
        >
          {/* Toggle Button */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-3 top-8 bg-white border border-slate-200 rounded-full p-1.5 shadow-sm text-slate-500 hover:text-slate-900 transition-colors z-50 flex items-center justify-center h-6 w-6"
          >
            {isSidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          <div className="py-8 flex flex-col gap-2 px-3 overflow-hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`
                    flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group relative
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span 
                    className={`
                      font-semibold text-sm whitespace-nowrap transition-opacity duration-300
                      ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}
                    `}
                  >
                    {item.label}
                  </span>
                  
                  {/* Tooltip on collapse */}
                  {!isSidebarOpen && (
                    <div className="absolute left-full ml-4 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
                      {item.label}
                      <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
