'use client'

import Searchbar from "@components/Searchbar"
import { useSignal, useSignals } from "@preact/signals-react/runtime"
import {Loader} from "@utils/loaders"
import Card,{ CardProps } from "@components/Card"
import {useSearchListings} from "@lib/customApi"
import { useEffect } from "react"
const Search = () => { 
useSignals()
const limit = useSignal(10)
const page = useSignal(1)
const search = useSignal("")
const debounced = useSignal("");
// const schoolSearch = useSignal("")
// const schoolDebounce = useSignal("")
  
useEffect(() => {
    const timeoutId= setTimeout(() => {
      debounced.value = search.value
    }, 560)

    return () => clearTimeout(timeoutId)
  }, [search.value])

// useEffect(() => {
//   const timeoutId = setTimeout(() => {
//     schoolDebounce.value = search.value
//   },560)

//   return clearTimeout(timeoutId)
// }, [schoolSearch.value])

 const {data,isLoading,isError} = useSearchListings({
  limit: limit.value,
  page: page.value,
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
 {isLoading ? <Loader /> :
    <div className="card_list">
  {mapCards}
    </div>}
       </div>
  )
}

export default Search
