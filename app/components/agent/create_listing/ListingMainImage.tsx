"use client"
import { CldUploadWidget, CldImage } from "next-cloudinary"
import Button from "@lib/Button"
import { deleteImage } from "@lib/server/deleteImage"
import { DeleteLoader } from "@utils/loaders"
import { useSignal } from "@preact/signals-react"

export default function ListingMainImage({ listingDeets }: any) {
  const deleting = useSignal(false)

  const handleUpload = (result: any) => {
    listingDeets.mainImage.value = result.info.public_id
  }

  const handleDelete = async () => {
    deleting.value = true
    try {
      await deleteImage(listingDeets.mainImage.value)
      listingDeets.mainImage.value = null
    } catch (err) {
      console.log(err)
    } finally {
      deleting.value = false
    }
  }

  return (
    <div className="form_group main_image relative">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={handleUpload}
      >
        {({ open }) =>
          !listingDeets.mainImage.value && (
            <Button
              text="Upload Main Image"
              className="clickable text-white bg-darkblue hover:scale-99 dark:outline-gray-700 outline-2 outline-black transition-all duration-300 gloss font-bold py-3.5 px-8.5 rounded-md"
              functions={() => open()}
            />
          )
        }
      </CldUploadWidget>

      {listingDeets.mainImage.value && (
        <div className="mainImage relative mt-4 w-fit mx-auto">
          <div
            className="absolute top-2 right-2 z-10 cursor-pointer"
            onClick={handleDelete}
          >
            <img
              src="/icons/cancel.svg"
              alt="Delete"
              width={20}
              height={20}
            />
          </div>
          <CldImage
            src={listingDeets.mainImage.value}
            alt="Main Image"
            width={200}
            height={200}
            crop="fill"
            className="rounded-xl"
          />
          {deleting.value && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
              <DeleteLoader />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
