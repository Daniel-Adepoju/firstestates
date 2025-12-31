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

      <main className="container mx-auto px-4 mt-1 mb-10 space-y-12">
        {/* Header */}
         <section className="w-full space-y-4 flex flex-col items-center justify-center">
          <h1 className="subheading">Privacy Policy</h1>

          <article className="w-[98%] bg-secondary rounded-xl p-6 shadow-md dark:shadow-black">
            <p className="text-base leading-relaxed font-card font-medium">
              Your privacy matters to us.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              This policy explains how First Estates collects, uses, and protects your information.
            </p>
          </article>
        </section>

        {/* Policy Sections */}
       <section className="w-full space-y-4 flex flex-col items-center justify-center">
          <h2 className="subheading">Our Privacy Practices</h2>

          <div className="flex flex-col gap-4 py-4">
            {policies.map((policy, index) => (
              <details
                key={index}
                className="w-86 sm:w-90 md:w-130 lg:w-170 bg-secondary rounded-xl p-6 shadow-md dark:shadow-black"
              >
                <summary className="font-semibold">{policy.title}</summary>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {policy.content}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export default Privacy
