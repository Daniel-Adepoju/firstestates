import { useQuery } from "@tanstack/react-query";
import { axiosdata } from "@utils/axiosUrl";

interface Config {
  page: number;
  limit: number;
  location: string;
  price?: string;
  school?:string;
  enabled?: boolean;
}

// interface ListingParams {
//    page: number,
// }

export const useGetListings = ({page,limit,location,school,price}: Config) => {
  const getListings = async (page:number) => {
    const res = await axiosdata.value.get(`/api/listings?limit=${limit}&page=${page}&location=${location}&school=${school}&price=${price}`)
    return res.data;
  }

  const {data,isLoading,isError} = useQuery({
    queryKey:["listings",page,limit,location,school,price],
    queryFn:() => getListings(page),
  })

  return {data,isLoading,isError}
}

export const useGetAgentListings = (id: string, { enabled = false }: { enabled?: boolean }) => {
  const getListings = async () => {
    const res = await axiosdata.value.get(`/api/agent/listings?id=${id}`)
    return res.data;
  }

  const {data, isLoading, isError} = useQuery({
    queryKey: ["agentListings",id],
    queryFn: () => getListings(),
    enabled,
  })

  return {data, isLoading, isError}
}


export const useSearchListings = ({page,limit,location,school,enabled=true}: Config) => {
  const getListings = async (page:number) => {
    const res = await axiosdata.value.get(`/api/listings/search?limit=${limit}&page=${page}&location=${location}&school=${school}`)
    return res.data;
  }

  const {data,isLoading,isError} = useQuery({
    queryKey: !enabled ?  [] :
     ["searchListings", { page, limit,location,school}],
    queryFn:() => getListings(page),
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

export const useGetPopularListings = () => {
const fetchPopularListings = async () => {
  const res = await axiosdata.value.get('/api/listings/popular');
  return res.data;
};

  const { data, isLoading, isError } = useQuery({
    queryKey: ['popularListingsThisWeek'],
    queryFn:() => fetchPopularListings(),
  });

  return {data,isLoading}
}