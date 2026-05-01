"use client"
import { CldUploadWidget, CldImage } from "next-cloudinary"
import Button from "@lib/Button"
import { useToast } from "@utils/Toast"
import { deleteMultipleImages } from "@lib/server/deleteImage"
import { useSignal } from "@preact/signals-react"
import { X, Images, Loader } from "lucide-react"

export default function ListingGallery({ listingDeets, maxImages }: any) {
  const deletingGallery = useSignal(false)
  const selectedGalleryImageId = useSignal<string | null>(null)
  const { setToastValues } = useToast()

  const handleCloudinaryUpload = (result: any, key: string) => {
    const id = result.info.public_id
    if (listingDeets[key].value.length < maxImages) {
      listingDeets[key].value = [...listingDeets[key].value, id]
    }
  }

  const handleDeleteFromGallery = async (imgSrc: string, index: number) => {
    selectedGalleryImageId.value = index.toString()
    deletingGallery.value = true
    try {
      const res = await deleteMultipleImages([imgSrc])
      if (res.status === "success") {
        listingDeets.gallery.value = listingDeets.gallery.value.filter(
          (_: any, i: number) => i !== index,
        )
        setToastValues({
          isActive: true,
          message: "Image deleted successfully",
          status: "success",
          duration: 2000,
        })
      }
    } catch (err) {
      console.error(err)
      setToastValues({
        isActive: true,
        message: "Failed to delete image",
        status: "error",
        duration: 2000,
      })
      deletingGallery.value = false
      selectedGalleryImageId.value = null
    }
  }

  const handleDeleteGallery = async () => {
    deletingGallery.value = true
    try {
      await deleteMultipleImages(listingDeets.gallery.value)
      listingDeets.gallery.value = []
      setToastValues({
        isActive: true,
        message: "Gallery images deleted successfully",
        status: "success",
        duration: 2000,
      })
    } catch (err) {
      console.error(err)
      setToastValues({
        isActive: true,
        message: "Failed to delete gallery images",
        status: "error",
        duration: 2000,
      })
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
        onSuccess={(result) => {
          handleCloudinaryUpload(result, "gallery")
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
            status: "error",
            duration: 2000,
          })
        }}
      >
        {({ open }) =>
          listingDeets?.gallery.value.length < maxImages && (
            <Button
              text="Upload To Gallery"
              className="flex flex-row-reverse items-center gap-1 clickable text-white darkblue-gradient hover:scale-99 outline-2 outline-black transition-all duration-300 gloss font-semibold py-3.5 px-8.5 rounded-md"
              onClick={() => open()}
            >
              <Images
                size={16}
                color="white"
                strokeWidth={3}
              />
            </Button>
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
              <div
                className="right-0.5 top-0.5 p-1 absolute cursor-pointer border-1 border-gray-800 rounded-full"
                onClick={() => handleDeleteFromGallery(imgSrc, index)}
              >
                <X
                  width={16}
                  height={16}
                  strokeWidth={3}
                  className="text-red-600 hover:text-red-700 transition-colors"
                />
              </div>
              <CldImage
                src={imgSrc}
                alt="Gallery Image"
                width={100}
                height={100}
                crop={"fill"}
                className="mb-1.5"
              />
              {index.toString() === selectedGalleryImageId.value ||
              deletingGallery.value === true ? (
                <Loader
                  width={30}
                  height={30}
                  strokeWidth={3}
                  className="ml-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600 hover:text-red-700 transition-colors  duration-500 animate-spin"
                />
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
          className="flex items-center justify-center gap-1 clickable text-white darkblue-gradient hover:scale-99 outline-2 outline-black transition-all duration-300 gloss font-semibold py-3 px-8  rounded-md"
          onClick={() => handleDeleteGallery()}
          text="Delete All"
        >
          <X
            size={14}
            color="white"
            strokeWidth={3}
          />
        </Button>
      )}
    </div>
  )
}
