'use client'
import Searchbar from "@components/Searchbar"
import { useSignal, useSignals } from "@preact/signals-react/runtime"
import {Loader} from "@utils/loaders"
import Card,{ CardProps } from "@components/Card"
import {useSearchListings} from "@lib/customApi"
import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Pagination from "@components/Pagination"

const Search = () => { 
useSignals()
const limit = useSignal(10)
const params = useSearchParams()
const router = useRouter()
let page = params.get('page') || '1'
const search = useSignal("")
const debounced = useSignal("");
const searchParams = new URLSearchParams(params.toString())

useEffect(() => {
    const timeoutId= setTimeout(() => {
       searchParams.set('page', '1')
       router.push(`?${searchParams.toString()}`)
      debounced.value = search.value
    }, 560)

    return () => clearTimeout(timeoutId)
  }, [search.value])


 const {data,isLoading,isError} = useSearchListings({
  limit: limit.value,
  page: page,
  location: debounced.value,
  school: debounced.value,
  enabled: search.value.trim() !== ""
}
)

 const mapCards = data?.posts?.map((item:CardProps['listing']) => {
return <Card key={item._id} listing={item} edit={false} />
})

if(isError) {
   return (
    <div className="card">Failed</div>
   )
}
  return (
    <div className="w-full flex flex-col items-end pr-2">
<Searchbar
search={search.value}
setSearch={(e) => search.value = e.target.value}
/>  
 {isLoading ? <Loader className='my-50'/> :
    <div className="card_list">
  {mapCards}
    </div>}
     {data && !isLoading && <Pagination
      currentPage={Number(data?.cursor)}
      totalPages={Number(data?.numOfPages)}/>}
       </div>
  )
}

export default Search
