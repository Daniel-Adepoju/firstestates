import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { axiosdata } from "@utils/axiosUrl";

interface Config {
  page: string;
  limit: number;
  location?: string;
   minPrice?: string;
   maxPrice?: string;
   beds?:string;
   baths?:string;
   toilets?:string;
  school?:string;
  enabled?: boolean;
  id?:string;
  search?: string;
  listingId?: string;
  agentName?: string;
  status?:string;
}


// interface ListingParams {
//    page: number,
// }




// Users
export const useGetUsers = ({page,limit,search}: Config) => {
  const getUsers = async (page:string) => {
    const res = await axiosdata.value.get(`/api/users?limit=${limit}&page=${page}&search=${search}`)
    return res.data; 
  }

  
  const {data,isLoading,isError} = useQuery({
    queryKey:['users',page,search],
    queryFn:() => getUsers(page),
  })

  return {data,isLoading,isError}
}

export const useGetUser = ({id,enabled}: Config) => {
  const getUser = async () => {
    const res = await axiosdata.value.get(`/api/users/${id}`)
    return res.data;
  }

  const {data,isLoading,isError} = useQuery({
    queryKey:['user',id],
    queryFn:() => getUser(),
    enabled,
  })

  return {data,isLoading,isError}
}

// Listings
export const useGetListings = ({
  page,limit,location='',school='',
  minPrice='',maxPrice='',beds='',baths='',toilets='',status='',
}: Config) => {
  const getListings = async (page:string) => {
  const res = await axiosdata.value.get(
  `/api/listings?limit=${limit}&page=${page}` +
  `&location=${location}&school=${school}` +
  `&minPrice=${minPrice}&maxPrice=${maxPrice}` +
  `&beds=${beds}&baths=${baths}&toilets=${toilets}` +
  `&status=${status}`
);

    return res.data;
  }

  const {data,isLoading,isError} = useQuery({
    queryKey:["listings",page,limit,location,school,minPrice,maxPrice,beds,baths,toilets,status],
    queryFn:() => getListings(page),
  })

  return {data,isLoading,isError}
}

