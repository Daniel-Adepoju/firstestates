'use client'

import Searchbar from "@components/Searchbar"
import { useSignal, useSignals } from "@preact/signals-react/runtime"
import {Loader} from "@utils/loaders"
import Card,{ CardProps } from "@components/Card"
import {useGetListings} from "@lib/customApi"
import { useEffect } from "react"
const Search = () => { 
useSignals()
const limit = useSignal(10)
const page = useSignal(1)
const search = useSignal("")
const debounced = useSignal("");

  useEffect(() => {
    const handler = setTimeout(() => {
      debounced.value = search.value
    }, 560)

    return () => clearTimeout(handler)
  }, [search.value]);


 const {data,isLoading,isError} = useGetListings({
  limit: limit.value,
  page: page.value,
  search: debounced.value,
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
    <>
<Searchbar
search={search.value}
setSearch={(e) => search.value = e.target.value}
/>  
 {isLoading ? <Loader /> :
    <div className="card_list">
  {mapCards}
    </div>}
       </>
  )
}

export default Search
