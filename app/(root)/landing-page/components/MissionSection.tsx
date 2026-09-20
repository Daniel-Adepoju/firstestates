"use client"

import Link from "next/link"
import { ArrowUpRight, Building2, GraduationCap, UsersRound } from "lucide-react"
import { useAnimationIntersection } from "@lib/useIntersection"

export default function MissionSection() {
  const copyRef = useAnimationIntersection({ animation: "fade-up" })
  const cardsRef = useAnimationIntersection({ animation: "fade-up" })

  return (
    <section className="flex w-full items-center overflow-hidden bg-background px-6 py-20 sm:py-24 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-16">
        <div
          ref={copyRef}
          className="flex w-full max-w-2xl flex-1 flex-col items-center text-center lg:items-start lg:text-left"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            What we are building
          </p>
          <h2 className="mt-4 font-head text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
            Housing should help people feel at home before they move in.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
            We are building a more human housing network for students, agents, and the communities
            around them. Less uncertainty for students. Better visibility for agents. More trust on
            both sides.
          </p>
          <Link
            href="/info/about-us"
            className="group mt-8 inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Learn about First Estates{" "}
            <ArrowUpRight
              size={17}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div
          ref={cardsRef}
          className="flex w-full max-w-2xl flex-1 flex-col gap-4 sm:flex-row sm:flex-wrap"
        >
          <div className="flex min-h-64 flex-1 flex-col rounded-[1.75rem] bg-[#032679] p-7 text-white shadow-xl sm:min-w-[45%] sm:pt-10">
            <GraduationCap
              size={28}
              className="text-[#f7b657]"
            />
            <p className="mt-16 font-head text-3xl font-semibold">For students</p>
            <p className="mt-3 text-sm leading-7 text-blue-100">
              Find a place near the life you are already building, with search that speaks your
              language.
            </p>
          </div>
          <div className="flex min-h-64 flex-1 flex-col rounded-[1.75rem] border border-border/70 bg-secondary/55 p-7 sm:min-w-[45%] dark:bg-secondary/35">
            <Building2
              size={26}
              className="text-primary"
            />
            <p className="mt-10 font-head text-2xl font-semibold text-foreground">For agents</p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Put the right properties in front of the right people and manage every next step.
            </p>
          </div>
          {/* <div className="flex min-h-64 flex-1 flex-col rounded-[1.75rem] border border-[#f7b657]/30 bg-[#f7b657]/10 p-7 sm:min-w-[45%] dark:bg-[#f7b657]/5">
            <UsersRound
              size={26}
              className="text-[#c4770e] dark:text-[#f7b657]"
            />
            <p className="mt-10 font-head text-2xl font-semibold text-foreground">
              For communities
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Make the search for a good home more transparent, connected, and local.
            </p>
          </div> */}
        </div>
      </div>
    </section>
  )
}