export const useSearchListings = ({page,limit,location,school,agentName='',enabled=true}: Config) => {
  const getListings = async (page:string) => {
    const res = await axiosdata.value.get(`/api/listings/search?limit=${limit}&page=${page}&location=${location}&school=${school}&agentName=${agentName}`);
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

export const useGetSingleListing = (listingId: string | null, agent=false) => {
const getListing = async () => {
      const url = agent
        ? `/api/listings/${listingId}?agent=${agent}`
        : `/api/listings/${listingId}`;
      const res = await axiosdata.value.get(url);
      return res.data
  }

  const { data, isLoading,isError } = useQuery({
    queryKey: ["listing",{listingId}],
    queryFn: () => getListing(),
    enabled: !!listingId
  })

  return {data,isLoading,isError}
}

export const useGetPopularListings = () => {
const fetchPopularListings = async () => {
  const res = await axiosdata.value.get('/api/listings/popular');
  return res.data;
};

  const { data, isLoading, isError, } = useQuery({
    queryKey: ['popularListingsThisWeek'],
    queryFn:() => fetchPopularListings(),
  });

  return {data,isLoading}
}

export const useGetFeaturedListings = () => {
  const fetchFeaturedListings = async () => {
    const res = await axiosdata.value.get('/api/listings/featured');
    return res.data; 
  }
  const {data,isLoading,isError} = useQuery({
    queryKey: ['featuredListings'],
    queryFn: () => fetchFeaturedListings(), 
  })
  return {data,isLoading,isError}
}

export const useGetAppointments = ({page,limit}:Config) => {
  const getAppointment = async () => {
    const res = await axiosdata.value.get(`/api/listings/appointment?page=${page}&limit=${limit}`)
    return res.data;
  }
  const {data,isLoading,isError} = useQuery({
    queryKey: ['appointments',page],
    queryFn: () => getAppointment(),
  })

  return {data,isLoading}
}
export const useGetWishLists = ({limit}:Config) => {
  const getWishLists = async (page:string) => {
    const res = await axiosdata.value.get(`/api/listings/wishlists?page=${page}&limit=${limit}`)
    return res.data;
  }
  const {data,isLoading,isFetchingNextPage,fetchNextPage,hasNextPage,isError} = useInfiniteQuery({
    queryKey: ['wishlists'],
   initialPageParam: 1,
     getNextPageParam: (prevData: any) => {
      return prevData?.cursor && prevData?.cursor !== prevData.numOfPages
         ? prevData.cursor + 1
         : undefined;
    },
    queryFn: ({ pageParam = 1 }) => getWishLists(String(pageParam)),
  })

  return {data,isLoading,isFetchingNextPage,fetchNextPage,hasNextPage}
}

export const useGetReported = ({limit}:Config) => {
  const getReported = async (page:string) => {
    const res = await axiosdata.value.get(`/api/listings/reported?page=${page}&limit=${limit}`)
    return res.data;
  }
  const {data,isLoading,isFetchingNextPage,fetchNextPage,hasNextPage,isError} = useInfiniteQuery({
    queryKey: ['reported'],
   initialPageParam: 1,
     getNextPageParam: (prevData: any) => {
      return prevData?.cursor && prevData?.cursor !== prevData.numOfPages
         ? prevData.cursor + 1
         : undefined;
    },
    queryFn: ({ pageParam = 1 }) => getReported(String(pageParam)),
  })

  return {data,isLoading,isFetchingNextPage,fetchNextPage,hasNextPage}
}


// Agents
export const useGetAgentListings = ({id,page,limit,location,school,enabled=false} :Config) => {
  const getListings = async (page:string) => {
    const res = await axiosdata.value.get(`/api/agent/listings?id=${id}&limit=${limit}&page=${page}&school=${school}&location=${location}`)
    return res.data;
  }

  const {data, isLoading, isError} = useQuery({
    queryKey: ["agentListings",page,location,school],
    queryFn: () => getListings(page),
    enabled,
  })

  return {data, isLoading, isError}
}

export const useGetAgentPayments = ({userId,enabled}: { userId?: string, enabled?:boolean}) => {
  const getPayments = async () => {
    const res = await axiosdata.value.get(`/api/payments/agent?userId=${userId}`)
    return res.data; 
  }


  const {data,isLoading,isError} = useQuery({
    queryKey: ['agent-payments'],
    queryFn: () => getPayments(),
    enabled,
  })
  return {data,isLoading,isError}
}



// Miscellaneous
export const useGetNotifications = ({page,limit}: Config) => {
  const getNotifications = async (page:string) => {
    const res = await axiosdata.value.get(`/api/notifications?limit=${limit}&page=${page}`)
    return res.data; 
  }

  
  const {data,isLoading,isError,isFetchingNextPage,fetchNextPage,hasNextPage,} = useInfiniteQuery({
    queryKey: ['notifications'],
    initialPageParam: 1,
    getNextPageParam: (prevData: any) => {
      return prevData?.cursor && prevData?.cursor !== prevData.numOfPages
         ? prevData.cursor + 1
         : undefined;
    },
    queryFn: ({ pageParam = 1 }) => getNotifications(String(pageParam)),
  })

  return {data,isLoading,isError,isFetchingNextPage,fetchNextPage,hasNextPage}
}

export const useGetComments = ({listingId, page='1', limit=10}: Config) => {
  const getComments = async (page:string) => {
    const res = await axiosdata.value.get(`/api/listings/comments?listingId=${listingId}&limit=${limit}&page=${page}`)
    return res.data; 
  }

  
  const {data,isLoading,isError,isFetchingNextPage,fetchNextPage,hasNextPage,} = useInfiniteQuery({
    queryKey: ['comments',listingId],
    initialPageParam: 1,
    getNextPageParam: (prevData: any) => {
      return prevData?.cursor && prevData?.cursor !== prevData.numOfPages
         ? prevData.cursor + 1
         : undefined;
    },
    queryFn: ({ pageParam = 1 }) => getComments(String(pageParam)),
  })

  return {data,isLoading,isError,isFetchingNextPage,fetchNextPage,hasNextPage}
}

