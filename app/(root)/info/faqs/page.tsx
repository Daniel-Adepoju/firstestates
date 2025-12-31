'use client'
import HeroSection from "@components/Hero"

const faqs = [
  {
    question: "What is First Estates?",
    answer:
      "First Estates is a platform that connects students with property owners and agents, making it easy to find and rent student accommodation.",
  },
  {
    question: "Who can use First Estates?",
    answer:
      "The platform is designed for students looking for accommodation and property owners or agents who want to list student-friendly properties.",
  },
  {
    question: "How do I list a property?",
    answer:
      "Property owners and agents can create an account, add property details, upload images, and publish listings directly on the platform.",
  },
  {
    question: "Is there a fee to use the platform?",
    answer:
      "Browsing properties is free for students. Any applicable fees for property owners will be clearly communicated during the listing process.",
  },
]

const Faqs = () => {
  return (
    <div className="w-full mb-0">
      <HeroSection />

      <main className="container mx-auto px-4 mt-4 mb-10  space-y-12">
        {/* Header */}
        <section className="w-full space-y-4 flex flex-col items-center justify-center">
          <h1 className="subheading">Frequently Asked Questions</h1>

          <article className="w-[98%]  bg-secondary rounded-xl p-6 shadow-md dark:shadow-black">
            <p className="text-base leading-relaxed font-card font-medium">
              Do you have questions? We’ve got answers.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Here are some of the most common questions about using First Estates.
            </p>
          </article>
        </section>

        {/* FAQ List */}
        <section className="w-full space-y-4 flex flex-col items-center justify-center">
          <h2 className="subheading">FAQs</h2>

          <div className="grid gap-4 py-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="w-90 sm:w-100 md:w-130 lg:w-170 bg-secondary rounded-xl p-6 shadow-md dark:shadow-black"
              >
                <summary className="w-full font-semibold">{faq.question}</summary>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Faqs
