"use client"
import { useRouter } from "next/navigation"
import { Sun, Moon, LogOut, User } from "lucide-react"
import { useDarkMode } from "@lib/DarkModeProvider"
import { logOut } from "@lib/server/auth"
import { useRef } from "react"
import { LogOutModal } from "./Modals"

interface SettingProps {
  editProfile: string
}

export default function Settings({ editProfile }: SettingProps) {
  const router = useRouter()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const logOutRef = useRef<HTMLDialogElement>(null)

  const openDialog = () => {
    logOutRef.current?.showModal()
  }
  const handleEditProfile = () => {
    router.push(editProfile)
  }

  const handleLogout = async () => {
    await logOut()
  }

  return (
    <div className="w-full bg-white dark:bg-gray-700 rounded-2xl shadow-md p-4 space-y-3">
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Settings</h2>
      <button
        onClick={handleEditProfile}
        className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-darkGray hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200"
      >
        <User size={20} />
        Edit Profile
      </button>

      <button
        onClick={() => toggleDarkMode()}
        className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-darkGray hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        {darkMode ? "Activate Light Mode" : "Activate Dark Mode"}
      </button>

      <button
        onClick={openDialog}
        className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-700 hover:bg-red-200 dark:hover:bg-red-600 text-red-800 dark:text-red-200"
      >
        <LogOut size={20} />
        Log Out
      </button>

      <LogOutModal
        ref={logOutRef}
        logOut={handleLogout}
        //  setDeleting={setDeleting}
        //  listingId={listing?._id ?? ""}
      />
    </div>
  )
}
