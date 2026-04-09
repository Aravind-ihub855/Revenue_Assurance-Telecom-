"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Shield, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-500/10 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 relative z-10 transition-all">
        <div className="text-center mb-10">
          <div className="bg-primary-50 dark:bg-primary-900/40 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-100 dark:border-primary-900 border-b-4">
            <Shield className="w-8 h-8 text-primary-600 dark:text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Century Link Portal</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Revenue Assurance & Billing Anomaly System</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Corporate Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder-gray-400"
              placeholder="user@centurylink.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder-gray-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-primary-500/20 disabled:opacity-70 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Sign In Securely
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          Don't have an enterprise account?{' '}
          <Link href="/signup" className="text-primary-600 hover:text-primary-400 font-semibold transition-colors">Request Access</Link>
        </p>
      </div>
    </div>
  );
}
