"use client"

import { useSignal, useSignals } from "@preact/signals-react/runtime"
import { WhiteLoader, Loader } from "@utils/loaders"
import Button from "@lib/Button"
import { useNotification } from "@lib/Notification"
import { useUser } from "@utils/user"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useGetSingleListing } from "@lib/customApi"
import { useSchools } from "@lib/useSchools"
import { editListing } from "@lib/server/listing"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { listingTierItems } from "@lib/constants"

const EditForm = () => {
  useSignals()
  const listingId = useSearchParams().get("id")
  const { data, isLoading } = useGetSingleListing(listingId, true)
  const { session } = useUser()
  const router = useRouter()
  const notification = useNotification()
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

  const [currentTab, setCurrentTab] = useState("Tier")

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
  const handleEditListing = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    creating.value = true
    try {
      await session
      const res = await editListing(
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
      if (res.status === "success") {
        notification.setIsActive(true)
        notification.setMessage(res.message)
        notification.setType(res.status)
      }
      creating.value = false
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
      router.push("/agent")
    },
  })

  // listing tab

  if (isLoading) {
    return <WhiteLoader className="mt-40" />
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
                  ? "outline-2 outline-goldPrimary bg-darkblue text-white font-bold"
                  : "hover:bg-gray-200 dark:hover:bg-darkGray"
              }
            text-foreground font-head font-medium  px-4 py-2 rounded-md transition-all duration-300 focus:outline-goldPrimary`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => mutation.mutate(e)}
          className="form listing"
        >
          {/* Status */}

          {currentTab === "Status" && (
            <div className="form_group">
              <label>Set Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded p-2 dark:bg-darkGray dark:text-white"
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
              </select>
            </div>
          )}

          {/* Details */}
          {currentTab === "Details" && (
            <>
              {/* Desc */}
              <div className="form_group relative">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={listingDeets.description.value}
                  onChange={handleInputChange}
                  placeholder="Enter a description, it cannot be more than 600 characters"
                  className="pb-5 nobar placeholder-gray-500 resize-none h-60"
                />
                <div className="otherHead backdrop-blur-sm text-sm font-head font-bold absolute bottom-0 right-[5%]">
                  {descriptionLength}/600
                </div>
              </div>

              {/* Price */}
              <div className="form_group">
                <label htmlFor="price">Price</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={listingDeets.price.value}
                  onChange={handleInputChange}
                  placeholder="Enter the price"
                />
              </div>

              {/* Amenities */}
              <div className="form_group amenities">
                <label htmlFor="amenities">Amenities</label>
                <div className="items">
                  <div>
                    <label htmlFor="bedrooms">Bedrooms</label>
                    <input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      value={listingDeets.bedrooms.value}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="bathrooms">Bathrooms</label>
                    <input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      value={listingDeets.bathrooms.value}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="toilets">Toilets</label>
                    <input
                      id="toilets"
                      name="toilets"
                      type="number"
                      value={listingDeets.toilets.value}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="form_group">
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={listingDeets.address.value}
                  onChange={handleInputChange}
                  placeholder="Enter the address"
                />
              </div>

              {/* School Select */}
              {/* <div className="form_group">
            <label>School</label>
            <select
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full border rounded p-2 dark:bg-darkGray dark:text-white"
            >
              <option value="">Select a school</option>
              {schools.map((school: any) => (
                <option
                  key={school._id}
                  value={school?.shortname}
                >
                  {school?.shortname} ({school?.fullname})
                </option>
              ))}
            </select>
          </div> */}

              {/* Location Select */}
              <div className="form_group">
                <label>Location</label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full border rounded p-2 dark:bg-darkGray dark:text-white"
                >
                  <option value="">Select a location</option>
                  {areas.map((area) => (
                    <option
                      key={area}
                      value={area}
                    >
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Tier */}

          {currentTab === "Tier" && (
            <div className="w-full col-span-2 text-foreground">
              <div className="w-[90%] text-center mx-auto mb-4">
                This listing is currently a
                <strong
                  className={`
                  ${data?.post.listingTier === "standard" && "text-sky-500"}
                  ${data?.post.listingTier === "gold" && "text-goldPrimary"}
                  ${data?.post.listingTier === "first" && "text-[#b647ff]"}
                `}
                >
                  {" "}
                  {data?.post.listingTier}
                </strong>{" "}
                listing
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 ">
                {listingTierItems.map((listing: any) => (
                  <div
                    key={listing.type}
                    className={` ${
                      listing.bonusClass && listing.bonusClass
                    } gloss  dark:bg-gray-700/50 text-gray-700 dark:text-gray-100  border-2 ${
                      listing.border
                    } rounded-2xl p-6 shadow-md smallScale transition cursor-pointer`}
                  >
                    <h2 className="text-2xl font-bold mb-2">{listing.type}</h2>
                    <p
                      className={`text-xl font-semibold mb-4  ${
                        listing.type === "First" && "text-[#b647ff]"
                      } ${listing.type === "Gold" && "text-goldPrimary"} ${
                        listing.type === "Standard" && "text-sky-500"
                      }`}
                    >
                      {listing.price}
                    </p>
                    <ul className="space-y-2">
                      {listing.benefits.map((benefit: any, index: any) => (
                        <li
                          key={index}
                          className="text-gray-600 dark:text-gray-300"
                        >
                          • {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            type="submit"
            text="Edit Listing"
            className="clickable text-white bg-darkblue hover:scale-99 dark:outline-500/20 outline-2 outline-black 
               mx-auto col-span-2 block w-60 my-2
               transition-all duration-300 gloss font-bold py-3.5 px-8.5 rounded-md"
          >
            {creating.value && <WhiteLoader />}
          </Button>
          {/* <div className="col-span-2 dark:text-white text-xs text-center my-3 mx-2 mx-auto w-[98%]">
            Don’t be in a haste to click the edit button; make sure you’ve updated everything that’s
            important to you
          </div> */}
        </form>
      </div>
    </>
  )
}

export default EditForm
