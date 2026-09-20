"use client"

import Link from "next/link"
import { ArrowRight, Compass, HeartHandshake, Search, ShieldCheck } from "lucide-react"
import { useAnimationIntersection } from "@lib/useIntersection"

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Describe your search",
    text: "Start with a sentence. Tell us where you want to live, what you can spend, and what matters.",
  },
  {
    number: "02",
    icon: Compass,
    title: "Explore the right fit",
    text: "Compare real listings around your school, with the context you need to choose well.",
  },
  {
    number: "03",
    icon: HeartHandshake,
    title: "Move forward together",
    text: "Chat with agents, request co-rent arrangements, and schedule an inspection when you are ready.",
  },
]

export default function HowItWorksSection() {
  const sectionRef = useAnimationIntersection({ animation: "fade-up" })

  return (
    <section className="flex w-full items-center border-y border-border/60 bg-secondary/45 px-6 py-20 sm:py-24 lg:px-12 dark:bg-secondary/30">
      <div
        ref={sectionRef}
        className="mx-auto w-full max-w-7xl"
      >
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              From maybe to move-in
            </p>
            <h2 className="mt-4 font-head text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
              A clearer path to your next address.
            </h2>
          </div>
          <Link
            href="/search"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            Explore listings{" "}
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="mt-12 flex flex-col gap-5 lg:flex-row">
          {steps.map(({ number, icon: Icon, title, text }) => (
            <article
              key={number}
              className="relative flex min-h-64 flex-1 flex-col rounded-[1.75rem] border border-border/70 bg-background/65 p-7 shadow-sm transition-transform hover:-translate-y-1 dark:bg-background/55"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon size={22} />
                </div>
                <span className="font-head text-4xl font-semibold text-border dark:text-muted">
                  {number}
                </span>
              </div>
              <h3 className="mt-8 font-head text-2xl font-semibold text-foreground">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-7 flex items-center gap-3 rounded-2xl border border-greenPrimary/20 bg-greenPrimary/5 p-4 text-sm text-foreground">
          <ShieldCheck
            className="shrink-0 text-greenPrimary"
            size={21}
          />
          Every better housing decision starts with better information.
        </div>
      </div>
    </section>
  )
}
