"use client"

import { useUser } from "@utils/user"
import { Trash, Loader2 } from "lucide-react"
import { useGetInhabitants } from "@lib/customApi"
import { CldImage } from "next-cloudinary"
import { DeleteResident } from "@components/agent/ResidentFunctions"

const ManageResidents = () => {
  const { session } = useUser()
  const isResult = session?.user?.tierOne || session?.user?.tierTwo
  const { data, isLoading } = useGetInhabitants({
    listingId: "",
    limit: 10,
    agent: session?.user?.id,
    search: '',
  })

  console.log({ data })
  //   if (!isResult) {
  //     return (
  //       <h2 className='text-amber-500 mt-30 font-bold text-lg text-center'>
  //         Unauthorized
  //       </h2>
  //     )
  //   }
  if (isLoading) {
    return (
      <div>
        {" "}
        <Loader2 className="animate-spin" />
      </div>
    )
  }
  return (
    <div className="text-foreground w-full">
      {/* Heading */}
      <h2 className="otherHead text-center text-md font-bold mx-auto w-70">
        Manage Your Residents
      </h2>

      {/* Residents List */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data?.pages.flatMap((items) =>
          items.inhabitants.map((resident: any) => (
            <div
              key={resident._id}
              className="flex flex-col border-2  dark:border-gray-500/70 bg-muted/10 dark:bg-black/20 rounded-2xl p-2 hover:shadow-md dark:hover:shadow-gray-700 transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Profile Pic */}
                <CldImage
                  src={resident?.user?.profilePic}
                  alt="dp"
                  width={30}
                  height={30}
                  crop="auto"
                  className="object-fill rounded-full"
                />

                {/* Info */}
                <div className="flex flex-col">
                  <span className="font-semibold">{resident?.user?.username}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {resident?.user?.email}
                  </span>
                </div>

                {/* Listing image */}
                <CldImage
                  src={resident?.listing?.mainImage}
                  alt="dp"
                  width={100}
                  height={60}
                  crop="fit"
                  gravity="north_west"
                  className="object-fill ml-auto rounded-md border-2"
                />
              </div>

              {/* bottom */}
              <div className="flex items-center justify-self-end justify-between px-2 mt-2">
                <span className="text-sm">
                  See Listing:
                  <span className="cursor-pointer pl-1 mt-1 text-xs text-blue-500 dark:text-amber-400 font-medium">
                    {resident?.listing?.location}
                  </span>
                </span>

             <DeleteResident 
             trash={true}
             inhabitantId={resident._id}
             className="bg-white dark:bg-black"
             />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ManageResidents
