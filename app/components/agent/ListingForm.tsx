"use client"
import { signal } from "@preact/signals-react"
import { useSignal, useSignals } from "@preact/signals-react/runtime"
import { CldUploadWidget, CldImage, CloudinaryUploadWidgetResults } from "next-cloudinary"
import { DeleteLoader } from "@utils/loaders"
import { deleteImage, deleteMultipleImages } from "@lib/server/deleteImage"
import { createListing } from "@lib/server/listing"
import Image from "next/image"
import Button from "@lib/Button"
import { useNotification } from "@lib/Notification"
import { useUser } from "@utils/user"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSchools } from "@lib/useSchools"
import { Info, MoreHorizontal } from "lucide-react"
import { InfoModal, LogOutModal } from "@components/Modals"
import dynamic from "next/dynamic"
const PaystackBtn = dynamic(() => import("@components/PayStackButton"), { ssr: false })

export interface CloudinaryResult {
  public_id: string
}
interface DeleteFromGalleryEvent extends React.MouseEvent<HTMLImageElement> {
  target: HTMLImageElement & {
    id: string
    dataset: {
      id: string
    }
  }
}

const listingDeets = {
  description: signal(""),
  price: signal(""),
  gallery: signal<string[]>([]),
  mainImage: signal<string | null>(),
  amenities: signal<string[]>([]),
  address: signal(""),
  bedrooms: signal(""),
  bathrooms: signal(""),
  toilets: signal(""),
}

