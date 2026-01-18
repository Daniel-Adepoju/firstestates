"use client"
import { CldUploadWidget, CldImage } from "next-cloudinary"
import Image from "next/image"
import Button from "@lib/Button"
import { deleteImage } from "@lib/server/deleteImage"
import { DeleteLoader } from "@utils/loaders"
import { useSignal } from "@preact/signals-react"
import { ImagePlus } from "lucide-react"

export default function ListingMainImage({ listingDeets }: any) {
  const deletingImage = useSignal(false)

  const handleCloudinaryUpload = (result: any, key: string) => {
    listingDeets[key].value = result.info.public_id
  }

  const handleDeleteImage = async () => {
    deletingImage.value = true
    try {
      await deleteImage(listingDeets.mainImage.value)
      listingDeets.mainImage.value = null
    } catch (err) {
      console.error(err)
    } finally {
      deletingImage.value = false
    }
  }

  return (
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
              className="flex flex-row-reverse items-center gap-1 clickable text-white darkblue-gradient hover:scale-99 dark:outline-black outline-2 outline-black transition-all duration-300 gloss font-semibold py-3.5 px-8.5 rounded-md"
              functions={() => open()}
            >
              <ImagePlus
                size={16}
                strokeWidth={3}
                color="white"
              />
            </Button>
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
  )
}
