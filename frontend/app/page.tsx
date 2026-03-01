'use client';

import React, { useState } from 'react';
import { Search, Activity, BarChart3, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const runAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/audit/scan?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">🌤️ CRO-Agent</h1>
            <p className="text-slate-500">Intelligent Conversion Optimization</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition">Connect Shopify</button>
            <button className="bg-indigo-600 px-4 py-2 rounded-lg text-white text-sm font-medium hover:bg-indigo-700 transition">Upgrade Plan</button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Avg. CVR', value: '3.2%', change: '+0.4%', icon: Activity },
            { label: 'AOV', value: '$84.50', change: '+12%', icon: BarChart3 },
            { label: 'Revenue Lift', value: '$12.4k', change: 'This Month', icon: AlertCircle },
            { label: 'Active Funnels', value: '4', change: 'All Running', icon: Search },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <stat.icon className="w-5 h-5 text-indigo-500" />
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{stat.change}</span>
              </div>
              <p className="text-slate-500 text-sm mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Audit Tool */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Website CRO Audit</h2>
          <div className="flex gap-4 mb-8">
            <input 
              type="text" 
              placeholder="Enter store URL (e.g. brand.com)" 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button 
              onClick={runAudit}
              disabled={loading}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 transition"
            >
              {loading ? 'Analyzing...' : 'Run Audit'}
            </button>
          </div>

          {report && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Prioritized Findings
                  </h3>
                  <ul className="space-y-3">
                    {report.conversion_issues.map((issue: string, i: number) => (
                      <li key={i} className="text-sm text-slate-600 flex gap-3 italic">
                        <span className="text-indigo-500 font-bold">•</span> {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                  <h3 className="font-semibold text-indigo-900 mb-2">Estimated Uplift</h3>
                  <p className="text-3xl font-black text-indigo-600">{report.uplift_estimate}</p>
                  <p className="text-xs text-indigo-700 mt-2 italic">Based on AI benchmarking and competitive analysis.</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-inner">
                  <h3 className="font-semibold text-slate-900 mb-2 text-sm uppercase tracking-wider">AI Summary</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{report.ai_summary}</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
