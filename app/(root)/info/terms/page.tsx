'use client'

import HeroSection from "@components/Hero"

const terms = [
  {
    title: "Use of the Platform",
    content:
      "Our platform is designed to help users find and rent properties. You agree to use it only for lawful purposes and in a way that does not infringe on the rights of others.",
  },
  {
    title: "User Responsibilities",
    content:
      "Users are responsible for ensuring that all information they provide is accurate, current, and complete. Any misuse of the platform may result in suspension or termination of access.",
  },
  {
    title: "Listings and Content",
    content:
      "We do not guarantee the accuracy or availability of property listings. Property owners and agents are solely responsible for the content they post on the platform.",
  },
  {
    title: "Limitation of Liability",
    content:
      "We are not liable for any losses or damages arising from the use of this platform, including disputes between users or inaccurate listings.",
  },
  {
    title: "Changes to These Terms",
    content:
      "We reserve the right to update or modify these Terms and Conditions at any time. Continued use of the platform after changes are made constitutes acceptance of the updated terms.",
  },
  {
    title: "Contact Information",
    content:
      "If you have questions about these Terms and Conditions, please contact our support team.",
  },
]

const Terms = () => {
  return (
    <>
      <HeroSection />

      <main className="container mx-auto px-4 py-12 md:py-10">
        <div className="mx-auto max-w-5xl space-y-20">

          {/* Header */}
          <section className="text-center">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Please read carefully
            </span>

            <h1 className="subheading mb-8">
              Terms & Conditions
            </h1>

            <article className="mx-auto max-w-3xl rounded-2xl border border-border/50 bg-secondary/60 p-6 shadow-sm backdrop-blur-sm md:p-10">
              <p className="text-base leading-7 font-card font-medium md:text-lg">
                By using our platform, you agree to comply with and be bound by these Terms and Conditions.
              </p>

              <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
                Please read them carefully. If you do not agree with any part of these terms, do not use our services.
              </p>
            </article>
          </section>

          {/* Terms */}
          <section>
            <div className="mb-10 text-center">
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Important information
              </span>

              <h2 className="subheading">
                Our Terms
              </h2>
            </div>

            <div className="mx-auto max-w-4xl space-y-4">
              {terms.map((term) => (
                <details
                  key={term.title}
                  className="group rounded-2xl border border-border/50 bg-secondary/60 shadow-sm transition-all duration-300 open:shadow-md"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 font-semibold transition-colors hover:text-primary md:p-7">
                    <span>{term.title}</span>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-lg transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="px-6 pb-6 md:px-7 md:pb-7">
                    <p className="border-t border-border/50 pt-5 text-sm leading-7 text-muted-foreground md:text-base">
                      {term.content}
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

export default Terms