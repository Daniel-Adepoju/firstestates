"use client"

import { useSearchParams } from "next/navigation"
import { useUser } from "@utils/user"
import RoomateCard from "@components/RoomateCard"

const SchoolFocus = () => {
  const searchParams = useSearchParams()
  const school = searchParams.get("school")
  const { session } = useUser()
  const userName = session?.user?.username
  const displayName = userName ? `, ${userName}` : ""

  return (
    <div className="w-full mt-20 mb-10 pb-12">
      {school && (
        <h1 className="text-3xl font-bold text-center mb-1 headersFont capitalize">
          School Focus - {school}
        </h1>
      )}

      <p className="text-center text-sm p-2 text-gray-700 dark:text-gray-200">
        {`Welcome to School Focus${displayName}. Here you can find listings and roommate requests near your school of choice.`}
      </p>

      {/* Future header components can go here */}

      {/* Main content for listings and roommate requests */}

      <h2 className="headersFont mb-4 px-4 text-lg">Roomate Requests</h2>
      {/*roomate requests container*/}
      <div className="grid grid-flow-col h-90 gap-6 p-2  snap-x snap-mandatory overflow-x-scroll">
        {Array.from({ length: 12 }).map((_, i) => (
          <RoomateCard key={i}/>
        ))}
      </div>

      {/*listings in school*/}
      <h2 className="headersFont mb-4 px-4 text-lg capitalize">Listings in {school}</h2>
    </div>
  )
}

export default SchoolFocus
