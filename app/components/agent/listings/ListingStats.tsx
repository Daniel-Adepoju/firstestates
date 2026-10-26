"use client"

import { Building2, KeyRound, TrendingUp } from "lucide-react"

export default function ListingStats({ data, formatNumber, isLoading = false }: any) {
  const stats = [
    { label: "Currently rented", value: data?.currentRentings, icon: KeyRound, tone: "from-[#f29829] to-[#d56e16]", note: "Homes with residents" },
    { label: "All listings", value: data?.currentListings, icon: Building2, tone: "from-[#0874c7] to-[#032679]", note: "Across your portfolio" },
  ]
  return <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
    {stats.map(({ label, value, icon: Icon, tone, note }) => <article key={label} className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0d1b30] p-5 text-white shadow-xl shadow-slate-950/15">
      <div className={`absolute inset-0 bg-gradient-to-br ${tone} opacity-90 transition duration-300 group-hover:opacity-100`} />
      <div className="relative flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-white/65">{label}</p><p className="mt-3 font-head text-4xl font-bold tracking-tight">{isLoading || value == null ? "-" : formatNumber(value)}</p><p className="mt-1 text-xs text-white/65">{note}</p></div><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur"><Icon size={24} /></span></div>
      <div className="relative mt-6 flex items-center gap-1 text-xs font-semibold text-white/75"><TrendingUp size={14} /> Live account snapshot</div>
    </article>)}
  </section>
}
