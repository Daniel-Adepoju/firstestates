"use client"

import Link from "next/link"
import { Check, Coins, Crown, Zap, ArrowRight } from "lucide-react"
import { listingTierItems } from "@lib/constants"

const tierIcon = { Standard: Zap, Gold: Coins, First: Crown }

const ListingTiers = () => (
  <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
    <div className="mb-8 max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f29829]">Choose your reach</p>
      <h1 className="mt-2 font-head text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Put your property in front of the right people.</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">Select a visibility tier based on how quickly you want to reach students and renters.</p>
    </div>
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {listingTierItems.map((listing) => {
        const Icon = tierIcon[listing.type as keyof typeof tierIcon]
        const modifier = listing.type === "Gold" ? "tier-card--gold" : listing.type === "First" ? "tier-card--first" : ""
        return <Link href={listing.link} key={listing.type} className={`tier-card ${modifier} group`}>
          <div className="flex items-start justify-between gap-4"><span className="tier-card__icon"><Icon size={24} /></span><span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:bg-white/10 dark:text-slate-300">{listing.durationDays} days</span></div>
          <h2 className="mt-6 font-head text-2xl font-bold text-slate-900 dark:text-white">{listing.type}</h2>
          <p className={`mt-2 text-xl font-bold ${listing.color}`}>{listing.price}</p>
          <ul className="mt-6 flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300">{listing.benefits.map((benefit) => <li key={benefit} className="flex gap-2"><Check size={17} className="mt-0.5 shrink-0 text-emerald-500" />{benefit}</li>)}</ul>
          <span className="mt-auto flex items-center gap-2 pt-7 text-sm font-bold text-[#0874c7] dark:text-sky-300">Start with {listing.type}<ArrowRight size={17} className="transition group-hover:translate-x-1" /></span>
        </Link>
      })}
    </div>
  </section>
)

export default ListingTiers
