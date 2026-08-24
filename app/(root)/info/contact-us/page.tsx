'use client'

import HeroSection from "@components/Hero"
import { Mail, Phone, ArrowUpRight, MessageCircle } from "lucide-react"

const contactInfo = [
  {
    title: "Email",
    value: "firstestatesng@gmail.com",
    href: "mailto:firstestatesng@gmail.com",
    description: "Send us an email",
    icon: Mail,
  },
  {
    title: "Phone",
    value: "08137955560",
    href: "tel:08137955560",
    description: "Give us a call",
    icon: Phone,
  },
]

const ContactUs = () => {
  return (
    <>
      <HeroSection />

      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl space-y-20">

          {/* Header */}
          <section className="text-center">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              We&apos;re here to help
            </span>

            <h1 className="subheading mb-8">
              Contact Us
            </h1>

            <article className="mx-auto max-w-3xl rounded-2xl border border-border/50 bg-secondary/60 p-6 shadow-sm backdrop-blur-sm md:p-10">
              <p className="text-base leading-7 font-card font-medium md:text-lg">
                We&apos;d love to hear from you.
              </p>

              <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
                Whether you&apos;re a student looking for accommodation or a
                property owner with questions, our team is here to help.
              </p>
            </article>
          </section>

          {/* Contact Information */}
          <section>
            <div className="mb-10 text-center">
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Reach out
              </span>

              <h2 className="subheading">
                Get in Touch
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                Choose whichever option works best for you. Our team will be
                happy to assist you.
              </p>
            </div>

            <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
              {contactInfo.map((item) => {
                const Icon = item.icon

                return (
                  <a
                    key={item.title}
                    href={item.href}
                    className="group rounded-2xl border border-border/50 bg-secondary/60 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background md:p-8"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon size={21} />
                      </div>

                      <ArrowUpRight
                        size={20}
                        className="text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
                      />
                    </div>

                    <h3 className="mt-6 text-lg font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>

                    <p className="mt-4 break-all text-sm font-medium text-primary">
                      {item.value}
                    </p>
                  </a>
                )
              })}
            </div>
          </section>

          {/* Help Section */}
          <section className="rounded-2xl border border-border/50 darkblue-gradient-vertical p-8 text-gray-100 shadow-lg md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/10">
                  <MessageCircle size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold md:text-2xl">
                    Need help with something?
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-gray-200 md:text-base">
                    Whether you need help finding a property, listing one, or
                    understanding how First Estates works, don&apos;t hesitate
                    to reach out.
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </>
  )
}

export default ContactUs