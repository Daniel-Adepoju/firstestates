import Button from "@lib/Button"
import { deleteVideo } from "@lib/server/deleteImage"
import { useSignal } from "@preact/signals-react/runtime"
import { DeleteLoader } from "@utils/loaders"
import { Activity, Loader, VideoIcon, X } from "lucide-react"
import { CldUploadWidget, CldVideoPlayer } from "next-cloudinary"
import { useToast } from "@utils/Toast"
import { max } from "date-fns"

const ListingVideo = ({ listingDeets }: any) => {
  const { setToastValues } = useToast()

  const deletingVideo = useSignal(false)

  const handleCloudinaryUpload = (result: any, key: string) => {
    listingDeets[key].value = result.info.public_id
  }

  const handleDeleteVideo = async () => {
    deletingVideo.value = true
    try {
      console.log("Deleting video with public_id:", listingDeets.video.value)
      await deleteVideo(listingDeets.video.value)
      listingDeets.video.value = null
      setToastValues({
        isActive: true,
        message: "Video deleted successfully",
        status: "success",
        duration: 2000,
      })
    } catch (err) {
      console.error(err)
      setToastValues({
        isActive: true,
        message: "Failed to delete video",
        status: "error",
        duration: 2000,
      })
    } finally {
      deletingVideo.value = false
    }
  }

  return (
    <div className="form_group main_image">
      {!listingDeets?.video.value && (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{
            maxFileSize: 110000000, // 100MB
            multiple: false,
            sources: ["local", "camera", "google_drive"],
          }}
          onSuccess={(result) => {
            handleCloudinaryUpload(result, "video")
            setToastValues({
              isActive: true,
              message: "Video uploaded successfully",
              duration: 2000,
              status: "success",
            })
          }}
          onError={(err) => {
            console.error("Cloudinary Upload Error:", err)
            setToastValues({
              isActive: true,
              message: "Failed to upload video",
              duration: 2000,
              status: "error",
            })
          }}
        >
          {({ open }) => (
            <Button
              text="Upload Video (100MB max)"
              className="flex flex-row-reverse items-center gap-1 clickable text-white darkblue-gradient hover:scale-99 dark:outline-black outline-2 outline-black transition-all duration-300 gloss font-semibold py-3.5 px-8.5 rounded-md"
              onClick={() => open()}
            >
              <VideoIcon
                size={16}
                strokeWidth={3}
                color="white"
              />
            </Button>
          )}
        </CldUploadWidget>
      )}

      {listingDeets?.video.value && (
        <div className="w-full aspect-video relative mt-4 rounded-md overflow-hidden">
          {!deletingVideo.value ? (
            <div
              className="flex items-center justify-center ml-auto p-1 w-6 h-6 cursor-pointer border-1 border-gray-400 dark:border-gray-500 rounded-full"
              onClick={() => handleDeleteVideo()}
            >
              <X
                width={16}
                height={16}
                strokeWidth={3}
                className="text-red-600 hover:text-red-700 transition-colors"
              />
            </div>
          ) : (
            <Loader
              width={16}
              height={16}
              strokeWidth={3}
              className="ml-auto  text-red-600 hover:text-red-700 transition-colors animate-spin"
            />
          )}

          <CldVideoPlayer
            // id={listingDeets.video.value}
            src={listingDeets.video.value}
            controls={true}
            colors={{
              accent: "#032679",
              base: "black",
              text: "#F29829",
            }}
            logo={false}
            className="mt-4 rounded-md"
          />
        </div>
      )}
    </div>
  )
}

export default ListingVideo
