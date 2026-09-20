"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { useAnimationIntersection } from "@lib/useIntersection"

export default function LandingCTA() {
  const sectionRef = useAnimationIntersection({ animation: "burst" })

  return (
    <section className="flex w-full items-center px-6 pb-20 pt-4 sm:pb-24 lg:px-12">
      <div
        ref={sectionRef}
        className="dark-to-lightblue-gradient relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-6 py-14 text-center text-white shadow-xl sm:px-12 sm:py-20"
      >
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/20 bg-white/10 blur-2xl" />
        <Sparkles
          className="mx-auto text-[#f7b657]"
          size={28}
        />
        <h2 className="relative mt-5 font-head text-4xl font-semibold sm:text-6xl">
          The right home changes everything.
        </h2>
        <p className="relative mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-50 sm:text-lg">
          Begin with a question. Leave with a clearer next step.
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/search"
            className="group inline-flex items-center gap-3 rounded-xl bg-[#f7b657] px-5 py-3.5 font-semibold text-[#032679] transition-transform hover:-translate-y-1"
          >
            Find a home{" "}
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/signup/agent"
            className="inline-flex items-center rounded-xl border border-white/30 px-5 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
          >
            List a property
          </Link>
        </div>
      </div>
    </section>
  )
}
