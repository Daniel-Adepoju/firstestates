'use client'
import HeroSection from "@components/Hero"

const people = [
  {
    name: "John Doe",
    picture:
      "https://th.bing.com/th/id/R.e7e983048934045c740f76fbff8660b4?rik=9zD9iH%2fYoWwNQQ&riu=http%3a%2f%2fimages2.fanpop.com%2fimages%2fphotos%2f7900000%2fJOHN-DOE-john-doe-7969094-2087-2560.jpg&ehk=dKqfE%2bfKIVEQ9raDF%2fINEmNe%2fo7SIK%2fGIajew7crglI%3d&risl=&pid=ImgRaw&r=0",
    role: "COO",
  },
  {
    name: "Second Doe",
    picture:
      "https://th.bing.com/th/id/R.e7e983048934045c740f76fbff8660b4?rik=9zD9iH%2fYoWwNQQ&riu=http%3a%2f%2fimages2.fanpop.com%2fimages%2fphotos%2f7900000%2fJOHN-DOE-john-doe-7969094-2087-2560.jpg&ehk=dKqfE%2bfKIVEQ9raDF%2fINEmNe%2fo7SIK%2fGIajew7crglI%3d&risl=&pid=ImgRaw&r=0",
    role: "CEO",
  },
  {
    name: "Last Joe",
    picture:
      "https://th.bing.com/th/id/R.e7e983048934045c740f76fbff8660b4?rik=9zD9iH%2fYoWwNQQ&riu=http%3a%2f%2fimages2.fanpop.com%2fimages%2fphotos%2f7900000%2fJOHN-DOE-john-doe-7969094-2087-2560.jpg&ehk=dKqfE%2bfKIVEQ9raDF%2fINEmNe%2fo7SIK%2fGIajew7crglI%3d&risl=&pid=ImgRaw&r=0",
    role: "CTO",
  },
]

const AboutUs = () => {
  return (
    <>
          <HeroSection />
     <main className="container  mx-auto px-4 my-2 space-y-12">

      {/* Header */}
      <section className="w-full space-y-4 flex flex-col items-center justify-center">
        <h1 className="subheading">About Us</h1>

        <article className="bg-secondary rounded-xl p-6 shadow-md dark:shadow-black">
          <p className="text-base leading-relaxed font-card font-medium">
            First Estates is a platform that connects property owners with tenants.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            The First Estates student home platform provides a seamless way for property owners to
            list properties and for students to find and rent them.
          </p>
        </article>
      </section>

      {/* Mission */}
      <section className="w-full space-y-4 flex flex-col items-center justify-center">
        <h2 className="subheading">Our Mission</h2>

        <article className="bg-secondary rounded-xl p-6 shadow-md dark:shadow-black">
          <p className="text-sm leading-relaxed">
        Our mission is to take the stress out of finding and renting properties, for students and everyone else.
          </p>
        </article>
      </section>

      {/* Team */}
      <section className="space-y-6 w-full">
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
      </section>
    </main>
    </>
   
  )
}

export default AboutUs
