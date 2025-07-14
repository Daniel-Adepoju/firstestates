'use client'

import { useParams } from "next/navigation"
import UsersCard from "@components/UsersCard"
import { useGetUser } from "@lib/customApi"
import { Skeleton } from "@components/ui/skeleton"

const SingleUser = () => {
const { id } = useParams()
const { data: user, isLoading } = useGetUser({ id: id?.toString(), enabled: !!id, page: "1", limit: 1 })
 
if (isLoading) {
 return <Skeleton className="w-100 h-30 md:w-3/4 mx-auto mt-10 bg-gray-500/20"/>
  }
 
return (
    <div className='w-100 md:w-3/4 mx-auto mt-10'>
     <UsersCard  user={user}/>    
    </div>
   
  )
}

export default SingleUser