"use client"

import HeroSection from "@components/Hero"


const people = [
  {
    name: "David Disu",
    picture:
      "https://th.bing.com/th/id/R.e7e983048934045c740f76fbff8660b4?rik=9zD9iH%2fYoWwNQQ&riu=http%3a%2f%2fimages2.fanpop.com%2fimages%2fphotos%2f7900000%2fJOHN-DOE-john-doe-7969094-2087-2560.jpg&ehk=dKqfE%2bfKIVEQ9raDF%2fINEmNe%2fo7SIK%2fGIajew7crglI%3d&risl=&pid=ImgRaw&r=0",
    role: "COO",
  },
  {
    name: "Isaac Oliboku",
    picture:
      "https://th.bing.com/th/id/R.e7e983048934045c740f76fbff8660b4?rik=9zD9iH%2fYoWwNQQ&riu=http%3a%2f%2fimages2.fanpop.com%2fimages%2fphotos%2f7900000%2fJOHN-DOE-john-doe-7969094-2087-2560.jpg&ehk=dKqfE%2bfKIVEQ9raDF%2fINEmNe%2fo7SIK%2fGIajew7crglI%3d&risl=&pid=ImgRaw&r=0",
    role: "CEO",
  },
  {
    name: "Daniel Adepoju",
    picture:
      "https://th.bing.com/th/id/R.e7e983048934045c740f76fbff8660b4?rik=9zD9iH%2fYoWwNQQ&riu=http%3a%2f%2fimages2.fanpop.com%2fimages%2fphotos%2f7900000%2fJOHN-DOE-john-doe-7969094-2087-2560.jpg&ehk=dKqfE%2bfKIVEQ9raDF%2fINEmNe%2fo7SIK%2fGIajew7crglI%3d&risl=&pid=ImgRaw&r=0",
    role: "CTO",
  },
]

const AboutUs = () => {
  return (
    <>
      <HeroSection />

      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl space-y-20">

          {/* About */}
          <section className="text-center">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Who we are
            </span>

            <h1 className="subheading mb-8">
              About Us
            </h1>

            <div className="mx-auto max-w-3xl rounded-2xl border border-border/50 bg-secondary/60 p-6 shadow-sm backdrop-blur-sm md:p-10">
              <h2 className="mb-4 text-xl font-semibold md:text-2xl">
                Making property search simpler.
              </h2>

              <p className="text-base leading-7 text-muted-foreground md:text-lg">
                First Estates is a platform built to connect property owners,
                agents, and people looking for a place to call home.
              </p>

              <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
                Whether you are listing a property or searching for your next
                home, First Estates makes the process simpler, more accessible,
                and less stressful.
              </p>
            </div>
          </section>

          {/* Mission */}
          <section className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="mt-4 mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                What drives us
              </span>

              <h2 className="subheading mb-3">
                Our Mission
              </h2>

              <p className="text-base leading-8 text-muted-foreground md:text-lg">
                Our mission is to take the stress out of finding and renting
                properties. We want to make property discovery straightforward
                for students and everyone in
                between.
              </p>
            </div>

            <div className="rounded-2xl darkblue-gradient-vertical p-8 text-gray-100 shadow-lg md:p-10">
              <p className="text-xl font-medium leading-8 md:text-2xl">
                "We are certified to satisfy."
              </p>
            </div>
          </section>

          {/* Values */}
          <section className="text-center">
            <span className="mt-4 mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Why First Estates
            </span>

            <h2 className="subheading mb-10">
              Built around people
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Simple",
                  description:
                    "We keep the property search and listing experience straightforward.",
                },
                {
                  title: "Accessible",
                  description:
                    "We make it easier for people to discover properties that fit their needs.",
                },
                {
                  title: "Reliable",
                  description:
                    "We aim to create a platform people can confidently use throughout their property journey.",
                },
              ].map((value) => (
                <article
                  key={value.title}
                  className="rounded-2xl border border-border/50 bg-secondary/50 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="mb-3 text-lg font-semibold">
                    {value.title}
                  </h3>

                  <p className="text-sm leading-6 text-muted-foreground">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
          </section>


       {/* Team */}
   {/* <section className="space-y-6 w-full">
        <h2 className="subheading">Key People</h2>

        <div className="flex items-center justify-evenly gap-8 pb-6">
          {people.map((person) => (
            <article
              key={person.name}
              className="flex flex-col items-center text-center"
            >
              <img
                src={person.picture}
                alt={person.name}
                className="w-24 h-24 rounded-full object-cover shadow-sm"
                loading="lazy"
              />
              <h3 className="mt-3 font-medium">{person.name}</h3>
              <p className="text-sm font-semibold tracking-widest text-gray-600 dark:text-gray-300 uppercase">
                {person.role}
              </p>
            </article>
          ))}
        </div>
      </section>  */}
        </div>
      </main>
    </>
  )
}

export default AboutUs