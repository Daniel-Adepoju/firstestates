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

  const handleUpload = (result: any) => {
    const id = result.info.public_id
    if (listingDeets.gallery.value.length < maxImages) {
      listingDeets.gallery.value = [...listingDeets.gallery.value, id]
    }
  }

  const handleDeleteSingle = async (idx: number) => {
    selectedGalleryImageId.value = idx
    deletingGallery.value = true
    try {
      const imgId = listingDeets.gallery.value[idx]
      const res = await deleteMultipleImages([imgId])
      if (res.status === "success") {
        listingDeets.gallery.value = listingDeets.gallery.value.filter(
          (_: any, i: number) => i !== idx
        )
      }
    } catch (err) {
      console.log(err)
    } finally {
      deletingGallery.value = false
      selectedGalleryImageId.value = null
    }
  }

  const handleDeleteAll = async () => {
    deletingGallery.value = true
    try {
      await deleteMultipleImages(listingDeets.gallery.value)
      listingDeets.gallery.value = []
    } catch (err) {
      console.log(err)
    } finally {
      deletingGallery.value = false
    }
  }

  return (
    <div className="form_group gallery">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{ multiple: true, maxFiles: maxImages }}
        onSuccess={handleUpload}
      >
        {({ open }) =>
          listingDeets.gallery.value.length < maxImages && (
            <Button
              text="Upload To Gallery"
              className="clickable text-white bg-darkblue hover:scale-99 dark:outline-gray-700 outline-2 outline-black transition-all duration-300 gloss font-bold py-3.5 px-8.5 rounded-md"
              functions={() => open()}
            />
          )
        }
      </CldUploadWidget>

      <div className="galleryImagesContainer flex flex-wrap gap-3 mt-4">
        {listingDeets.gallery.value.map((img: string, idx: number) => (
          <div
            key={idx}
            className="galleryImages relative w-[100px] h-[100px]"
          >
            <CldImage
              src={img}
              alt={`Gallery ${idx}`}
              width={100}
              height={100}
              crop="fill"
              className="rounded-xl"
            />
            <div
              className="absolute top-1 right-1 cursor-pointer z-10"
              onClick={() => handleDeleteSingle(idx)}
            >
              <Image
                src="/icons/cancel.svg"
                alt="Delete"
                width={20}
                height={20}
              />
            </div>
            {selectedGalleryImageId.value === idx && deletingGallery.value && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                <DeleteLoader />
              </div>
            )}
          </div>
        ))}
      </div>

      {listingDeets.gallery.value.length > 1 && (
        <div className="mt-3">
          <Button
            text="Delete All"
            className="directional clickable darkblueBtn"
            functions={handleDeleteAll}
          />
        </div>
      )}

      {deletingGallery.value && selectedGalleryImageId.value === null && (
        <div className="mt-2 flex justify-center">
          <DeleteLoader />
        </div>
      )}

      <p className="mx-auto text-center dark:text-white mt-2">
        A Maximum Of {maxImages} Images Can Be Uploaded To The Gallery
      </p>
    </div>
  )
}
