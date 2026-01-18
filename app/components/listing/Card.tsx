"use client"
import Image from "next/image"
import React, { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useBackdrop } from "@lib/Backdrop"
import { useAnimation } from "@lib/useAnimation"
import { DeleteModal } from "../Modals"
import CardOptions from "./CardOptions"
import { FeaturedBtn } from "./Featured"
import { formatNumber } from "@utils/formatNumber"

import CardImage from "./CardImage"
import CardBody from "./CardBody"
import CardMeta from "./CardMeta"
import CardEditActions from "./CardEditActions"

export interface CardProps {
  edit?: boolean
  isAgentCard?: boolean
  listing: Listing
  isInWishList?: boolean
  blankSlate?: boolean
}

const Card = ({ edit, listing, isAgentCard, isInWishList, blankSlate = false }: CardProps) => {
  const [address] = useState(listing?.address || "Nigeria")
  const router = useRouter()
  const deleteRef = useRef<HTMLDialogElement>(null)
  const [deleting, setDeleting] = useState(false)
  const [weeklyViews] = useState(formatNumber(listing?.weeklyViews ?? 0) || 0)
  const [totalViews] = useState(formatNumber(listing?.totalViews ?? 0) || 0)
  const [showMore, setShowMore] = useState(false)
  const { backdrop, setBackdrop } = useBackdrop()

  const openDialog = () => {
    deleteRef.current?.showModal()
  }

  const visitCard = () => {
    if (isAgentCard) {
      return router.push(`/agent/listings/single_listing?id=${listing?._id}`)
    }
    router.push(`/listings/single_listing?id=${listing?._id}`)
  }

  const { ref, className: animateClass } = useAnimation({
    threshold: 0.1,
    rootMargin: "0px 0px -30px 0px",
  })

  return (
    <>
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`${animateClass} cardContainer`}
      >
        <div
          onClick={visitCard}
          className={`card font-card ${blankSlate && "blankSlate"} transition-all duration-200 ease-in hover:transition-all hover:duration-200 hover:ease-out`}
        >
          <CardImage
            listing={listing}
            blankSlate={blankSlate}
            isAgentCard={isAgentCard}
            isInWishList={isInWishList}
            backdrop={backdrop}
            setBackdrop={setBackdrop}
          />

          <CardBody
            listing={listing}
            edit={edit}
            isAgentCard={isAgentCard}
            address={address}
            weeklyViews={weeklyViews}
            totalViews={totalViews}
          />

          {/* {!edit && ( */}
            <CardMeta
              isEdit={edit}
              listing={listing}
              showMore={showMore}
              setShowMore={setShowMore}
              isAgentCard={isAgentCard}
            />
          {/* )} */}
        </div>

        {edit && (
          <CardEditActions
            listing={listing}
            deleting={deleting}
            setDeleting={setDeleting}
            openDialog={openDialog}
            deleteRef={deleteRef}
            router={router}
          />
        )}
      </div>
      <CardOptions />
    </>
  )
}

export default Card
