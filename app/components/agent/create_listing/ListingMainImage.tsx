"use client"
import { CldUploadWidget, CldImage } from "next-cloudinary"
import { useToast } from "@utils/Toast"
import Button from "@lib/Button"
import { deleteImage } from "@lib/server/deleteImage"
import { DeleteLoader } from "@utils/loaders"
import { useSignal } from "@preact/signals-react"
import { ImagePlus, Loader, X } from "lucide-react"
import { de } from "date-fns/locale"

export default function ListingMainImage({ listingDeets }: any) {
  const deletingImage = useSignal(false)
  const { setToastValues } = useToast()

  const handleCloudinaryUpload = (result: any, key: string) => {
    listingDeets[key].value = result.info.public_id
  }

  const handleDeleteImage = async () => {
    deletingImage.value = true
    try {
      await deleteImage(listingDeets.mainImage.value)
      listingDeets.mainImage.value = null
      setToastValues({
        isActive: true,
        message: "Image deleted successfully",
        status: "success",
        duration: 2000,
      })
    } catch (err) {
      console.error(err)
      setToastValues({
        isActive: true,
        message: "Failed to delete image",
        status: "error",
        duration: 2000,
      })
    } finally {
      deletingImage.value = false
    }
  }

  return (
    <div className="form_group main_image">
      <CldUploadWidget
        options={{ sources: ["local", "camera", "google_drive"] }}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={(result) => {
          handleCloudinaryUpload(result, "mainImage")
          setToastValues({
            isActive: true,
            message: "Image uploaded successfully",
            duration: 2000,
            status: "success",
          })
        }}
        onError={(err) => {
          console.error("Cloudinary Upload Error:", err)
          setToastValues({
            isActive: true,
            message: "Failed to upload image",
            duration: 2000,
            status: "error",
          })
        }}
      >
        {({ open }) =>
          !listingDeets.mainImage.value && (
            <Button
              text="Upload Main Image"
              className="flex flex-row-reverse items-center gap-1 clickable text-white darkblue-gradient hover:scale-99 dark:outline-black outline-2 outline-black transition-all duration-300 gloss font-semibold py-3.5 px-8.5 rounded-md"
              onClick={() => open()}
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
              className="right-0.5 top-0.5 p-1 absolute cursor-pointer border-1 border-gray-800 rounded-full"
              onClick={handleDeleteImage}
            >
              {!deletingImage.value && (
                <X
                  width={16}
                  height={16}
                  strokeWidth={3}
                  className="text-red-600 hover:text-red-700 transition-colors"
                />
              )}
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

        {deletingImage.value && (
          <Loader
            width={30}
            height={30}
            strokeWidth={3}
            className="ml-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600 hover:text-red-700 transition-colors  duration-500 animate-spin"
          />
        )}
      </div>
    </div>
  )
}
