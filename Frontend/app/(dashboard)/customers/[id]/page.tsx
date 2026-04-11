"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, User, Phone, MapPin, Activity, AlertTriangle, Receipt, CreditCard, Mail, Calendar, Smartphone, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

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

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/customers/${id}`);
      setCustomer(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      <p className="text-slate-500 font-medium">Loading subscriber 360 view...</p>
    </div>
  );

  if (error || !customer) return (
    <div className="p-8 max-w-7xl mx-auto text-center">
       <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
       <h2 className="text-2xl font-bold text-slate-900">Error</h2>
       <p className="text-slate-500 mt-2">{error || "Customer data unavailable"}</p>
       <Link href="/customers" className="mt-6 inline-block text-blue-600 font-semibold hover:underline">Back to Customers</Link>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Link href="/customers" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group">
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Customers
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            {customer.name}
            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border
              ${customer.account_status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}
            `}>
              {customer.account_status}
            </span>
          </h1>
          <p className="text-slate-500 mt-2 font-mono text-sm tracking-tight">{customer.customer_id} • {customer.msisdn}</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
             Simulate Billing
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-colors">
             Generate 360 Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Left Column: Account Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-5">Subscriber Profile</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                   <User className="w-5 h-5 text-slate-400" />
                 </div>
                 <div className="flex-1">
                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Gender / Demography</p>
                   <p className="font-semibold text-slate-900">{customer.gender === 'M' ? 'Male' : 'Female'}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                   <Mail className="w-5 h-5 text-slate-400" />
                 </div>
                 <div className="flex-1">
                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Email Address</p>
                   <p className="font-semibold text-slate-900 truncate max-w-[180px]">{customer.email}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                   <MapPin className="w-5 h-5 text-slate-400" />
                 </div>
                 <div className="flex-1">
                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Telecom Circle</p>
                   <p className="font-semibold text-slate-900">{customer.location_telecom_circle}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                   <Smartphone className="w-5 h-5 text-slate-400" />
                 </div>
                 <div className="flex-1">
                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Device Fingerprint</p>
                   <p className="font-semibold text-slate-900 capitalize">{customer.device_type}</p>
                 </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
               <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Current Plan</p>
                      <p className="font-bold text-blue-900 text-sm">{customer.plan_id}</p>
                    </div>
                  </div>
                  <Link href={`/tariffs/${customer.plan_id}`} className="text-[11px] font-bold text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
                    Matrix
                  </Link>
               </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-5">Timeline</h3>
            <div className="space-y-4">
               <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
                     <div className="w-0.5 h-10 bg-slate-100"></div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Activation</p>
                    <p className="text-sm font-semibold text-slate-900">{new Date(customer.activation_date).toLocaleDateString()}</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                     <div className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Billing Cycle</p>
                    <p className="text-sm font-semibold text-slate-900">Day {customer.billing_cycle_day} of Month</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financials & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
               <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-inner">
                 <Activity className="w-6 h-6 text-indigo-500" />
               </div>
               <div>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Credit Limit</p>
                 <p className="text-3xl font-black text-slate-900 mt-1">
                   {customer.credit_limit ? `₹${customer.credit_limit}` : 'N/A'}
                 </p>
                 <p className="text-[11px] text-slate-500 font-medium mt-1">Verified {customer.account_type} account</p>
               </div>
             </div>
             
             <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-5 relative overflow-hidden group">
               <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
               <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                 <Receipt className="w-6 h-6 text-blue-400" />
               </div>
               <div className="relative z-10">
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Account Type</p>
                 <p className="text-3xl font-black text-white mt-1 capitalize">{customer.account_type}</p>
                 <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-tighter">Financial Health Stable</p>
                 </div>
               </div>
             </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Discrepancy Ledger 
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black">MOCK VIEW</span>
              </h3>
              <button className="text-xs text-blue-600 font-bold hover:underline">Full Analysis</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Event Date</th>
                    <th className="px-6 py-4">Detection Type</th>
                    <th className="px-6 py-4 text-right">Potential Leakage</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-6 py-5 text-slate-500 font-medium">Apr 10, 2024</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">Tariff Mismatch</span>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Data Session Validation</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right font-black text-rose-600">₹1,240.00</td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">Investigating</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-6 py-5 text-slate-500 font-medium">Mar 15, 2024</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">Duplicate CDR</span>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Rating Engine Audit</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right font-black text-emerald-600">₹15.50</td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">Resolved</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
