"use client"
import Link from "next/link"
import { useUser } from "@utils/user"
import { CheckCircle2, MoreHorizontal, User2 } from "lucide-react"
import { AgentIcon } from "@components/custom-ui/Icons"

const ContinueGoogle = () => {
  const { session } = useUser()

  if (!session?.user) {
    return (
      <MoreHorizontal
        size={40}
        className="mt-50 mx-auto animate-pulse text-gray-500 dark:text-gray-400"
      />
    )
  }

  if (session?.user?.isNewUser === false) {
    return (
      <div className="w-[95%] lg:w-[90%] mx-auto mt-25 flex flex-col items-center justify-center min-h-[70vh] dark:bg-darkGray bg-white p-6 shadow rounded-lg">
        <CheckCircle2
          size={30}
          className="w-20 h-20 text-green-500 mb-8"
        />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-5">
          Successfully Signed In
        </h1>
        <Link
          href={session?.user?.role === "client" ? "/" : "/agent"}
          className="text-center w-70 px-3 py-3 bg-darkblue dark:bg-goldPrimary shadow text-gray-100 rounded-xl text-md font-bold hover:opacity-80 duration-300 transition active:scale-[0.98]"
        >
          {session?.user?.role === "client" ? "Go to Homepage" : "Go to Dashboard"}
        </Link>
      </div>
    )
  } else {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-screen dark:bg-darkGray bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Continue Your Registration
        </h1>
        <h1 className="text-md font-bold text-gray-800 dark:text-white mb-4">
          This is your first time signing up with this email
        </h1>
        <p className="text-lg dark:text-gray-400 text-gray-700 mb-8 text-center max-w-md">
          Please choose the type of account you’d like to create:
        </p>
        <div className="w-full flex flex-col items-center justify-center md:flex-row gap-6 ">
          <Link
            href="/continue-google/fields?role=agent"
            className="flex flex-row-reverse items-center  justify-between gap-6 w-70 px-3 py-3 hover:bg darkblue-gradient text-white rounded-lg text-md font-semibold hover:opacity-80 transition"
          >
            <AgentIcon className="w-10 h-10 text-gray-100 rounded-full" />
            <span className="pl-4"> Agent </span>
          </Link>
          <Link
            href="/continue-google/fields?role=client"
            className="flex flex-row-reverse items-center justify-between gap-6 w-70 px-3 py-3 dark:gold-gradient gold-gradient text-white rounded-lg text-md font-semibold hover:opacity-80 transition"
          >
            <User2 className="w-10 h-10 text-gray-100 rounded-full" />
            <span className="pl-4"> Client </span>
          </Link>
        </div>
      </div>
    )
  }
}

export default ContinueGoogle
