"use client"
import { useState, useEffect } from "react"
import { useUser } from "@utils/user"
import { CldImage, CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary"
import Image from "next/image"
import { Skeleton } from "@components/ui/skeleton"
import { useSchools } from "@lib/useSchools"
import Button from "@lib/Button"
import { WhiteLoader } from "@utils/loaders"
import { updateUser, updateProfilePic } from "@lib/server/auth"
import { useNotification } from "@lib/Notification"
import { useRouter } from "next/navigation"
import { getSession } from "next-auth/react"
import { MoreHorizontal } from "lucide-react"
const EditProfile = () => {
  const { session, update } = useUser()
  const [username, setUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [school, setSchool] = useState("")
  const { schools } = useSchools()
  const [address, setAddress] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const notification = useNotification()
  const router = useRouter()
  const [updatingProfilePic, setUpdatingProfilePic] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setUsername(session?.user.username || "")
      setPhone(session?.user.phone || "")
      setWhatsapp(session?.user.whatsapp || "")
      setSchool(session?.user.school || "")
      setAddress(session?.user.address || "")
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdating(true)
    const updatedFields = { username, phone, whatsapp, school }
    const filteredFields = Object.fromEntries(
      Object.entries(updatedFields).filter(
        ([key, value]) => value !== "" && value !== undefined && value !== null,
      ),
    )
    try {
      await update({
        ...session?.user,
        username: username,
        phone,
        whatsapp,
        school,
      })
      await getSession()
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

  const updatePic = async (result: CloudinaryUploadWidgetResults) => {
    const resultInfo = result.info as any
    setUpdatingProfilePic(true)
    await update({
      ...session?.user,
      profilePic: resultInfo.public_id,
    })
    await updateProfilePic({ oldPic: session?.user.profilePic, newPic: resultInfo.public_id })
    await getSession()
    setUpdatingProfilePic(false)
  }

  return (
    <div className="dark:text-white w-full flex flex-col lg:px-8">
      <div className="subheading mb-4 mx-auto">Edit Your Profile</div>
      {session?.user ? (
        <>
          <div className="flex flex-col items-center w-full gap-4">
            <div className="relative">
              <CldImage
                src={session.user.profilePic}
                width={1080}
                height={1000}
                crop={"fill"}
                alt="User Profile Picture"
                className="w-20 h-20 rounded-full"
              />
              <CldUploadWidget
                options={{ sources: ["local", "camera", "google_drive"] }}
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={(result) => updatePic(result)}
              >
                {({ open }) => (
                  <Image
                    src="/icons/edit.svg"
                    width={25}
                    height={25}
                    alt="edit"
                    className="clickable cursor-pointer rounded-full absolute bottom-0 right-0 bg-gray-500/80 p-1"
                    onClick={() => open()}
                  />
                )}
              </CldUploadWidget>
            </div>
            <div className="w-full flex  flex-row justify-center">
              {updatingProfilePic && (
                <div className=" flex  flex-row items-center gap-2">
                  <span className="text-sm text-gray-500">Updating Profile Picture</span>
                  <MoreHorizontal
                    size={30}
                    color="gray"
                    className="animate-pulse"
                  />
                </div>
              )}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="
             my-4 w-full min-h-10 flex flex-col items-center  space-y-4
             lg:grid lg:grid-cols-2 lg:gap-4 justify-center px-4
            "
          >
            {/* Username */}
            <div className="form_item">
              <label
                className="text-sm font-semibold"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded-lg p-3 dark:bg-darkGray dark:text-white"
              />
            </div>

            {/* School Select */}
            {session?.user.role === "client" && session?.user.school && (
              <div className="form_item">
                <label
                  className="text-sm font-semibold"
                  htmlFor="school"
                >
                  School
                </label>
                <select
                  id="school"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full border rounded-lg p-3 dark:bg-darkGray dark:text-white"
                >
                  <option value="">Select a school</option>
                  {schools.map((school: School) => (
                    <option
                      key={school._id}
                      value={school?.shortname}
                    >
                      {school?.shortname} ({school?.fullname})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Unique To Agents */}
            {/* Phone */}
            {session?.user.role === "agent" && (
              <>
                <div className="form_item">
                  <label
                    className="text-sm font-semibold"
                    htmlFor="address"
                  >
                    Office Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full border rounded-lg p-3 dark:bg-darkGray dark:text-white"
                  />
                </div>
                <div className="form_item">
                  <label
                    className="text-sm font-semibold"
                    htmlFor="phone"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border rounded-lg p-3 dark:bg-darkGray dark:text-white"
                  />
                </div>

                {/* WhatsApp */}
                <div className="form_item">
                  <label
                    className="text-sm font-semibold"
                    htmlFor="whatsapp"
                  >
                    WhatsApp Number
                  </label>
                  <input
                    id="whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full border rounded-lg p-3 dark:bg-darkGray dark:text-white"
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="col-span-2 mx-auto w-60 md:w-70 flex justify-center">
              <Button
                type="submit"
                text="Update Profile"
                className="text-white font-bold clickable gold-gradient directional text-sm rounded-lg w-full p-6"
              >
                {" "}
                {isUpdating && <WhiteLoader />}
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className="flex flex-col gap-3">
          <Skeleton className="rounded-full bg-gray-600 mx-auto w-20 h-20" />
          <Skeleton className="rounded-md bg-gray-600 mx-auto w-100 h-10" />
          <Skeleton className="rounded-md bg-gray-600 mx-auto w-100 h-10" />
        </div>
      )}
    </div>
  )
}

export default EditProfile
