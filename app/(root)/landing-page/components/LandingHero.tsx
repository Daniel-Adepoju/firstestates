"use client"

import Link from "next/link"
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react"
import { useAnimationIntersection } from "@lib/useIntersection"

export default function LandingHero() {
  const copyRef = useAnimationIntersection({ animation: "fade-up" })
  const artRef = useAnimationIntersection({ animation: "burst", threshold: 0.1 })

  return (
    <section className="w-full relative isolate overflow-hidden bg-[#032679] text-white">
      <div className="absolute inset-0 -z-10 dark-to-lightblue-gradient" />
      <div className="absolute inset-0 -z-10 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:46px_46px]" />
      <div className="absolute -right-28 top-24 -z-10 h-80 w-80 rounded-full border border-white/10 bg-blue-400/10 blur-3xl" />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-10 px-5 py-20 sm:gap-12 sm:px-8 sm:py-24 lg:flex-row lg:gap-14 lg:px-12 lg:py-24">
        <div
          ref={copyRef}
          className="flex min-w-0 w-full max-w-3xl flex-1 flex-col items-center text-center lg:items-start lg:text-left"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100 backdrop-blur-sm">
            <Sparkles
              size={15}
              className="text-[#f7b657]"
            />
            Housing, rethought
          </div>
          <h1 className="max-w-3xl font-head text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Your next place is closer than you think.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-blue-50 sm:text-xl lg:mx-0">
            First Estates makes student housing feel less like a hunt and more like a decision.
            Search naturally, compare confidently, and find a home that fits your life.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="#ai-search"
              className="group inline-flex items-center gap-3 rounded-xl bg-[#f7b657] px-5 py-3.5 font-semibold text-[#032679] shadow-lg transition-transform hover:-translate-y-1"
            >
              Try AI-powered search
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Create an account
            </Link>
          </div>
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-blue-100 lg:justify-start">
            <ArrowDown
              size={16}
              className="animate-bounce text-[#f7b657]"
            />
            A better way to begin
          </div>
        </div>

        {/* <div
          ref={artRef}
          className="relative flex min-w-0 w-full max-w-md flex-1 items-center justify-center lg:max-w-lg"
        >
          <div className="absolute -inset-5 rounded-[2.5rem] bg-[#f7b657]/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/25 bg-white/10 p-3 shadow-2xl backdrop-blur-md">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-[#0440c8] lg:aspect-[4/5]">
              <div className="absolute inset-0 bg-[url('/images/house1.jpg')] bg-cover bg-center opacity-90 mix-blend-screen" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#032679] via-[#032679]/20 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/20 bg-[#032679]/75 p-5 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.18em] text-blue-100">
                  A home that feels right
                </p>
                <p className="mt-2 font-head text-2xl font-semibold">Near campus. Within reach.</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full w-4/5 rounded-full bg-[#f7b657]" />
                </div>
                <p className="mt-2 text-xs text-blue-100">Your search, made simpler.</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  )
}
