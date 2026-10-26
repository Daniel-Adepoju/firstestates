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
import { useNotification } from "@utils/Toast"
import { useRouter } from "next/navigation"
import { getSession } from "next-auth/react"
import { Camera, Check, MapPin, MoreHorizontal, Phone, School, UserRound } from "lucide-react"
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
    const updatedFields = { username, phone, whatsapp, school, address }
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
        address,
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
    <div className="w-full px-4 pb-8 mb-14 md:mb-4 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-border/60 bg-background/55 shadow-sm backdrop-blur-md">
        <div className="border-b border-border/50 px-5 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <UserRound size={21} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Account details
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">Edit your profile</h1>
            </div>
          </div>
          {/* <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Keep your information current so clients and the First Estates team can reach you
            easily.
          </p> */}
        </div>
        {session?.user ? (
          <>
            <div className="flex flex-col items-center gap-3 px-5 py-7 sm:px-8">
              <div className="relative rounded-full p-1.5 ring-1 ring-border/70">
                <CldImage
                  src={session?.user.profilePic}
                  width={1080}
                  height={1000}
                  crop={"fill"}
                  alt="User Profile Picture"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <CldUploadWidget
                  options={{ sources: ["local", "camera", "google_drive"] }}
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onSuccess={(result) => updatePic(result)}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      aria-label="Change profile picture"
                      className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-102 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => open()}
                    >
                      <Camera size={15} />
                    </button>
                  )}
                </CldUploadWidget>
              </div>
              <div className="flex min-h-6 w-full justify-center">
                {updatingProfilePic && (
                  <div className="flex flex-row items-center gap-2 text-sm text-muted-foreground">
                    <span>Updating profile picture</span>
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
              className="grid w-full grid-cols-1 gap-5 border-t border-border/50 px-5 py-6 sm:px-8 lg:grid-cols-2"
            >
              {/* Username */}
              <div className="form_item">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background/60 p-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>

              {/* School Select */}
              {session?.user?.role === "client" && session?.user.school && (
                <div className="form_item">
                  <label
                    className="mb-2 flex items-center gap-2 text-sm font-semibold"
                    htmlFor="school"
                  >
                    <School
                      size={16}
                      className="text-primary"
                    />
                    School
                  </label>
                  <select
                    id="school"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background/60 p-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
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
              {session?.user?.role === "agent" && (
                <>
                  <div className="form_item">
                    <label
                      className="mb-2 flex items-center gap-2 text-sm font-semibold"
                      htmlFor="address"
                    >
                      <MapPin
                        size={16}
                        className="text-primary"
                      />
                      Office Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="w-full rounded-xl border border-input bg-background/60 p-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                  <div className="form_item">
                    <label
                      className="mb-2 flex items-center gap-2 text-sm font-semibold"
                      htmlFor="phone"
                    >
                      <Phone
                        size={16}
                        className="text-primary"
                      />
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background/60 p-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="form_item">
                    <label
                      className="mb-2 flex items-center gap-2 text-sm font-semibold"
                      htmlFor="whatsapp"
                    >
                      <Phone
                        size={16}
                        className="text-greenPrimary"
                      />
                      WhatsApp Number
                    </label>
                    <input
                      id="whatsapp"
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background/60 p-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="col-span-1 w-[70%] mx-auto md:w-full md:mx-0 flex justify-end lg:col-span-2 p-4 py-6">
                <Button
                  type="submit"
                  text="Update Profile"
                  className="clickable directional gold-gradient flex w-full items-center justify-center gap-2 rounded-xl p-4 py-6 text-sm font-bold text-white shadow-sm transition-transform hover:scale-[1.01] sm:w-60"
                >
                  {isUpdating && <WhiteLoader />}
                  {!isUpdating && <Check size={17} />}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col gap-3 p-5 sm:p-8">
            <Skeleton className="mx-auto h-20 w-20 rounded-full bg-muted" />
            <Skeleton className="mx-auto h-10 w-full max-w-md rounded-md bg-muted" />
            <Skeleton className="mx-auto h-10 w-full max-w-md rounded-md bg-muted" />
          </div>
        )}
      </section>
    </div>
  )
}

export default EditProfile
