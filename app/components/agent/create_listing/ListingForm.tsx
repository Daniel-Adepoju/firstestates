"use client"
import { signal } from "@preact/signals-react"
import { useSignals } from "@preact/signals-react/runtime"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@utils/Toast"
import { useUser } from "@utils/user"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useSchools } from "@lib/useSchools"
import { createListing } from "@lib/server/listing"
import { InfoModal } from "@components/Modals"
import ListingDescription from "./ListingDescription"
import ListingPrice from "./ListingPrice"
import ListingMainImage from "./ListingMainImage"
import ListingGallery from "./ListingGallery"
import ListingAmenities from "./ListingAmenities"
import ListingLocation from "./ListingLocation"
import ListingSubmit from "./ListingSubmit"
import LoadingBoard from "@components/LoadingBoard"
import { Info, X } from "lucide-react"
import TagsInput from "./TagsInput"
import { getListingTier } from "@lib/constants"
import ListingVideo from "./ListingVideo"

// global signals
export const listingDeets = {
  description: signal(""),
  price: signal(""),
  priceUnit: signal(""),
  priceDuration: signal(""),
  listingType: signal(""),
  gallery: signal<string[]>([]),
  mainImage: signal<string | null>(null),
  video: signal<string | null>(null),
  amenities: signal<string[]>([]),
  address: signal(""),
  bedrooms: signal(""),
  bathrooms: signal(""),
  toilets: signal(""),
  tags: signal<string[]>([]),
}

