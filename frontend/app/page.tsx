export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-slate-900">🌤️ CRO-Agent</h1>
        <p className="mt-4 text-lg text-slate-600">Phase 1: Foundation in progress.</p>
      </div>
      
      <div className="mt-12 grid gap-6 grid-cols-1 md:grid-cols-2">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-2">Onboarding</h2>
          <p className="text-slate-500">Connect Shopify & Google Ads to get started.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-2">Website Audit</h2>
          <p className="text-slate-500">Enter a URL to generate your first CRO report.</p>
        </div>
      </div>
    </main>
  )
}
