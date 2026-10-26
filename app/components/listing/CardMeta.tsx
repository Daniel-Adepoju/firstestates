import { formatNumber } from "@utils/formatNumber"
import { Bed, Home, User } from "lucide-react"

const CardMeta = ({ listing, isAgentCard, isEdit, isAdminCard }: any) => {
  const priceUnitIconMap: any = {
    perPerson: User,
    perRoom: Bed,
    entireUnit: Home,
  }

  const PriceIcon = priceUnitIconMap[listing?.priceUnit]

  return (
    <>
      {/*more content --> listing availability status,school and price*/}
      <div className="card__floating-meta absolute inset-x-3 top-2  flex flex-col items-start gap-2 capitalize">
        {(isAgentCard || isAdminCard) && isEdit && (
          <div
              className={`tag no_absolute ${
              listing?.status === "rented" && "rented"
            } self-start rounded-full border border-white/20 bg-slate-950/55 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md`}
          >
            {listing?.status}
          </div>
        )}

        {!isEdit && (
          <>
            {/* school*/}
            <div
              className="hyphen-auto inline-flex max-w-[72%] truncate items-center justify-center self-start rounded-full border border-white/20 bg-slate-950/55 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md"
            >
              {listing?.school}
            </div>

            {/* price */}

            <div
              className="hyphen-auto inline-flex items-center justify-center gap-1 self-start rounded-xl border border-white/20 bg-white/90 px-3 py-2 tracking-wide text-sm font-black text-[#032679] shadow-lg backdrop-blur-md dark:bg-gray-700 dark:text-white"
            >
              <span className="text-sm">&#8358;{formatNumber(Number(listing?.price) || 0)}</span>
       
              {listing.priceUnit && (
                <PriceIcon
                  size={15}
                  className="text-[#0881a3] dark:text-sky-300"
                />
              )}
            </div>

          </>
        )}
      </div>
    </>
  )
}

export default CardMeta
