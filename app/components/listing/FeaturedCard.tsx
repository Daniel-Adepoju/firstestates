"use client"

import Image from "next/image"
import Link from "next/link"
import { CldImage } from "next-cloudinary"
import { MapPin, ArrowUpRight, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatNumber } from "@utils/formatNumber"
import { truncateText } from "@utils/truncateText"
import { CardProps } from "./Card"

const FeaturedCard = ({ listing, isAgentCard }: CardProps) => {
  const router = useRouter()
  const hasCloudinaryImage = Boolean(listing?.mainImage && !listing.mainImage.startsWith("http"))

  return (
    <article onClick={() => router.push(`/listings/single_listing?id=${listing?._id}`)} className="group relative min-h-[23rem] cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/25 bg-slate-950 shadow-2xl shadow-blue-950/25">
      <div className="absolute inset-0">
        {hasCloudinaryImage ? (
          <CldImage fill src={listing.mainImage} alt={listing.address || "Featured property"} crop="fill" className="object-cover transition duration-700" />
        ) : (
          <Image fill src="/images/house1.jpg" alt="Featured property" sizes="(max-width: 768px) 92vw, 33vw" className="object-cover transition duration-700" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#06132d] via-[#06132d]/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#032679] shadow-lg backdrop-blur"><Star size={13} fill="currentColor" /> Featured</div>
      <div className="absolute inset-x-5 bottom-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f7b657]">{listing?.school || "Student living"}</p>
        <h3 className="mt-2 max-w-[18rem] font-head text-2xl font-bold leading-tight">{listing?.location || "A better place to live"}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-blue-100"><MapPin size={15} className="shrink-0 text-[#f7b657]" />{truncateText(listing?.address || "Near your campus", 42)}</p>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div><p className="text-xs text-blue-100">From</p><p className="font-head text-xl font-bold">₦{formatNumber(Number(listing?.price) || 0)}</p></div>
          {!isAgentCard && listing?.agent && <Link href={`/agent-view/${listing.agent._id}`} onClick={(event) => event.stopPropagation()} className="flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-2 py-1.5 text-xs text-white backdrop-blur hover:bg-black/35"><CldImage width={24} height={24} crop="auto" src={listing.agent.profilePic} alt="Agent profile" className="rounded-full object-cover" /><span className="max-w-24 truncate">{listing.agent.username}</span></Link>}
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#032679] transition group-hover:-rotate-45"><ArrowUpRight size={19} /></span>
        </div>
      </div>
    </article>
  )
}

export default FeaturedCard
