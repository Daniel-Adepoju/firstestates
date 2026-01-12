"use client"

import { useSignal, useSignals } from "@preact/signals-react/runtime"
import { WhiteLoader, Loader } from "@utils/loaders"
import Button from "@lib/Button"
import { useUser } from "@utils/user"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useGetSingleListing } from "@lib/customApi"
import { useSchools } from "@lib/useSchools"
import { editListing } from "@lib/server/listing"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import LoadingBoard from "@components/LoadingBoard"
import { daysLeft } from "@utils/date"
import EditListingDetails from "@components/agent/edit_listing/EditListingDetails"
import EditTier from "@components/agent/edit_listing/EditTier"
import { useToast } from "@utils/Toast"

const EditForm = () => {
  useSignals()
  const listingId = useSearchParams().get("id")
  const { data, isLoading } = useGetSingleListing(listingId, true)
  const { session } = useUser()
  const email = session?.user.email
  const router = useRouter()
  const { setToastValues } = useToast()
  const creating = useSignal(false)
  const [area, setArea] = useState("")
  const [school, setSchool] = useState("")
  const [areas, setAreas] = useState<string[]>([])
  const { schools } = useSchools()
  const currentSchool = school || data?.post?.school
  const schoolArea = schools
    ?.filter((s: any) => s?.shortname.toLocaleLowerCase() === currentSchool?.toLocaleLowerCase())
    .map((s: any) => s?.schoolAreas)
    .flat()
  const [status, setStatus] = useState("")
  const listingDeets = {
    description: useSignal(""),
    price: useSignal(""),
    address: useSignal(""),
    bedrooms: useSignal(""),
    bathrooms: useSignal(""),
    toilets: useSignal(""),
  }
  const [descriptionLength, setDescriptionLength] = useState(0)
  const queryClient = useQueryClient()
  const userId = session?.user.id
  const tabItems = [
    // { name: "Gallery", href: "#" },
    { name: "Status", href: "#" },
    { name: "Details", href: "#" },
    { name: "Tier", href: "#" },
  ]
  const editRanks: any = {
    standard: 1,
    gold: 2,
    first: 3,
  }
  const weights: any = {
    standard: 3,
    gold: 2,
    first: 1,
  }

  const [currentTab, setCurrentTab] = useState("Details")

  // Set form values when data is loaded
  useEffect(() => {
    if (data) {
      setSchool(data.post.school)
      setArea(data.post.location)
      setStatus(data.post.status)
      listingDeets.description.value = data.post.description
      setDescriptionLength(data.post.description.replace(/\s+/g, "").length)
      listingDeets.price.value = data.post.price
      listingDeets.address.value = data.post.address
      listingDeets.bedrooms.value = data.post.bedrooms
      listingDeets.bathrooms.value = data.post.bathrooms
      listingDeets.toilets.value = data.post.toilets
    }
    return () => {}
  }, [data])

  // Set areas when school changes
  useEffect(() => {
    if (!currentSchool) {
      setAreas([])
    }
    if (currentSchool) {
      const areaOptions = schoolArea || []
      setAreas(areaOptions)
    }
  }, [school, data?.post.school])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    listingDeets[name as keyof typeof listingDeets].value = value
    if (listingDeets["description"]) {
      setDescriptionLength(value.replace(/\s+/g, "").length)
    }
    if (listingDeets["description"].value.replace(/\s+/g, "").length > 600) {
      setDescriptionLength(600)
      listingDeets["description"].value = listingDeets["description"].value
        .replace(/\s+/g, "")
        .slice(0, 600)
    }
  }

  //Edit Listing
  const handleEditListing = async ({
    e,
    listingTier,
  }: {
    e?: React.FormEvent<HTMLFormElement>
    listingTier?: string
  }) => {
    e && e.preventDefault()
    creating.value = true
    try {
      let res: any
      await session
      if (!listingTier) {
        res = await editListing(
          {
            id: listingId,
            status,
            description: listingDeets.description.value,
            price: listingDeets.price.value,
            location: area,
            school: school || data?.post.school,
            address: listingDeets.address.value,
            bathrooms: listingDeets.bathrooms.value,
            bedrooms: listingDeets.bedrooms.value,
            toilets: listingDeets.toilets.value,
          },
          userId
        )
      } else {
        const now = new Date()
        let validUntil = new Date()
        let remainingDays = daysLeft(data?.post.validUntil)

        if (listingTier === "standard") {
          validUntil.setDate(now.getDate() + 31 + Number(remainingDays))
        } else if (listingTier === "gold") {
          validUntil.setDate(now.getDate() + 51 + Number(remainingDays))
        } else if (listingTier === "first") {
          validUntil.setDate(now.getDate() + 76 + Number(remainingDays))
        } else {
          validUntil.setDate(now.getDate() + 30 + Number(remainingDays))
        }
        res = await editListing(
          {
            id: listingId,
            listingTier,
            isFeatured: listingTier === "first" || data?.post.isFeatured,
            validUntil,
            listingTierWeight: weights[listingTier],
          },
          userId
        )
      }

      if (res.status === "success") {
        setToastValues({
          isActive: true,
          message: res.message,
          status: res.status,
          duration: 2000,
        })
      }
    } catch (err) {
      creating.value = false
      console.log(err)
    }
  }

  const mutation = useMutation({
    mutationFn: handleEditListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentListings"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      router.push("/agent/listings")
    },
  })

  // listing tab

  if (isLoading) {
    return <WhiteLoader className="mt-40" />
  }

  if (creating.value === true) {
    return <LoadingBoard text="Editing" />
  }

  return (
    <>
      <div className="form_container listing">
        <div className="title_heading">
          <h2>Update your listing</h2>
          <p className="text-sm">Select the aspect of your listing you want to update</p>
        </div>

        <div className="flex gap-3 mx-auto my-6 justify-center items-center w-full max-w-md">
          {tabItems.map((item) => (
            <button
              key={item.name}
              onClick={(e) => {
                setCurrentTab(item.name)
              }}
              className={`${
                currentTab === item.name
                  ? "outline-2 outline-goldPrimary darkblue-gradient text-white font-bold"
                  : "hover:bg-gray-200 dark:hover:bg-darkGray"
              }
            text-foreground text-md  font-medium  px-4 py-2 rounded-md transition-all duration-300 focus:outline-goldPrimary`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => mutation.mutate({ e })}
          className="form listing"
        >

          {/* Status */}
          {currentTab === "Status" && (

            <div className="form_group mx-auto col-span-2">
                <div className="w-full mx-auto lg:w-[70%] flex flex-col gap-2">
              <label>Set Status</label>
              <details className="w-[92%] md:lg-[91%] lg:w-[90%] mx-auto rounded-lg border border-amber-400 bg-goldPrimary/20 px-3 py-2">
                <summary className=" text-sm cursor-pointer font-semibold text-amber-700 dark:text-amber-400">
                 Changing Listing Status
                </summary>

                <ul className="hyphen-auto tracking-wide mt-3 list-disc pl-5 space-y-2 text-sm text-gray-800 dark:text-gray-200">
                  <li>
                    Once a listing is changed from <strong>Available</strong> to{" "}
                    <strong>Rented</strong>, it will be
                    <strong> immediately removed from search results</strong>.
                  </li>
                  <li>
                    Potential tenants will <strong>no longer be able to view or access</strong> the
                    listing.
                  </li>
                  <li>
                    The listing will be <strong>marked as Rented</strong> on your dashboard.
                  </li>
                  <li>
                    You will be able to manage residents on this listing via the{" "}
                    <strong>Manage Residents</strong> button on your dashboard.
                  </li>
                  <li>
                    <strong>Important:</strong> Attempting to game the system by switching a listing
                    back to
                    <strong> Available</strong> will not reset its validity period.
                  </li>
                  <li>
                    If a listing has <strong>expired</strong> and you revert it to{" "}
                    <strong>Available</strong>, it will be
                    <strong> automatically removed</strong>.
                  </li>
                </ul>
              </details>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border rounded p-2 dark:bg-darkGray dark:text-white"
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
              </select>
              </div>
            </div>
         
          )}


          {/* Details */}
          {currentTab === "Details" && (
            <EditListingDetails
              listingDeets={listingDeets}
              descriptionLength={descriptionLength}
              handleInputChange={handleInputChange}
              areas={areas}
              area={area}
              setArea={setArea}
            />
          )}

          {/* Tier */}
          {currentTab === "Tier" && (
            <EditTier
              data={data}
              email={email}
              // amount={amount}
              editRanks={editRanks}
              handleUpgrade={(listingTier: string) => mutation.mutate({ listingTier })}
            />
          )}
          {currentTab !== "Tier" && (
            <Button
              type="submit"
              text="Edit Listing"
              className="clickable text-white darkblue-gradient hover:scale-99 dark:outline-500/20 outline-2 outline-black mx-auto col-span-2 block w-60 my-2 transition-all duration-300 gloss font-bold py-3.5 px-8.5 rounded-md"
            >
              {creating.value && <WhiteLoader />}
            </Button>
          )}

          {/* <div className="col-span-2 dark:text-white text-xs text-center my-3 mx-2 mx-auto w-[98%]"> Don’t be in a haste to click the edit button; make sure you’ve updated everything that’s important to you </div> */}
        </form>
      </div>
    </>
  )
}

export default EditForm
