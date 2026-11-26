
"use client"

import Link from "next/link"
import { Check, Coins, Crown, Zap, ArrowRight } from "lucide-react"
import { listingTierItems } from "@lib/constants"

const tierConfig = {
  Standard: {
    Icon: Zap,
    color: "text-sky-500 dark:text-sky-400",
    border: "hover:border-sky-400/50",
    glow: "from-sky-400/10 via-sky-300/20 to-transparent",
    iconBg: "bg-sky-500/10",
    cta: "text-sky-600 dark:text-sky-400",
    check: "text-sky-500 dark:text-sky-400",
  },
  Gold: {
    Icon: Coins,
    color: "text-amber-500 dark:text-amber-400",
    border: "hover:border-amber-400/50",
    glow: "from-amber-400/10 via-yellow-200/20 to-transparent",
    iconBg: "bg-amber-500/10",
    cta: "text-amber-600 dark:text-amber-400",
    check: "text-amber-500 dark:text-amber-400",
  },
  First: {
    Icon: Crown,
    color: "text-violet-500 dark:text-violet-400",
    border: "hover:border-violet-400/50",
    glow: "from-violet-400/10 via-purple-300/20 to-transparent",
    iconBg: "bg-violet-500/10",
    cta: "text-violet-600 dark:text-violet-400",
    check: "text-violet-500 dark:text-violet-400",
  },
}

const ListingTiers = () => (
  <section className="mx-auto w-full max-w-6xl px-4 sm:px-4 py-6">
    {/* Section heading */}
    <div className="mb-10 max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f29829]">
        Choose your reach
      </p>

      <h1 className="mt-3 font-list text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
        Put your property in front of the right people.
      </h1>

      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
        Select a visibility tier based on how quickly you want to reach
        students and renters.
      </p>
    </div>

    {/* Listing tier cards */}
    <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
      {listingTierItems.map((listing) => {
        const config =
          tierConfig[listing.type as keyof typeof tierConfig] ??
          tierConfig.Standard

        const Icon = config.Icon

        return (
          <Link
            href={listing.link}
            key={listing.type}
            className={`
              group relative isolate flex h-full min-h-[340px]
              flex-col overflow-hidden rounded-2xl border
              border-slate-200 bg-white p-6
              transition-all duration-300 ease-out
              hover:-translate-y-1 hover:border-opacity-70
              hover:shadow-lg hover:shadow-slate-900/5
              dark:border-slate-700 dark:bg-slate-800
              dark:hover:border-slate-500
              motion-reduce:transform-none motion-reduce:transition-none
              ${config.border}
            `}
          >
            {/* Gloss animation */}
            <div
              aria-hidden="true"
              className={`
                pointer-events-none absolute -inset-full z-0
                translate-x-[-100%] rotate-12
                bg-gradient-to-r ${config.glow}
                opacity-0 blur-xl
                transition-all duration-1000 ease-in-out
                group-hover:translate-x-[100%]
                group-hover:opacity-100
                motion-reduce:hidden
              `}
            />

            {/* Card content */}
            <div className="relative z-10 flex h-full flex-col">
              {/* Icon and duration */}
              <div className="flex items-center justify-between gap-4">
                <div
                  className={`
                    flex size-12 items-center justify-center
                    rounded-xl ${config.iconBg} ${config.color}
                    transition-transform duration-300
                    group-hover:scale-110
                    motion-reduce:transform-none
                  `}
                >
                  <Icon size={24} strokeWidth={2} />
                </div>

                <span className="rounded-full border border-slate-200 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-600 dark:text-slate-300">
                  {listing.durationDays} days
                </span>
              </div>

              {/* Tier information */}
              <div className="mt-7">
                <h2 className="font-head text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {listing.type}
                </h2>

                <p className={`mt-2 text-2xl font-bold tracking-tight ${config.color}`}>
                  {listing.price}
                </p>
              </div>

              {/* Benefits */}
              <ul className="mt-7 mb-2 flex flex-col gap-3.5">
                {listing.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                  >
                    <Check
                      size={17}
                      strokeWidth={2.5}
                      className={`mt-0.5 shrink-0 ${config.check}`}
                    />

                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div
                className={`
                  mt-auto flex items-center justify-between gap-3
                  border-t border-slate-100 pt-4
                  dark:border-slate-700
                  ${config.cta}
                `}
              >
                <span className="text-sm font-bold">
                  Start with {listing.type}
                </span>

                <span className="flex size-9 items-center justify-center rounded-full transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110">
                  <ArrowRight size={19} strokeWidth={2} />
                </span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  </section>
)

export default ListingTiers
