"use client"

import { ArrowLeft, CalendarDays, Flag, Share2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@utils/Toast"
import ListingTourActionBar from "./ListingTourActionBar"

const SingleListingNav = ({ listing, session, router, reportModalRef }: any) => {
  const { setToastValues } = useToast()

  // Only show report for authenticated users.
  const isLoggedIn = Boolean(session?.user?.id)

  const isOwner = Boolean(
    session?.user?.id &&
    listing?.agent?._id &&
    String(session.user.id) === String(listing.agent._id),
  )

  const canBookTour = Boolean(
    isLoggedIn &&
    !isOwner &&
    listing?.status === "available"
  )

  const goBack = () => {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push("/search")
  }

  const openInGoogleMap = () => {
    if (!listing?.address?.trim()) {
      setToastValues({
        isActive: true,
        status: "warning",
        message: "This listing has no usable location yet.",
        duration: 2500,
      })
      return
    }

    const encoded = encodeURIComponent(listing.address)

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encoded}`,
      "_blank",
      "noopener,noreferrer",
    )
  }

  const copyListingUrl = async (url: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url)
      return
    }

    const input = document.createElement("textarea")
    input.value = url
    input.setAttribute("readonly", "true")
    input.style.position = "fixed"
    input.style.opacity = "0"

    document.body.appendChild(input)
    input.select()

    const copied = document.execCommand("copy")
    input.remove()

    if (!copied) {
      throw new Error("Copy failed")
    }
  }

  const shareListing = async () => {
    const url = window.location.href
    const title = listing?.address || "First Estates listing"

    try {
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
      ) {
        await navigator.share({
          title,
          text: `Check out this property on First Estates: ${title}`,
          url,
        })

        return
      }

      await copyListingUrl(url)

      setToastValues({
        isActive: true,
        status: "success",
        message: "Listing link copied.",
        duration: 2000,
      })
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        return
      }

      try {
        await copyListingUrl(url)

        setToastValues({
          isActive: true,
          status: "success",
          message: "Listing link copied instead.",
          duration: 2000,
        })
      } catch {
        setToastValues({
          isActive: true,
          status: "danger",
          message: "Unable to share or copy this listing link.",
          duration: 2500,
        })
      }
    }
  }

  const reportListing = () => {
    if (!isLoggedIn) return

    reportModalRef?.current?.showModal()
  }

  // Secondary actions retain their original visual treatment.
  const secondaryButton =
    "flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-xl border border-border/60 bg-background px-1 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:border-primary/50 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:gap-2 sm:px-3 sm:text-sm"

  // Special actions retain the application's established button pattern.
  const specialButton =
    "flex min-h-11 flex-1 items-center justify-center gap-1 !rounded-2xl px-2 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:flex-none sm:min-w-44 sm:gap-2 sm:px-4 sm:text-sm md:min-w-48"

  return (
    <div
      className="
        fixed inset-x-0 bottom-0 z-50
        px-2 pt-2
        pb-[calc(0.5rem+env(safe-area-inset-bottom))]
        bg-background
        border-t border-border/70
        shadow-2xl
        md:w-full
        md:inset-x-auto
        md:bottom-5
        md:left-1/2
        md:w-[min(96%,1100px)]
        md:-translate-x-1/2
        md:bg-black/70
        md:p-2.5
        md:shadow-2xl
        md:backdrop-blur-[20px]
        md:backdrop-saturate-200

        lg:bg-black/20
        lg:backdrop-blur-[52px]
      "
    >
      {/* Inner navigation: independent from the outer glass container */}
      <nav
        aria-label="Listing actions"
        className="
          mx-auto flex w-full max-w-6xl
          flex-nowrap items-center justify-center gap-1
          rounded-xl
          bg-background
          p-1
          sm:gap-2
          md:rounded-xl
          md:p-1
        "
      >
        {/* Back */}
        <button
          type="button"
          onClick={goBack}
          aria-label="Go back"
          className={secondaryButton}
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={shareListing}
          aria-label="Share listing"
          className={secondaryButton}
        >
          <Share2 size={18} />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* Report: only visible to authenticated users */}
        {isLoggedIn && (
          <button
            type="button"
            onClick={reportListing}
            aria-label="Report listing"
            className={secondaryButton}
          >
            <Flag size={18} />
            <span className="hidden sm:inline">Report</span>
          </button>
        )}

        {/* Open in Map */}
        <button
          type="button"
          onClick={openInGoogleMap}
          disabled={!listing?.address?.trim()}
          aria-label="Open listing in map"
          className={`
            ${specialButton}
            darkblueBtn directional listing-map-button
            disabled:cursor-not-allowed disabled:opacity-50
          `}
        >
          <Image
            src="/icons/map.svg"
            alt=""
            width={22}
            height={22}
            aria-hidden="true"
          />
          <span>Map</span>
        </button>

        {/* Book Tour */}
        {canBookTour && (
          <ListingTourActionBar
            listing={listing}
            session={session}
          >
            {({ open, submitting }: any) => (
              <button
                type="button"
                onClick={open}
                disabled={submitting}
                className={`${specialButton} bg-primary disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <CalendarDays size={19} />
                <span>
                  {submitting ? "Booking..." : "Book tour"}
                </span>
              </button>
            )}
          </ListingTourActionBar>
        )}
      </nav>
    </div>
  )
}

export default SingleListingNav