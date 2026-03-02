import React from 'react';
import { LayoutGrid, TrendingDown, MousePointer2, DollarSign } from 'lucide-react';

const FunnelStep = ({ label, value, dropoff, color }: any) => (
  <div className="relative flex flex-col items-center group w-full">
    <div className={`w-full h-24 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg transition-all hover:scale-[1.02] ${color}`}>
      <span className="text-xs opacity-80 font-medium uppercase tracking-wider">{label}</span>
      <span className="text-2xl font-black">{value}</span>
    </div>
    {dropoff && (
      <div className="absolute -bottom-8 flex flex-col items-center z-10 animate-bounce">
        <TrendingDown className="w-4 h-4 text-rose-500" />
        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 rounded-full border border-rose-100 italic">
          {dropoff} Drop-off
        </span>
      </div>
    )}
  </div>
);

export default function FunnelBuilder() {
  const steps = [
    { label: 'Visits', value: '12,400', dropoff: '45%', color: 'bg-indigo-600' },
    { label: 'Product View', value: '6,820', dropoff: '72%', color: 'bg-indigo-500' },
    { label: 'Add to Cart', value: '1,910', dropoff: '15%', color: 'bg-indigo-400' },
    { label: 'Purchase', value: '1,623', color: 'bg-emerald-500' },
  ];

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900">CUJ 3: Visual Funnel Optimizer</h2>
          <p className="text-slate-500 text-sm">Identifying friction points with revenue lift projections.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          <div className="flex flex-col">
            <span className="text-[10px] text-emerald-700 uppercase font-bold tracking-tighter">Est. Recovery</span>
            <span className="text-sm font-black text-emerald-900">+$4,250/mo</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-12">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <FunnelStep {...step} />
            {i < steps.length - 1 && (
              <div className="w-12 h-0.5 bg-slate-100 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <MousePointer2 className="w-4 h-4 text-indigo-500" />
            <h3 className="font-bold text-slate-900 text-sm italic underline decoration-indigo-300">AI Friction Detection</h3>
          </div>
          <p className="text-sm text-slate-600 italic">"High drop-off between Product View and Cart. 72% loss detected. <b>Cause:</b> Product page mobile layout has 'Add to Cart' below the fold."</p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
          <div className="flex items-center gap-2 mb-3">
            <LayoutGrid className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-indigo-900 text-sm italic underline decoration-indigo-400">Action Plan</h3>
          </div>
          <p className="text-sm text-indigo-800 italic">"Optimize mobile product layout. Move CTA above fold. <b>Impact:</b> Estimated +18% CVR increase at this stage."</p>
        </div>
      </div>
    </div>
  );
}
