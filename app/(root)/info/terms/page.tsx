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

      <main className="container mx-auto px-4 mt-1 mb-10 space-y-12">
        {/* Header */}
        <section className="w-full space-y-4 flex flex-col items-center justify-center">
          <h1 className="subheading">Terms & Conditions</h1>

          <article className="w-[98%] bg-secondary rounded-xl p-6 shadow-md dark:shadow-black">
            <p className="text-base leading-relaxed font-card font-medium">
              By using our platform, you agree to comply with and be bound by these Terms and Conditions.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Please read them carefully. If you do not agree with any part of these terms, do not use our services.
            </p>
          </article>
        </section>

        {/* Terms Sections */}
        <section className="w-full space-y-4 flex flex-col items-center justify-center">
          <h2 className="subheading">Our Terms</h2>

          <div className="flex flex-col gap-4 py-4">
            {terms.map((term, index) => (
              <details
                key={index}
                className="w-90 sm:w-100 md:w-130 lg:w-170 bg-secondary rounded-xl p-6 shadow-md dark:shadow-black"
              >
                <summary className="font-semibold">{term.title}</summary>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {term.content}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export default Terms
