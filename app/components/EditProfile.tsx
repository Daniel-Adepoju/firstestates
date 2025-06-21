"use client"
import { useState, useEffect } from "react"
import { useUser } from "@utils/user"
import { CldImage, CldUploadWidget,CloudinaryUploadWidgetResults } from "next-cloudinary"
import Image from "next/image"
import { Skeleton } from "@components/ui/skeleton"
import { schools } from "@lib/constants"
import Button from "@lib/Button"
import { WhiteLoader } from "@utils/loaders"
import { updateUser, updateProfilePic } from "@lib/server/auth"
import { useNotification } from "@lib/Notification"
import { useRouter } from "next/navigation"
import { CloudinaryResult } from "./agent/ListingForm"

const EditProfile = () => {
  const { session, update } = useUser()
  const [username, setUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [school, setSchool] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const notification = useNotification()
  const router = useRouter()

  useEffect(() => {
    if (session?.user) {
      setUsername(session?.user.username || "")
      setPhone(session?.user.phone || "")
      setWhatsapp(session?.user.whatsapp || "")
      setSchool(session?.user.school || "")
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdating(true)
    const updatedFields = { username, phone, whatsapp, school }
    const filteredFields = Object.fromEntries(
      Object.entries(updatedFields).filter(
        ([key, value]) => value !== "" && value !== undefined && value !== null
      )
    )
    try {
      await update({
        ...session?.user,
        username: username,
        phone,
        whatsapp,
        school,
      })
      const res = await updateUser(filteredFields)
      notification.setIsActive(true)
      notification.setMessage(res.message)
      notification.setType(res.status)
      setIsUpdating(false)
      router.back()
    } catch (err) {
      setIsUpdating(false)
      console.error("Failed to update profile:", err)
    }
  }

  const updatePic = async (result:CloudinaryUploadWidgetResults)  => {
     const resultInfo = result.info as CloudinaryResult
    await update({
      ...session?.user,
      profilePic: resultInfo.public_id,
    })
    await updateProfilePic({ oldPic: session?.user.profilePic, newPic: resultInfo.public_id})
  }

  return (
    <div className="dark:text-white w-full flex flex-col">
     <div className="subheading mb-4 mx-auto">Edit Your Profile</div>
      {session?.user ? (
        <div className="flex flex-col items-center w-full gap-4">
          <div className="relative">
            <CldImage
              src={session.user.profilePic}
              width={120}
              height={120}
              crop={"fill"}
              alt="User Profile Picture"
              className="rounded-full"
            />
            <CldUploadWidget
              options={{ sources: ["local", "camera", "google_drive"] }}
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={(result) => updatePic(result)}
            >
              {({ open }) => (
                <Image
                  src="/icons/edit.svg"
                  width={40}
                  height={40}
                  alt="edit"
                  className="clickable cursor-pointer rounded-full absolute bottom-0 right-0 bg-white p-2"
                  onClick={() => open()}
                />
              )}
            </CldUploadWidget>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col item-center max-w-md space-y-4"
          >
            {/* Username */}
            <div className="form_group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded p-2 dark:bg-gray-600 dark:text-white"
              />
            </div>

            {/* School Select */}
            {session?.user.school && (
              <div className="form_group">
                <label htmlFor="school">School</label>
                <select
                  id="school"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full border rounded p-2 dark:bg-gray-600 dark:text-white"
                >
                  <option value="">Select a school</option>
                  {schools.map((sch) => (
                    <option
                      key={sch}
                      value={sch}
                    >
                      {sch}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Unique To Agents */}
            {/* Phone */}
            {session?.user.role === "agent" && (
              <>
                <div className="form_group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border rounded p-2 dark:bg-gray-600 dark:text-white"
                  />
                </div>

                {/* WhatsApp */}
                <div className="form_group">
                  <label htmlFor="whatsapp">WhatsApp Number</label>
                  <input
                    id="whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full border rounded p-2 dark:bg-gray-600 dark:text-white"
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                text="Update Profile"
                className="clickable darkblueBtn directional"
              >
                {" "}
                {isUpdating && <WhiteLoader />}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Skeleton className=" rounded-full  bg-gray-600 mx-auto w-40 h-40" />
          <Skeleton className="rounded bg-gray-600 mx-auto w-100 h-10" />
          <Skeleton className="rounded bg-gray-600 mx-auto w-100 h-10" />
        </div>
      )}
    </div>
  )
}

export default EditProfile
