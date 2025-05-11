'use client'
import Card from "./Card"
import {axiosdata} from "@utils/axiosUrl"
import {useQuery} from "@tanstack/react-query"
import { useSignal, useSignals } from "@preact/signals-react/runtime"
const CardList = () => {
useSignals()
const limit = useSignal(10)
const page = useSignal(1)
const search = useSignal("")

const getListings = async (page: number) => {
 try {
  const res = await axiosdata.value.get(`/api/listings?limit=${limit.value}?page=${page}?search=${search.value}`)
  return res.data
} catch (err) {
  console.log(err)
}
}

const {data,isLoading,isError} = useQuery({
  queryKey: ["listings", {page:page.value}],
  queryFn: () => getListings(page.value),
})


const mapCards = data?.posts?.map((item:any) => {
return <Card key={item._id} listing={item} edit={false} />
})

// if(isLoading) {
//   return (
//     <div className="loading">
//       <h1>Loading...</h1>
//     </div>
//   )
// }
// if(isError) {
//    return (
//     <div className="card">Failure</div>
//    )
// }
  return (
  
    <div className="card_list">
{mapCards}
    </div>
  )
}

export default CardList
