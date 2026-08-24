'use client'

import HeroSection from "@components/Hero"

const policies = [
  {
    title: "Introduction",
    content:
      "First Estates values your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.",
  },
  {
    title: "Information We Collect",
    content:
      "We may collect personal details such as your name, email address, and contact information when you create an account or contact us.",
  },
  {
    title: "How We Use Your Information",
    content:
      "Your information is used to provide and improve our services, communicate with you, and ensure a secure experience on the platform.",
  },
  {
    title: "Sharing of Information",
    content:
      "We do not sell your personal data. Information may only be shared with trusted partners when necessary to operate the platform or comply with legal obligations.",
  },
  {
    title: "Data Security",
    content:
      "We implement appropriate security measures to protect your data against unauthorized access, alteration, or disclosure.",
  },
  {
    title: "Your Rights",
    content:
      "You have the right to access, update, or request deletion of your personal information, subject to applicable laws.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.",
  },
]

const Privacy = () => {
  return (
    <>
      <HeroSection />

      <main className="container mx-auto px-4 py-12 md:py-10">
        <div className="mx-auto max-w-5xl space-y-20">

          {/* Header */}
          <section className="mx-auto text-center">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Your privacy matters
            </span>

            <h1 className="subheading mb-8">
              Privacy Policy
            </h1>

            <article className="mx-auto max-w-3xl rounded-2xl border border-border/50 bg-secondary/60 p-6 shadow-sm backdrop-blur-sm md:p-10">
              <p className="text-base leading-7 font-card font-medium md:text-lg">
                Your privacy matters to us.
              </p>

              <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
                This policy explains how First Estates collects, uses, and protects your information.
              </p>
            </article>
          </section>

          {/* Privacy Practices */}
          <section>
            <div className="mb-10 text-center">
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                How we handle your data
              </span>

              <h2 className="subheading">
                Our Privacy Practices
              </h2>
            </div>

            <div className="mx-auto max-w-4xl space-y-4">
              {policies.map((policy) => (
                <details
                  key={policy.title}
                  className="group rounded-2xl border border-border/50 bg-secondary/60 shadow-sm transition-all duration-300 open:shadow-md"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 font-semibold transition-colors hover:text-primary md:p-7">
                    <span>{policy.title}</span>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-lg transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="px-6 pb-6 md:px-7 md:pb-7">
                    <p className="border-t border-border/50 pt-5 text-sm leading-7 text-muted-foreground md:text-base">
                      {policy.content}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  )
}

export default Privacy