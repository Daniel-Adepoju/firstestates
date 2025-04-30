"use client"
import { signal } from "@preact/signals-react"
import { useSignal, useSignals } from "@preact/signals-react/runtime"
import { CldUploadWidget, CldImage } from "next-cloudinary"
import { useMutation } from "@tanstack/react-query"
import { axiosdata } from "@utils/axiosUrl"
import { DeleteLoader } from "@utils/loaders"
import Image from "next/image"
import Button from "@lib/Button"
const listingDeets = {
  description: signal(""),
  price: signal(""),
  location: signal(""),
  category: signal(""),
  gallery: signal([]),
  mainImage: signal(),
  amenities: signal([]),
  address: signal(""),
}

const ListingForm = () => {
  useSignals()
  const deletingGallery = useSignal(false)
  const selectedGalleryImageId = useSignal(1)

  const handleInputChange = (e) => {
    const { name, value} = e.target
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
  const handleDeleteApi = async (public_id) => {
    const res = await axiosdata.value.post("/api/deleteImage", public_id)
    if (res.status === 200) {
      listingDeets.mainImage.value = null
    } else {
      console.error("Failed to delete image")
    }
  }
  const deleteImageMutation = useMutation({
    mutationKey: "deleteImage",
    mutationFn: handleDeleteApi,
    onSuccess: () => {
      console.log("Image deleted successfully")
    },
  })
  const handleDeleteImage = () => {
    deleteImageMutation.mutate({ public_id: listingDeets.mainImage.value })
  }

  //Delete From Gallery

  const handleDeleteFromGalleryApi = async (public_ids) => {
    const res = await axiosdata.value.post("/api/deleteImage/gallery", public_ids)

    if (res.status === 200) {
      listingDeets.gallery.value = listingDeets.gallery.value.filter(
        (imgSrc) => !public_ids.public_ids.includes(imgSrc)
      )
    } else {
      console.error("Failed to delete images")
    } 

  }

  const deleteFromGalleryMutation = useMutation({
    mutationKey: ["deleteFromGallery"],
    mutationFn: handleDeleteFromGalleryApi,
    onSuccess: () => {
      deletingGallery.value = false
    },
  })

  const handleDeleteFromGallery = (e) => {
    selectedGalleryImageId.value = Number(e.target.id)
    deleteFromGalleryMutation.mutate({ public_ids: [e.target.dataset.id] })
  }
  const handleDeleteGallery = () => {
    deletingGallery.value = true
    deleteFromGalleryMutation.mutate({ public_ids: listingDeets.gallery.value })
  }

  return (
    <> 
    <div className="form_container listing">
      <div className="title_heading">
        <h2>Create a new listing</h2>
        <p>Fill in the details below to create a new listing</p>
      </div>

    
        <form className="form listing">
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
              {deleteImageMutation.isPending && <DeleteLoader />}
            </div>
            
          </div>

          {/* Gallery */}
          <div className="form_group">
            <CldUploadWidget
              options={{ sources: ["local", "camera", "google_drive"] }}
              multiple="false"
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={(result) => handleCloudinaryUpload(result, "gallery")}
            >
              {({ open }) =>
                !listingDeets.mainImage.value && (
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

                    {deleteFromGalleryMutation.isPending &&
                      (index === selectedGalleryImageId.value ||
                    deletingGallery.value === true) ? (
                      <DeleteLoader />
                    ) : (
                      ""
                    )}
                  </div>
                )
              })}
            </div>
           {listingDeets.gallery.value.length > 0 && (
              <Button
                className="directional clickable darkblueBtn"
                functions={() => handleDeleteGallery()}
                text="Delete All"
              />
            )}  
          </div>
         
          {/* Amenities */}
          <div className="form_group">
            <label htmlFor="amenities">Amenities</label>
            <input
              id="amenities"
              name="amenities"
              type="text"
              value={listingDeets.amenities.value}
              onChange={handleInputChange}
              placeholder="Enter amenities separated by commas"
            />
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

          <Button
            text="Create Listing"
            className="clickable directional darkblueBtn"
          />
        </form>
      </div>
    </>
  )
}

export default ListingForm
