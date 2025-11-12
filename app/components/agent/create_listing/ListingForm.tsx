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
import { Info } from "lucide-react"

// global signals
export const listingDeets = {
  description: signal(""),
  price: signal(""),
  gallery: signal<string[]>([]),
  mainImage: signal<string | null>(null),
  amenities: signal<string[]>([]),
  address: signal(""),
  bedrooms: signal(""),
  bathrooms: signal(""),
  toilets: signal(""),
}

export default function ListingForm({ listingTier }: { listingTier?: string }) {
  useSignals()
  const router = useRouter()
  const { session } = useUser()
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

  const amount =
    listingTier === "standard"
      ? 1000
      : listingTier === "gold"
      ? 2500
      : listingTier === "first"
      ? 5000
      : 1000

  useEffect(() => {
    if (
      listingDeets.description.value &&
      listingDeets.price.value &&
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
    listingDeets.address.value,
    listingDeets.bedrooms.value,
    listingDeets.bathrooms.value,
    listingDeets.toilets.value,
    listingDeets.mainImage.value,
    listingDeets.gallery.value,
    area,
    school,
  ])

  const resetFormFields = () => {
    listingDeets.description.value = ""
    listingDeets.price.value = ""
    listingDeets.address.value = ""
    listingDeets.bedrooms.value = ""
    listingDeets.bathrooms.value = ""
    listingDeets.toilets.value = ""
    listingDeets.mainImage.value = null
    listingDeets.gallery.value = []
    setArea("")
    setSchool("")
  }

  useEffect(() => {
    if (!school) {
      setAreas([])
    }
    if (school) {
      setAreas(schoolArea)
    }
  }, [school])

  // handle listing creation
  const handleCreateListing = async () => {
    creating.value = true
    try {
      const res = await createListing({
        description: listingDeets.description.value,
        price: listingDeets.price.value,
        location: area,
        school,
        gallery: listingDeets.gallery.value,
        mainImage: listingDeets.mainImage.value,
        address: listingDeets.address.value,
        bathrooms: listingDeets.bathrooms.value,
        bedrooms: listingDeets.bedrooms.value,
        toilets: listingDeets.toilets.value,
        listingTier,
        isFeatured: listingTier === "first",
      })
      if (res.status === "success") {
        setToastValues({
          isActive: true,
          message: res.message,
          status: res.status,
          duration: 2000,
        })
        creating.value = false
        resetFormFields()
        router.push("/agent/listings")
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

  return (
    <>
      <div className="form_container listing">
        <div className="title_heading">
          {" "}
          <div>
            Create a{" "}
            <span
              className={`${listingTier === "standard" && "text-sky-500"}
           ${listingTier === "gold" && "text-goldPrimary"} ${
                listingTier === "first" && "text-[#b647ff]"
              }`}
            >
              {listingTier}
            </span>{" "}
            listing
          </div>{" "}
          <p className="text-base">Fill in the form below to create a new listing</p>{" "}
          <p className="text-xs font-light text-gray-500 dark:text-gray-300">
            {" "}
            Click the info icon to view our listing guide{" "}
          </p>{" "}
        </div>
        {/* info btn */}
        <div className="text-white dark:text-black listingInfoTooltip relative tooltip-above flex flex-row rounded-full mt-3 cursor-pointer items-center justify-center w-8 mx-auto bg-goldPrimary">
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

          <ListingMainImage listingDeets={listingDeets} />

          <ListingGallery 
          listingTier={listingTier}
          listingDeets={listingDeets} />

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

          <ListingSubmit
            email={session?.user?.email || ""}
            incomplete={incomplete}
            creating={creating.value}
            amount={amount}
            handlemutate={() => createListingMutation.mutate()}
          />
        </form>
      </div>
      <InfoModal ref={infoRef} />
    </>
  )
}
