"use client"
import { signal } from "@preact/signals-react"
import { useSignal, useSignals } from "@preact/signals-react/runtime"
import { CldUploadWidget, CldImage } from "next-cloudinary"
import { DeleteLoader, WhiteLoader} from "@utils/loaders"
import {deleteImage, deleteMultipleImages} from "@lib/server/deleteImage"
import {createListing} from '@lib/server/createListing'
import Image from "next/image"
import Button from "@lib/Button"
import { useNotification } from "@lib/Notification"
import {useUser} from '@utils/user'
const listingDeets = {
  description: signal(""),
  price: signal(""),
  location: signal(""),
  gallery: signal([]),
  mainImage: signal(),
  amenities: signal([]),
  address: signal(""),
  bedrooms: signal(''),
  bathrooms: signal(''),
  toilets:signal(''),
}

const ListingForm = () => {
  useSignals()
  const session = useUser()
  const notification = useNotification()
  const deletingImage = useSignal(false)
  const deletingGallery = useSignal(false)
  const selectedGalleryImageId = useSignal()
  const creating = useSignal(false)
 
  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === "amenities") {
      listingDeets.amenities.value = value.split(",")
    } else {
      listingDeets[name].value = value
    }
  }

  const handleCloudinaryUpload = (result, type) => {
    if (type === "mainImage") {
      listingDeets.mainImage.value = result.info.public_id
    } else if (type === "gallery") {
      listingDeets.gallery.value = [...listingDeets.gallery.value, result.info.public_id]
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
    } catch (err) {
      deletingImage.value = false
      return null
    }
  }

  //Delete From Gallery

  const handleDeleteFromGallery = async (e) => {
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
    } catch (err) {
      deletingGallery.value = false
      return null
    }
  }
 
  //Create Listing
  const handleCreateListing = async(e) => {
  e.preventDefault()
  creating.value = true
  try {
    await session
  const res = await createListing({
    description: listingDeets.description.value,
    price: listingDeets.price.value,
    location: listingDeets.location.value,
    gallery: listingDeets.gallery.value,
    mainImage: listingDeets.mainImage.value,
    address: listingDeets.address.value,
    bathrooms: listingDeets.bathrooms.value,
    bedrooms: listingDeets.bedrooms.value,
    toilets: listingDeets.toilets.value,
  })
  if (res.status === 'success') {
    notification.setIsActive(true)
    notification.setMessage(res.message)
    notification.setType(res.status)
  }
  creating.value=false
  } catch(err) {
  creating.value=false
  console.log(err)
  }
  }

  return (
    <>
      <div className="form_container listing">
        <div className="title_heading">
      <h2>Create a new listing</h2>
      <p className="text-base">Fill in the form below to create a new listing</p>
        </div>

        <form  onSubmit={handleCreateListing} className="form listing">
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

          {/* Location */}
          <div className="form_group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              value={listingDeets.location.value}
              onChange={handleInputChange}
              placeholder="Enter the location"
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
            maxFiles:5,
            multiple:true}}
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={(result) => handleCloudinaryUpload(result, "gallery")}
            >
              {({ open }) =>
                !listingDeets.gallery.value.length < 5 && (
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
                        id={index}
                        data-id={imgSrc}
                        onClick={(e) => handleDeleteFromGallery(e)}
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
 {index === selectedGalleryImageId.value || deletingGallery.value === true   ?
                    <DeleteLoader /> : ''}
                  </div>
                )
              })}
            </div>
     <p className='mx-auto text-center'>A Maximum Of 5 Images Can Be Uploaded To The Gallery</p>
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
              placeholder='0'
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
              placeholder='0'/>
           </div>
        <div>
           <label htmlFor="toilets">Toilets</label>
            <input
              id="toilets"
              name="toilets"
              type="number"
              value={listingDeets.toilets.value}
              onChange={handleInputChange}
              placeholder='0'/>
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

  <div className={`form_group ${listingDeets.gallery.value.length > 0 &&  "submit"}`}>
       <Button
          type='submit'
            text="Create Listing"
            className="clickable directional darkblueBtn"
          > 
          {creating.value && <WhiteLoader/>}
          </Button>
  </div>
       
        </form>
      </div>
    </>
  )
}

export default ListingForm
