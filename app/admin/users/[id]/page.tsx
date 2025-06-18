'use client'

import { useParams } from "next/navigation"
import UsersCard from "@components/UsersCard"
import { useGetUser } from "@lib/customApi"
import { Loader } from "@utils/loaders"

const SingleUser = () => {
const { id } = useParams()
const { data: user, isLoading } = useGetUser({ id: id?.toString(), enabled: !!id, page: "1", limit: 1 })
 
if (isLoading) return <Loader className="my-18" />
return (
    <div className='w-full'>
     <UsersCard  user={user}/>    
    </div>
   
  )
}

export default SingleUser