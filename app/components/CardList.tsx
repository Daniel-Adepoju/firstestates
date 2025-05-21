'use client'
import Card from "./Card"
import Searchbar from "./Searchbar"
import { useSignal, useSignals } from "@preact/signals-react/runtime"
import {Loader} from "@utils/loaders"
import { CardProps } from "./Card"
import {useGetListings} from "@lib/customApi"
import { useRouter } from "next/navigation"
const CardList = () => {
useSignals()
const limit = useSignal(10)
const page = useSignal(1)
const search = useSignal("")
const router = useRouter()


const {data,isLoading,isError} = useGetListings({
  limit: limit.value,
  page: page.value,
  search: search.value})

 const mapCards = data?.posts?.map((item:CardProps['listing']) => {
return <Card key={item._id} listing={item} edit={false} />
})

if(isLoading) {
return (
    <Loader />
  )
}
if(isError) {
   return (
    <div className="card">Failed</div>
   )
}
  return (
    <>
<Searchbar
goToSearch={() => router.push('/search')}
/>
<div className="subheading w-full text-center">Recent Listings</div>
    <div className="card_list">
   {mapCards}
    </div>
       </>
  )
}

export default CardList
