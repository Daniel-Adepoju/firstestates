"use client"
import Link from "next/link"
import { useUser } from "@utils/user"
import { MoreHorizontal } from "lucide-react"

const ContinueGoogle = () => {
  const { session } = useUser()

  if (!session?.user) {
    return (
      <MoreHorizontal
        color="gray"
        size={40}
        className="mt-50 mx-auto animate-pulse"
      />
    )
  }

  if (session?.user.isNewUser === false) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-screen dark:bg-darkGray bg-white p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Successfully Signed In
        </h1>
        {session.user.role === "client" ? (
          <Link
            href="/"
            className="text-center w-70 px-3 py-3 gold-gradient text-white rounded-lg text-lg font-semibold hover:opacity-80 transition"
          >
            Proceed To HomePage
          </Link>
        ) : (
          <Link
            href="/agent"
            className="text-center w-70 px-3 py-3 gold-gradient text-white rounded-lg text-lg font-semibold hover:opacity-80 transition"
          >
            Proceed To Dashboard
          </Link>
        )}
      </div>
    )
  } else {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-screen dark:bg-darkGray bg-white p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Continue Your Registration
        </h1>
        <h1 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          This is your first time signing up with this email
        </h1>
        <p className="text-lg dark:text-gray-400 text-gray-700 mb-8 text-center max-w-md">
          Please choose the type of account you’d like to create:
        </p>
        <div className="flex flex-col items-center justify-center md:flex-row gap-6 ">
          <Link
            href="/continue-google/fields?role=agent"
            className="text-center w-70 px-3 py-3 bg-green-700 text-white rounded-lg text-lg font-semibold hover:bg-green-800 transition"
          >
            I'm an Agent
          </Link>
          <Link
            href="/continue-google/fields?role=client"
            className="text-center w-70 px-3 py-3 dark:gold-gradient gold-gradient text-white rounded-lg text-lg font-semibold hover:opacity-80 transition"
          >
            I'm a Client
          </Link>
        </div>
      </div>
    )
  }
}

export default ContinueGoogle
