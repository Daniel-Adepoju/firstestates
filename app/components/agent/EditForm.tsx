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
  const schoolArea = schools
    ?.filter((s: any) => s?.shortname.toLocaleLowerCase() === school?.toLocaleLowerCase())
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

  console.log("DATA", data?.post.school)
  // Set form values when data is loaded
  useEffect(() => {
    if (data) {
      setArea(data.post.location)
      setSchool(data.post.school)
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
    if (!school) {
      setAreas([])
    }
    if (school) {
      const areaOptions = schoolArea || []
      setAreas(areaOptions)
    }
  }, [school])

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
          school,
          address: listingDeets.address.value,
          bathrooms: listingDeets.bathrooms.value,
          bedrooms: listingDeets.bedrooms.value,
          toilets: listingDeets.toilets.value,
          mainImage: data?.mainImage,
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

  if (isLoading) {
    return <Loader className="my-50" />
  }

  return (
    <>
      <div className="form_container listing">
        <div className="title_heading">
          <h2>Edit your listing</h2>
          <p className="text-base">Edit the content of the form below</p>
        </div>

        <form
          onSubmit={(e) => mutation.mutate(e)}
          className="form listing"
        >
          {/* Status */}
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
          <div className="form_group">
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
          </div>

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

          <div>
            <Button
              type="submit"
              text="Edit Listing"
              className="clickable directional darkblueBtn"
            >
              {creating.value && <WhiteLoader />}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default EditForm
