import { useQuery } from "@tanstack/react-query";
import { axiosdata } from "@utils/axiosUrl";

interface Config {
  page: number;
  limit: number;
  search: string;
  enabled?: boolean;
}

interface ListingParams {
   page: number,
    search: string 
}

export const useGetListings = ({page,limit,search,enabled=true}: Config) => {
  const getListings = async ({page,search}:ListingParams) => {
    const res = await axiosdata.value.get(`/api/listings?limit=${limit}&page=${page}&search=${search}`)
    return res.data;
  }

  const {data,isLoading,isError} = useQuery({
    queryKey: !enabled ?  [] :
     ["listings", { page, limit,search}],
    queryFn:() => getListings({page,search}),
    enabled: enabled,
  })

  return {data,isLoading,isError}
}

export const useGetSingleListing = (listingId: string | null) => {
const getListing = async () => {
    try {
      const res = await axiosdata.value.get(`/api/listings/${listingId}`)
      return res.data
    } catch (err) {
      console.error(err)
    }
  }

  const { data, isLoading,isError } = useQuery({
    queryKey: ["listing",{listingId}],
    queryFn: () => getListing(),
  })

  return {data,isLoading,isError}
}