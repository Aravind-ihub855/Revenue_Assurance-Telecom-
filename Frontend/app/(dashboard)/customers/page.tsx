"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, MoreVertical, Eye, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface Customer {
  customer_id: string;
  msisdn: string;
  name: string;
  email: string;
  gender: string;
  account_type: string;
  location_telecom_circle: string;
  device_type: string;
  billing_cycle_day: number;
  credit_limit: number | null;
  plan_id: string;
  account_status: string;
  activation_date: string;
  deactivation_date: string | null;
  created_at: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/customers/');
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      setCustomers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.msisdn.includes(searchQuery) || 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.customer_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-500 mt-1">Manage and view subscriber accounts and associated anomaly cases.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search MSISDN, Name or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm w-64"
            />
          </div>
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 shadow-sm transition-all">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
             <p className="text-slate-500 font-medium">Loading customers...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-500 font-semibold">{error}</p>
            <button onClick={fetchCustomers} className="mt-4 text-blue-500 hover:underline">Try Again</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">MSISDN</th>
                  <th className="px-6 py-4">Current Plan</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.customer_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{customer.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{customer.customer_id}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">{customer.msisdn}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{customer.plan_id}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{customer.account_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{customer.location_telecom_circle}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         {customer.account_status === 'active' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                         {customer.account_status === 'suspended' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                         {customer.account_status === 'churned' && <AlertCircle className="w-4 h-4 text-rose-500" />}
                         <span className={`text-xs font-bold uppercase tracking-wider
                           ${customer.account_status === 'active' ? 'text-emerald-700' : ''}
                           ${customer.account_status === 'suspended' ? 'text-amber-700' : ''}
                           ${customer.account_status === 'churned' ? 'text-rose-700' : ''}
                         `}>
                           {customer.account_status}
                         </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/customers/${customer.customer_id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors" title="View Detail">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}