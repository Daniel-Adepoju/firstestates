"use client"

import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

const LogoutSuccess = () => {
  return (
    <div className={`mx-auto min-h-screen w-[90%] flex items-center justify-center `}>
      <div
        className={`max-w-lg w-full h-[40%] p-6 rounded-lg shadow-md dark:bg-gray-700/50 dark:text-white  bg-white text-gray-900`}
      >
        <CheckCircle2 
        size={45}
        className="text-green-500 mx-auto  mb-4" />

        <h1 className="text-xl font-bold mb-4 text-center">You’ve successfully logged out!</h1>

        <p className="text-center text-sm mb-6">
          Thank you for using our app. We hope to see you again soon!
        </p>
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/"
            className={`w-[80%] py-4 px-4 rounded-md text-sm text-center font-semibold transition-all duration-300
         dark:text-white dark:bg-goldPrimary
          bg-darkblue text-white hover:scale-99 ease-in
            `}
          >
            Go to Home Page
          </Link>
          <Link
            href="/login"
            className="w-[80%] py-4 px-4 rounded-md  text-sm text-center font-semibold border
               dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white
                border-gray-300 hover:bg-gray-200 text-gray-900"
          >
            Log in Again
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LogoutSuccess
