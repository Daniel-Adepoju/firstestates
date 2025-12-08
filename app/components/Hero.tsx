import { useUser } from "@utils/user"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

const HeroSection = () => {
  const { session } = useUser()
  const role = session?.user?.role

  return (
    <section className="darkblue-gradient w-full dark:text-white rounded-b-4xl mx-auto mb-3 relative min-h-[30vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern-grid.svg')] bg-repeat"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-24 pb-4 z-10">
        <div className="writeName font-bold text-white text-3xl">First Estates</div>
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="space-y-6 text-center lg:text-left">
            {role === "agent" ? (
              <>
                <div className="w-full flex flex-col  text-4xl md:text-5xl lg:text-6xl font-bold text-gray-100 leading-tight">
                  <span className="gold-gradient-text">List Properties</span>
                  <span className="blue-gradient-text">Confidently</span>
                </div>

                <p className="dark:text-white text-lg md:text-xl text-gray-100 max-w-lg mx-auto lg:mx-0">
                  Easily reach students and renters actively searching for apartments.
                  <span className="block mt-2 font-medium">
                    Fast listings. Smart matches. Zero hassle.
                  </span>
                </p>
                <Link
                  href="/agent"
                  className="smallScale w-60 flex items-center gap-1 clickable py-3 px-4
         text-gray-100 bg-darkblue rounded-md shadow-md"
                >
                  <span>Proceed To Dashboard</span>
                  <ArrowRightIcon size={25} />
                </Link>
                <div className="text-gray-100 flex flex-wrap justify-center lg:justify-start items-center gap-4 pt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">Easy Listing Tools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">Targeted Exposure</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-full flex flex-col  text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="w-full gold-gradient-text">Find Your Perfect</span>
                  <span className="w-full blue-gradient-text">Student Home</span>
                </div>

                <p className="dark:text-white text-lg md:text-xl text-gray-100 max-w-lg mx-auto lg:mx-0">
                  Affordable, safe, and verified apartments near your campus.
                  <span className="block mt-2 font-medium">No hidden fees. No stress.</span>
                </p>

                <div className="text-gray-100 flex flex-wrap justify-center lg:justify-start items-center gap-4 pt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">Verified Properties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">24/7 Support</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
