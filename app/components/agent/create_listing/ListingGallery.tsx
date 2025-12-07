"use client"
import { CldUploadWidget, CldImage } from "next-cloudinary"
import Image from "next/image"
import Button from "@lib/Button"
import { DeleteLoader } from "@utils/loaders"
import { deleteMultipleImages } from "@lib/server/deleteImage"
import { useSignal } from "@preact/signals-react"

export default function ListingGallery({ listingDeets, listingTier }: any) {
  const deletingGallery = useSignal(false)
  const selectedGalleryImageId = useSignal<number | null>(null)

  const maxImages =
    listingTier === "standard" ? 3 : listingTier === "gold" ? 5 : listingTier === "first" ? 8 : 3

  const handleCloudinaryUpload = (result: any, key: string) => {
    const id = result.info.public_id
    if (listingDeets[key].value.length < maxImages) {
      listingDeets[key].value = [...listingDeets[key].value, id]
    }
  }

  const handleDeleteFromGallery = async (e: any) => {
    const imgId = e.target.dataset.id
    const index = Number(e.target.id)
    selectedGalleryImageId.value = index
    deletingGallery.value = true
    try {
      const res = await deleteMultipleImages([imgId])
      if (res.status === "success") {
        listingDeets.gallery.value = listingDeets.gallery.value.filter(
          (_: any, i: number) => i !== index
        )
      }
    } catch (err) {
      console.error(err)
    } finally {
      deletingGallery.value = false
      selectedGalleryImageId.value = null
    }
  }

  const handleDeleteGallery = async () => {
    deletingGallery.value = true
    try {
      await deleteMultipleImages(listingDeets.gallery.value)
      listingDeets.gallery.value = []
    } catch (err) {
      console.error(err)
    } finally {
      deletingGallery.value = false
    }
  }

  return (
    <div className="form_group gallery">
      <CldUploadWidget
        options={{
          sources: ["local", "camera", "google_drive"],
          maxFiles: maxImages,
          multiple: true,
        }}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={(result) => handleCloudinaryUpload(result, "gallery")}
      >
        {({ open }) =>
          listingDeets?.gallery.value.length < maxImages && (
            <Button
              text="Upload To Gallery"
              className="clickable text-white darkblue-gradient hover:scale-99 outline-2 outline-black transition-all duration-300 gloss font-bold py-3.5 px-8.5 rounded-md"
              functions={() => open()}
            ></Button>
          )
        }
      </CldUploadWidget>

      <div className="galleryImagesContainer">
        {listingDeets.gallery.value.map((imgSrc: string, index: number) => {
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
        A Maximum Of {maxImages} Images Can Be Uploaded To The Gallery
      </p>

      {listingDeets.gallery.value.length > 1 && (
        <Button
          className="clickable text-white darkblue-gradient hover:scale-99 dark:outline-gray-700 outline-2 outline-black transition-all duration-300 gloss font-bold py-3.5 px-8.5 rounded-md"
          functions={() => handleDeleteGallery()}
          text="Delete All"
        />
      )}
    </div>
  )
}
