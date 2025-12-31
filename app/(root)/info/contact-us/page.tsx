'use client'
import HeroSection from "@components/Hero"

const contactInfo = [
  {
    title: "Email",
    value: "support@firstestates.com",
    onclick: () => {
      window.location.href = "mailto:support@firstestates.com"
    }
  },
  {
    title: "Phone",
    value: "07012345678",
    onclick: () => {
      window.location.href = "tel:07012345678"
    }
  },
  // {
  //   title: "Office",
  //   value: "123 Student Lane, City, Country",

  // },
]

const ContactUs = () => {
  return (
    <>
      <HeroSection />

      <main className="container mx-auto px-4 space-y-12 md:mb-[-120px]">
        {/* Header */}
        <section className="w-full space-y-4  flex flex-col items-center justify-center">
          <h1 className="subheading">Contact Us</h1>

          <article className="bg-secondary rounded-xl p-6 shadow-md dark:shadow-black">
            <p className="text-base leading-relaxed font-card font-medium">
              We’d love to hear from you.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Whether you’re a student looking for accommodation or a property owner with
              questions, our team is here to help.
            </p>
          </article>
        </section>

        {/* Contact Information */}
        <section className="w-full  space-y-4 flex flex-col items-center justify-center">
          <h2 className="subheading">Get in Touch</h2>
          <div className="text-xs text-gray-400 -mt-3">
            Click either options to email or phone us
          </div>

          <div className="w-full grid gap-3 justify-evenly place-items-center md:grid-cols-[repeat(2,minmax(100px,min-content))]">
            {contactInfo.map((item) => (
              <article
                key={item.title}
                onClick={item.onclick}
                className="w-60 h-30 bg-secondary rounded-xl p-6 shadow-md dark:shadow-black text-center cursor-pointer gloss"
              >
                <h3 className="font-semibold tracking-wide">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{item.value}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        {/* <section className="space-y-4 flex flex-col items-center justify-center">
          <h2 className="subheading">Send Us a Message</h2>

          <article className="bg-secondary rounded-xl p-6 shadow-md dark:shadow-black">
            <form className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Name</label>
                <input
                  type="text"
                  className="w-full mt-1 rounded-lg bg-background border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Email</label>
                <input
                  type="email"
                  className="w-full mt-1 rounded-lg bg-background border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Message</label>
                <textarea
                  rows={4}
                  className="w-full mt-1 rounded-lg bg-background border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Write your message here..."
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition"
              >
                Send Message
              </button>
            </form>
          </article>
        </section> */}
      </main>
    </>
  )
}

export default ContactUs
