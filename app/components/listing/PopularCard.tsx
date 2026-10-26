import Link from "next/link"
import { CldImage } from "next-cloudinary"
import { Bed, Bath, Toilet, ArrowUpRight } from "lucide-react"
import { CardProps } from "./Card"
import { useAnimation } from "@lib/useAnimation"

interface PopCardProps {
  listing: CardProps["listing"]
  type?: string
  refValue?: any
  isAnimation?: boolean
  wAndH?: string
  showPopular?: boolean
}

const PopularCard = ({ listing, type, refValue, isAnimation = false, wAndH, showPopular = true }: PopCardProps) => {
  const { ref, className: animateClass } = useAnimation({
    threshold: 0.1,
    rootMargin: "0px 0px -80px 0px",
  })
  const href =
    type === "appointment"
      ? `/agent/appointments/${listing?._id}`
      : `/listings/single_listing?id=${listing?._id}`
  return (
    <div
      ref={isAnimation ? (ref as React.RefObject<HTMLDivElement>) : null}
      className={isAnimation ? animateClass : ""}
    >
      <Link
        ref={refValue || null}
        href={href}
        className={`group flex snap-center flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#0881a3]/40 hover:shadow-xl dark:border-white/10 dark:bg-slate-900 ${wAndH || "w-[15rem]"}`}
      >
        <div
          className={`relative w-full overflow-hidden bg-slate-200 dark:bg-slate-800 ${wAndH ? "h-28" : "h-40"}`}
        >
          <CldImage
            fill
            alt={listing?.address || "Popular property"}
            src={listing?.mainImage || ""}
            crop="auto"
            className="object-cover transition duration-500"
          />
          <div className="pointer-events-none absolute inset-0 bg-slate-950/10 transition-colors duration-300 group-hover:bg-slate-950/35" />
          {showPopular && <span className="absolute left-3 top-3 rounded-full bg-[#032679]/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Popular
          </span>}
          <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#032679] shadow-md transition group-hover:bg-[#f29829]">
            <ArrowUpRight size={15} />
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="truncate text-xs font-bold uppercase tracking-[0.14em] text-[#0874c7] dark:text-sky-300">
            {listing?.school || "Nearby"}
          </p>
          <h3 className="truncate font-head text-base font-bold capitalize text-slate-900 dark:text-white">
            {listing?.location}
          </h3>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{listing?.address}</p>
          <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-600 dark:border-white/10 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <Bed
                size={15}
                className="text-[#f29829]"
              />
              {listing?.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath
                size={15}
                className="text-[#f29829]"
              />
              {listing?.bathrooms}
            </span>
            <span className="flex items-center gap-1">
              <Toilet
                size={15}
                className="text-[#f29829]"
              />
              {listing?.toilets}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default PopularCard
