"use client"

import { useSignal, useSignals } from "@preact/signals-react/runtime"
import {WhiteLoader, Loader } from "@utils/loaders"
import Button from "@lib/Button"
import { useNotification } from "@lib/Notification"
import { useUser } from "@utils/user"
import { useRouter } from "next/navigation"
import { useState,useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useGetSingleListing } from '@lib/customApi'
import { schoolArea,schools } from "@lib/constants"
import {editListing} from "@lib/server/listing"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const EditForm = () => {
  useSignals()
  const listingId = useSearchParams().get('id')
  const {data,isLoading} = useGetSingleListing(listingId)
  const {session} = useUser()
  const router = useRouter()
  const notification = useNotification()
  const creating = useSignal(false)
  const [area,setArea] = useState('')
  const [school,setSchool] = useState('')
  const [areas,setAreas] = useState<string[]>([])
  const [status,setStatus] = useState("")
  const listingDeets = {
    description: useSignal(""),
    price: useSignal(""),
    address: useSignal(""),
    bedrooms: useSignal(""),
    bathrooms: useSignal(""),
    toilets: useSignal(""),
  }
  const queryClient = useQueryClient()
  const userId = session?.user.id
  

  useEffect(() => {
    if (data) {
      setArea(data.location)
      setSchool(data.school)
      setStatus(data.status)
      listingDeets.description.value = data.description
      listingDeets.price.value = data.price
      listingDeets.address.value = data.address
      listingDeets.bedrooms.value = data.bedrooms
      listingDeets.bathrooms.value = data.bathrooms
      listingDeets.toilets.value = data.toilets
    }
  }, [data])

  useEffect(() => {
    if(!school) {
      setAreas([])
    }
    if(school) {
      const areaOptions = schoolArea[school as keyof typeof schoolArea] || []
      setAreas(areaOptions)  
    }
  },[school]) 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    listingDeets[name as keyof typeof listingDeets].value = value
  }

  //Edit Listing
  const handleEditListing = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    creating.value = true
    try {
      await session
      const res = await editListing({
        id: listingId,
        status,
        description: listingDeets.description.value,
        price: listingDeets.price.value,
        location:area,
        school,
        address: listingDeets.address.value,
        bathrooms: listingDeets.bathrooms.value,
        bedrooms: listingDeets.bedrooms.value,
        toilets: listingDeets.toilets.value,
        mainImage: data?.mainImage,
      }, userId)
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
    mutationFn:handleEditListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agentListings'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
         router.push('/agent/listings')
    },
  })

  if (isLoading) {
    return <Loader className='my-50'/>
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
              className="w-full border rounded p-2 dark:bg-gray-600 dark:text-white"
            >
              <option value="available">Available</option>
              <option value="rented">Rented</option>
            </select>
          </div>

          {/* Desc */}
          <div className="form_group">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              name="description"
              type="text"
              value={listingDeets.description.value}
              onChange={handleInputChange}
              placeholder="Enter a description"
            />
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
              className="w-full border rounded p-2 dark:bg-gray-600 dark:text-white"
            >
              <option value="">Select a school</option>
              {schools.map((school) => (
                <option
                  key={school} 
                  value={school}
                >
                  {school}
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
              className="w-full border rounded p-2 dark:bg-gray-600 dark:text-white"
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
