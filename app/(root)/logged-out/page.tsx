"use client"

import Link from "next/link"
import { useDarkMode } from "@lib/DarkModeProvider"

const LogoutSuccess = () => {
  const { darkMode } = useDarkMode()

  return (
    <div className={`mx-auto min-h-screen w-[90%] flex items-center justify-center `}>
      <div
        className={`max-w-lg w-full p-6 rounded-lg shadow-md dark:bg-gray-700/50 dark:text-white  bg-white text-gray-900`}
      >
        <h1 className="text-2xl font-bold mb-4 text-center">You’ve successfully logged out!</h1>
        <p className="text-center mb-6">
          Thank you for using our app. We hope to see you again soon!
        </p>
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className={`w-full py-2 px-4 rounded-md text-center font-semibold transition-colors
        dark:bg-coffee dark:text-white
          darkblue-gradient text-white
            `}
          >
            Go to Home Page
          </Link>
          <Link
            href="/login"
            className={`w-full py-2 px-4 rounded-md text-center font-semibold border ${
              darkMode
                ? "border-gray-600 hover:bg-gray-700 text-white"
                : "border-gray-300 hover:bg-gray-200 text-gray-900"
            }`}
          >
            Log in Again
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LogoutSuccess
