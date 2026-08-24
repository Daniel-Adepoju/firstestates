// 'use client'
// import HeroSection from "@components/Hero"

// const faqs = [
//   {
//     question: "What is First Estates?",
//     answer:
//       "First Estates is a platform that connects students with property owners and agents, making it easy to find and rent student accommodation.",
//   },
//   {
//     question: "Who can use First Estates?",
//     answer:
//       "The platform is designed for students looking for accommodation and property owners or agents who want to list student-friendly properties.",
//   },
//   {
//     question: "How do I list a property?",
//     answer:
//       "Property owners and agents can create an account, add property details, upload images, and publish listings directly on the platform.",
//   },
//   {
//     question: "Is there a fee to use the platform?",
//     answer:
//       "Browsing properties is free for students. Any applicable fees for property owners will be clearly communicated during the listing process.",
//   },
// ]

// const Faqs = () => {
//   return (
//     <div className="w-full mb-0">
//       <HeroSection />

//       <main className="container mx-auto px-4 mt-4 mb-10  space-y-12">
//         {/* Header */}
//         <section className="w-full space-y-4 flex flex-col items-center justify-center">
//           <h1 className="subheading">Frequently Asked Questions</h1>

//           <article className="w-[98%]  bg-secondary rounded-xl p-6 shadow-md dark:shadow-black">
//             <p className="text-base leading-relaxed font-card font-medium">
//               Do you have questions? We’ve got answers.
//             </p>
//             <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
//               Here are some of the most common questions about using First Estates.
//             </p>
//           </article>
//         </section>

//         {/* FAQ List */}
//         <section className="w-full space-y-4 flex flex-col items-center justify-center">
//           <h2 className="subheading">FAQs</h2>

//           <div className="grid gap-4 py-4">
//             {faqs.map((faq, index) => (
//               <details
//                 key={index}
//                 className="w-90 sm:w-100 md:w-130 lg:w-170 bg-secondary rounded-xl p-6 shadow-md dark:shadow-black"
//               >
//                 <summary className="w-full font-semibold">{faq.question}</summary>
//                 <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
//                   {faq.answer}
//                 </p>
//               </details>
//             ))}
//           </div>
//         </section>
//       </main>
//     </div>
//   )
// }

// export default Faqs

"use client"

import Link from "next/link"
import HeroSection from "@components/Hero"
import { ArrowUpRight, HelpCircle, MessageCircle } from "lucide-react"

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
    question: "What to do in the agent dashboard?",
    answer: [
      "1. Log in and use the Home page to review your agent profile and payment information.",
      "2. Open Listings to add new properties, view your published listings, edit their details, search by school or location, and filter by date, views, or availability.",
      "3. Use Manage Residents to add a registered student to one of your properties or remove a resident when necessary.",
      "4. Open Manage Requests to review pending roommate and co-rent requests, accept suitable requests, decline them, and review accepted requests.",
      "5. Use Chats to communicate with clients about listings and use Messages to read platform notifications, including request and listing updates.",
      "6. Open Appointments to search your listings by school or location and schedule property inspections with clients.",
      "7. Review pending inspections, upcoming and previous inspection dates, and remove appointments that are no longer needed. Appointment reminders are sent before the due date, while expired appointments are removed weekly.",
      "8. Use Settings to update your agent profile and account details.",
    ].join("\n"),
  },
  {
    question: "How do I list a property?",
    answer:
      "Property owners and agents can create an account, add property details, upload images, and publish listings directly on the platform.",
  },
 {
  question: "How do co-rent requests work?",
  answer:
    "Co-rent requests allow students from the same school to request to rent a property together. Once a request is submitted, the property owner or agent can review it and choose to accept or reject the request.",
},
  {
    question: "Is there a fee to use the platform?",
    answer:
      "Browsing properties is free for students. Any applicable fees for property owners will be clearly communicated during the listing process.",
  },
]

const Faqs = () => {
  return (
    <>
      <HeroSection />

      <main className="container mx-auto px-4 py-12 md:py-10">
        <div className="mx-auto max-w-5xl space-y-20">
          {/* Header */}
          <section className="text-center">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Need some answers?
            </span>

            <h1 className="subheading mb-8">Frequently Asked Questions</h1>

            <article className="mx-auto max-w-3xl rounded-2xl border border-border/50 bg-secondary/60 p-6 shadow-sm backdrop-blur-sm md:p-10">
              <p className="text-base leading-7 font-card font-medium md:text-lg">
                Do you have questions? We&apos;ve got answers.
              </p>

              <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
                Here are some of the most common questions about using First Estates.
              </p>
            </article>
          </section>

          {/* FAQ List */}
          <section>
            <div className="mb-10 text-center">
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Find what you need
              </span>

              <h2 className="subheading">FAQs</h2>
            </div>

            <div className="mx-auto max-w-4xl space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-border/50 bg-secondary/60 shadow-sm transition-all duration-300 open:shadow-md"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-4 p-6 font-semibold transition-colors hover:text-primary md:p-7">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <HelpCircle size={18} />
                    </span>

                    <span className="flex-1">{faq.question}</span>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-lg transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="px-6 pb-6 md:px-7 md:pb-7">
                    <p className="whitespace-pre-line border-t border-border/50 pt-5 pl-13 text-sm leading-7 text-muted-foreground md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Contact CTA */}
          <section className="rounded-2xl border border-border/50 darkblue-gradient-vertical p-8 text-white shadow-lg md:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/10">
                  <MessageCircle size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold md:text-2xl">Still have questions?</h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-gray-200 md:text-base">
                    If you couldn&apos;t find the answer you were looking for, our team is happy to
                    help.
                  </p>
                </div>
              </div>

              <Link
                href="/info/contact-us"
                className="text-gray-700 group inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2 focus:ring-offset-primary"
              >
                Contact Us
                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default Faqs