const ListingForm = () => {
  useSignals()
  const queryClient = useQueryClient()
  const { session } = useUser()
  const email = session?.user?.email
  const router = useRouter()
  const notification = useNotification()
  const deletingImage = useSignal(false)
  const deletingGallery = useSignal(false)
  const selectedGalleryImageId = useSignal<number | null>()
  const creating = useSignal(false)
  const [descriptionLength, setDescriptionLength] = useState(0)
  const [area, setArea] = useState("")
  const [school, setSchool] = useState("")
  const [areas, setAreas] = useState<string[]>([])
  const { schools } = useSchools()
  const [incomplete, setIncomplete] = useState(true)
  const infoRef = useRef<HTMLDialogElement>(null)
  const amount = 500
  const schoolArea = schools
    .filter((s: any) => s.shortname.toLocaleLowerCase() === school.toLocaleLowerCase())
    .map((s: any) => s.schoolAreas)
    .flat()

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

  const handleCloudinaryUpload = (
    result: CloudinaryUploadWidgetResults,
    uploadType: "mainImage" | "gallery"
  ) => {
    const resultInfo = result.info as CloudinaryResult
    if (uploadType === "mainImage") {
      listingDeets.mainImage.value = resultInfo?.public_id
    } else if (uploadType === "gallery") {
      listingDeets.gallery.value = [...listingDeets.gallery.value, resultInfo.public_id]
    }
  }

  // Delete Main Image

  const handleDeleteImage = async () => {
    deletingImage.value = true
    try {
      const res = await deleteImage(listingDeets.mainImage.value)
      if (res.status === "success") {
        listingDeets.mainImage.value = null
      }
      notification.setIsActive(true)
      notification.setMessage(res.message)
      notification.setType(res.status)
      deletingImage.value = false
    } catch {
      deletingImage.value = false
      return null
    }
  }

  //Delete From Gallery

  const handleDeleteFromGallery = async (e: DeleteFromGalleryEvent) => {
    selectedGalleryImageId.value = Number(e.target.id)
    try {
      const res = await deleteMultipleImages([e.target.dataset.id])
      if (res.status === "success") {
        listingDeets.gallery.value = listingDeets.gallery.value.filter(
          (imgSrc) => imgSrc !== e.target.dataset.id
        )
      }
      notification.setIsActive(true)
      notification.setMessage(res.message)
      notification.setType(res.status)
      deletingGallery.value = false
      selectedGalleryImageId.value = null
    } catch (err) {
      selectedGalleryImageId.value = null
      console.log(err)
      return null
    }
  }
  const handleDeleteGallery = async () => {
    deletingGallery.value = true
    try {
      const res = await deleteMultipleImages(listingDeets.gallery.value)
      if (res.status === "success") {
        listingDeets.gallery.value = listingDeets.gallery.value.filter(
          (imgSrc) => !listingDeets.gallery.value.includes(imgSrc)
        )
      }
      notification.setIsActive(true)
      notification.setMessage("All Items Removed From gallery ")
      notification.setType(res.status)
      deletingGallery.value = false
    } catch {
      deletingGallery.value = false
      return null
    }
  }

  //Create Listing
  const handleCreateListing = async () => {
    creating.value = true
    console.log("created succesfully")
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
      })
      if (res.status === "success") {
        notification.setIsActive(true)
        notification.setMessage(res.message)
        notification.setType(res.status)
      }
      creating.value = false
      resetFormFields()
      router.push("/agent")
    } catch (err) {
      creating.value = false
      console.log(err)
    }
  }
  const mutation = useMutation({
    mutationFn: handleCreateListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] })
    },
  })

  const handleMutate = () => {
    mutation.mutate()
  }
  return (
    <>
      {/* <Nav/> */}
      <div className="form_container listing">
        <div className="title_heading">
          <h2>Create a new listing</h2>
          <p className="text-base">Fill in the form below to create a new listing</p>
          <p className="text-xs font-light text-gray-500 dark:text-gray-300">
            Click the info icon to view our listing guide
          </p>
        </div>

        {/* info btn */}
        <div className="text-white dark:text-black listingInfoTooltip relative tooltip-above flex flex-row   rounded-full mt-3 cursor-pointer items-center justify-center w-8 mx-auto  bg-darkblue dark:bg-coffee ">
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
          {/*description */}
          <div className="form_group relative">
            <label htmlFor="description">Description</label>
            <div className="text-xs text-foreground break-words">
              Use the description to provide additional details, such as kitchen availability,
              whether a roommate is required, any extra utility costs, and differences between the
              first year's rent and subsequent years.
            </div>

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

          {/* Main Image */}
          <div className="form_group main_image">
            <CldUploadWidget
              options={{ sources: ["local", "camera", "google_drive"] }}
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={(result) => handleCloudinaryUpload(result, "mainImage")}
            >
              {({ open }) =>
                !listingDeets.mainImage.value && (
                  <Button
                    text="Upload Main Image"
                    className="clickable darkblueBtn"
                    functions={() => open()}
                  ></Button>
                )
              }
            </CldUploadWidget>

            <div className="mainImage">
              {listingDeets.mainImage.value && (
                <>
                  <div
                    className="clickable"
                    onClick={handleDeleteImage}
                  >
                    <Image
                      src="/icons/cancel.svg"
                      alt="Delete"
                      width={20}
                      height={20}
                    />
                  </div>
                  <CldImage
                    src={listingDeets.mainImage.value}
                    alt="Main Image"
                    width={100}
                    height={100}
                    crop={"fill"}
                  />
                </>
              )}
              {deletingImage.value && <DeleteLoader />}
            </div>
          </div>

          {/* Gallery */}
          <div className="form_group gallery">
            <CldUploadWidget
              options={{
                sources: ["local", "camera", "google_drive"],
                maxFiles: 5,
                multiple: true,
              }}
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={(result) => handleCloudinaryUpload(result, "gallery")}
            >
              {({ open }) =>
                listingDeets?.gallery.value.length < 5 && (
                  <Button
                    text="Upload To Gallery"
                    className="clickable darkblueBtn"
                    functions={() => open()}
                  ></Button>
                )
              }
            </CldUploadWidget>
            <div className="galleryImagesContainer">
              {listingDeets.gallery.value.map((imgSrc, index) => {
                return (
                  <div
                    key={index}
                    className="galleryImages"
                  >
                    <div className="clickable">
                      <Image
                        id={index.toString()}
                        data-id={imgSrc}
                        onClick={handleDeleteFromGallery}
                        src="/icons/cancel.svg"
                        alt={`Delete${index}`}
                        width={20}
                        height={20}
                      />
                    </div>
                    <CldImage
                      src={imgSrc}
                      alt="Gallery Image"
                      width={100}
                      height={100}
                      crop={"fill"}
                    />
                    {index === selectedGalleryImageId.value || deletingGallery.value === true ? (
                      <DeleteLoader />
                    ) : (
                      ""
                    )}
                  </div>
                )
              })}
            </div>
            <p className="mx-auto text-center dark:text-white">
              A Maximum Of 5 Images Can Be Uploaded To The Gallery
            </p>
            {listingDeets.gallery.value.length > 1 && (
              <Button
                className="directional clickable darkblueBtn"
                functions={() => handleDeleteGallery()}
                text="Delete All"
              />
            )}
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

          {/*School Select*/}
          <div className="form_group">
            <label>School</label>
            <select
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full border rounded p-1.5 dark:text-white dark:bg-gray-600"
            >
              <option value="">Select a school</option>
              {schools.map((school:School) => (
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
              className="w-full border rounded p-2 dark:text-white dark:bg-gray-600"
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

          <div className={`form_group ${listingDeets.gallery.value.length > 0 && "submi"}`}>
            {email ? (
              incomplete ? (
                <div className="mx-auto font-semibold text-gray-700 dark:text-white">
                  Fill The Form To Proceed
                </div>
              ) : (
                <PaystackBtn
                  text={"Creating Listing"}
                  email={email || ""}
                  amount={amount}
                  creating={creating}
                  successFunction={() => handleMutate()}
                />
              )
            ) : (
              <div className="font-semibold mx-auto flex flex-row items-center gap-1 dark:text-white text-gray-600">
                <span>Loading</span>
                <MoreHorizontal
                  size={20}
                  className="self-end animate-pulse"
                />
              </div>
            )}
          </div>
        </form>
      </div>
      <div>
        {/* <LogOutModal ref={infoRef}/> */}
        <InfoModal ref={infoRef} />
      </div>
    </>
  )
}

export default ListingForm
