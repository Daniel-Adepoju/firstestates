import { useUser } from "@utils/user"
import Link from "next/link"
import Image from "next/image"
import { CldImage } from "next-cloudinary"
import { useGetFeaturedListings } from "@lib/customApi"
import { ArrowRight, CheckCircle2, MapPin, Sparkles, Star } from "lucide-react"
import { Skeleton } from "@components/ui/skeleton"

const HeroSection = () => {
  const { session } = useUser()
  const { data: featuredData, isLoading: featuredLoading } = useGetFeaturedListings()
  const isAgent = session?.user?.role === "agent"
  const featuredListing = featuredData?.featuredListings?.[0]
  const hasFeaturedListing = Boolean(featuredListing)
  const hasCloudinaryImage = Boolean(
    featuredListing?.mainImage && !featuredListing.mainImage.startsWith("http"),
  )

  return (
    <section className="dark-to-lightblue-gradient relative isolate mb-3 w-full overflow-hidden rounded-b-[2.5rem] text-white shadow-[0_18px_45px_rgba(3,38,121,0.2)]">
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-12 pt-24 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-20 lg:pt-24">
        <div className="animate-[fade-in-up_700ms_ease-out_both] text-center lg:text-left">
          <div className="mb-7 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-100 lg:justify-start">
            <Star
              size={16}
              className="text-[#f7b657]"
            />
            <span>First Estates</span>
          </div>

          <div className="font-head text-4xl font-bold leading-[0.98] sm:text-5xl lg:text-7xl">
            {isAgent ? (
              <>
                <span className="block font-card text-[#f7b657]">List properties</span>
                <span className="block text-white">with confidence.</span>
              </>
            ) : (
              <>
                <span className="block font-card text-[#f7b657]">Find Your Perfect</span>
                <span className="block font-card text-white">Student Home.</span>
              </>
            )}
          </div>

          <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-blue-50 sm:text-lg lg:mx-0">
            {isAgent
              ? "Reach students and renters actively searching for a place to live. Fast listings, smart matches, zero hassle."
              : "Affordable, safe, and verified apartments near your campus. No hidden fees. No stress."}
          </p>

          {isAgent && (
            <Link
              href="/agent"
              className="group mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-[#032679] shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b657]"
            >
              Open agent dashboard
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          )}

          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-blue-50 lg:justify-start">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2
                size={17}
                className="text-[#7ee2a8]"
              />
              {isAgent ? "Easy listing tools" : "Verified properties"}
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2
                size={17}
                className="text-[#f7b657]"
              />
              {isAgent ? "Targeted exposure" : "Campus-friendly locations"}
            </span>
          </div>
        </div>

        {!isAgent && hasFeaturedListing && (
          <Link
            href={
              featuredListing?._id
                ? `/listings/single_listing?id=${featuredListing._id}`
                : "/search"
            }
            className="group relative mx-auto block aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/30 bg-white/10 p-2 shadow-2xl backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b657] lg:ml-auto"
          >
            <div className="relative h-full w-full overflow-hidden rounded-[1.5rem]">
              {hasCloudinaryImage ? (
                <CldImage
                  src={featuredListing.mainImage}
                  alt={featuredListing.address || "Featured home on First Estates"}
                  fill
                  priority
                  crop="fill"
                  className="object-cover transition-transform duration-700 group-hover:scale-101"
                />
              ) : (
                <Image
                  src="/images/house1.jpg"
                  alt="A bright home listed on First Estates"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-101"
                />
              )}
            </div>

            <div className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-2xl border border-white/20 bg-[#032679]/85 px-4 py-3 text-left backdrop-blur-md">
              <div>
                <p className="text-sm font-medium text-blue-100">{featuredListing?.school}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-white">
                  <MapPin
                    size={14}
                    className="text-[#f7b657]"
                  />
                  {featuredListing?.location || featuredListing?.school || "Near your campus"}
                </p>
              </div>
              <div className="text-right">
                <span className="flex items-center justify-end gap-1 text-xs font-semibold text-[#f7b657]">
                  <Star
                    size={13}
                    fill="currentColor"
                  />{" "}
                  Featured
                </span>
                {featuredListing?.price && (
                  <span className="mt-1 block text-xs font-semibold text-white">
                    ₦{Number(featuredListing.price).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </Link>
        )}

        {!isAgent && featuredLoading && (
          <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-sm lg:ml-auto">
            <Skeleton className="h-full w-full rounded-[1.5rem] bg-white/15" />
            <div className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-2xl border border-white/15 bg-[#032679]/55 px-4 py-3 backdrop-blur-md">
              <div className="space-y-2">
                <Skeleton className="h-3 w-28 bg-white/20" />
                <Skeleton className="h-4 w-36 bg-white/20" />
              </div>
              <Skeleton className="h-4 w-16 bg-white/20" />
            </div>
          </div>
        )}

        {!isAgent && !featuredLoading && !hasFeaturedListing && (
          <Link
            href="/search"
            className="group relative mx-auto flex aspect-[4/3] w-full max-w-xl items-center justify-center overflow-hidden rounded-[2rem] border border-white/20 bg-[#032679]/45 p-8 text-center shadow-2xl backdrop-blur-sm transition-colors hover:bg-[#032679]/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b657] lg:ml-auto"
          >
            <div>
              <Star
                size={28}
                className="mx-auto text-[#f7b657]"
              />
              <p className="mt-4 text-lg font-semibold text-white">No featured homes right now</p>
              <p className="mt-2 text-sm leading-6 text-blue-100">
                Browse all available listings and find a place near your campus.
              </p>
              {/* <span className="mt-5 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#032679] transition-transform group-hover:-translate-y-0.5">
                Browse listings
              </span> */}
            </div>
          </Link>
        )}
      </div>
    </section>
  )
}

export default HeroSection