export default function ListingForm({ listingTier }: { listingTier?: string }) {
  useSignals()
  const router = useRouter()
  const  {session}  = useUser()
  const { setToastValues } = useToast()
  const queryClient = useQueryClient()
  const infoRef = useRef<HTMLDialogElement>(null)
  const { schools } = useSchools()
  const [school, setSchool] = useState("")
  const [area, setArea] = useState("")
  const [areas, setAreas] = useState<string[]>([])
  const [incomplete, setIncomplete] = useState(true)
  const creating = signal(false)
  const schoolArea = schools
    .filter((s: any) => s.shortname.toLocaleLowerCase() === school.toLocaleLowerCase())
    .map((s: any) => s.schoolAreas)
    .flat()

  const tier = getListingTier(listingTier)
  const amount = tier?.amount || 0

  const listingTierWeight = tier?.rank || 3

  // ============= Ensure filled fields =============

  useEffect(() => {
    if (
      listingDeets.description.value &&
      listingDeets.price.value &&
      listingDeets.priceUnit.value &&
      listingDeets.priceDuration.value &&
      listingDeets.listingType.value &&
      listingDeets.address.value &&
      listingDeets.bedrooms.value &&
      listingDeets.bathrooms.value &&
      listingDeets.toilets.value &&
      listingDeets.mainImage.value &&
      listingDeets.gallery.value &&
      area &&
      school
    ) {
      setIncomplete(false)
    } else {
      setIncomplete(true)
    }
  }, [
    listingDeets.description.value,
    listingDeets.price.value,
    listingDeets.priceUnit.value,
    listingDeets.priceDuration.value,
    listingDeets.listingType.value,
    listingDeets.address.value,
    listingDeets.bedrooms.value,
    listingDeets.bathrooms.value,
    listingDeets.toilets.value,
    listingDeets.mainImage.value,
    listingDeets.gallery.value,
    area,
    school,
  ])

  //  ============= Reset Form Fields ==============
  const resetFormFields = () => {
    listingDeets.description.value = ""
    listingDeets.price.value = ""
    listingDeets.priceUnit.value = ""
    listingDeets.priceDuration.value = ""
    listingDeets.address.value = ""
    listingDeets.bedrooms.value = ""
    listingDeets.bathrooms.value = ""
    listingDeets.toilets.value = ""
    listingDeets.mainImage.value = null
    listingDeets.gallery.value = []
    listingDeets.listingType.value = ""
    listingDeets.tags.value = []
    setArea("")
    setSchool("")
  }

  //  ============= Set Ares When School is selected ============

  useEffect(() => {
    if (!school) {
      setAreas([])
    }
    if (school) {
      setAreas(schoolArea)
    }
  }, [school])

  // ========= Handle listing creation ==============
  const handleCreateListing = async () => {
    creating.value = true
    try {
      // handle valid until date based on listing tier
      const validUntil = new Date()
      validUntil.setDate(validUntil.getDate() + tier?.durationDays || 30)

      // create listing
      const res = await createListing({
        description: listingDeets.description.value,
        price: listingDeets.price.value,
        priceUnit: listingDeets.priceUnit.value,
        priceDuration: listingDeets.priceDuration.value,
        listingType: listingDeets.listingType.value,
        tags: listingDeets.tags.value,
        location: area,
        school,
        gallery: listingDeets.gallery.value,
        mainImage: listingDeets.mainImage.value,
        video: tier?.rank === 3 ? listingDeets.video.value : undefined,
        address: listingDeets.address.value,
        bathrooms: listingDeets.bathrooms.value,
        bedrooms: listingDeets.bedrooms.value,
        toilets: listingDeets.toilets.value,
        listingTier,
        listingTierWeight,
        isFeatured: tier?.rank === 3,
        validUntil,
      })
      if (res.status === "success") {
        setToastValues({
          isActive: true,
          message: res.message,
          status: res.status,
          duration: 2000,
        })
        resetFormFields()
        router.push("/agent/listings")
      } else {
        creating.value = false
        setToastValues({
          isActive: true,
          message: res.message || "An error occurred",
          status: "danger",
          duration: 4000,
        })
      }
    } catch (err: any) {
      creating.value = false
      console.log(err)
    }
  }

  const createListingMutation = useMutation({
    mutationFn: handleCreateListing,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["listings"] }),
  })

  if (creating.value) {
    return <LoadingBoard text="Creating" />
  }
  return (
    <>
      <div className="form_container listing">
        <div className="title_heading">
          {" "}
          <div>
            Create a <span className={`${tier?.color}`}>{listingTier}</span> listing
          </div>{" "}
          <p className="text-base">Fill in the form below to create a new listing</p>{" "}
          <p className="text-xs font-light text-gray-500 dark:text-gray-300">
            {" "}
            Click the info icon to view our listing guide{" "}
          </p>{" "}
        </div>
        {/* info btn */}
        <div className="text-white dark:text-black listingInfoTooltip relative tooltip-above flex flex-row rounded-full mt-3 cursor-pointer items-center justify-center w-8 mx-auto gold-gradient">
          <Info
            onClick={() => infoRef?.current?.showModal()}
            size={30}
            color="white"
            className="animate-pulse"
          />
        </div>

        <form
          // onSubmit={handleMutate}
          className="form listing"
        >
          <ListingDescription listingDeets={listingDeets} />

          <ListingPrice listingDeets={listingDeets} />

          {tier?.rank === 3 && <ListingVideo listingDeets={listingDeets} />}

          <ListingMainImage listingDeets={listingDeets} />

          <ListingGallery
            maxImages={tier?.maxImages}
            listingDeets={listingDeets}
          />

          <ListingAmenities listingDeets={listingDeets} />

          <ListingLocation
            listingDeets={listingDeets}
            schools={schools}
            school={school}
            setSchool={setSchool}
            area={area}
            setArea={setArea}
            areas={areas}
          />

          {/* Tags */}

          <TagsInput
            tagsSignal={listingDeets.tags}
            maxTags={6}
          />

          <ListingSubmit
            email={session?.user?.email || ""}
            incomplete={incomplete}
            creating={creating}
            amount={amount}
            handleMutate={() => createListingMutation.mutate()}
          />
        </form>
      </div>
      <InfoModal ref={infoRef} />
    </>
  )
}
