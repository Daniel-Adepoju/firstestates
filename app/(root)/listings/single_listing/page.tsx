import SingleListing from "@components/SingleListing"
import { headers } from "next/headers"
type Props = {
  searchParams?: Promise<{ id?: string }>
}

export async function generateMetadata({ searchParams }: Props) {
    const headersList = await headers()
  const host = headersList.get("host")
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const baseUrl = `${protocol}://${host}`
  const sp = (await searchParams) ?? {}
  const listingId = sp.id

  // if (!listingId) {
  //   return {
  //     title: "Listing not found",
  //     description: "No listing ID provided.",
  //   }
  // }

  let data: any = null
  try {
    const res = await fetch(`${baseUrl}/api/listings/${listingId}`, {
      cache: "no-store",
    })
    
      const listingData = await res.json()
      data = listingData
  if (!res.ok) {
    throw new Error("Failed to fetch listing")
  }


   if (!data) {
    return {
      title: "La Not found",
      description: "The listing you are looking for does not exist.",
     
     openGraph: {
      title: "Not found",
      description: "The listing you are looking for does not exist.",
      url: `${process.env.BASE_URL}/listings/single_listing/?id=${listingId}`,
      siteName: "First Estates",

      images: [
        {
          url: `${process.env.BASE_URL}/og.png`,
          width: 1200,
          height: 630,
        },
      ],
    }
    }
  }

  return {
    title: `Listing at ${data?.post.location}`,
    description: data?.post.description,
    openGraph: {
     title: `Listing at ${data?.post.location}`,
    description: data?.post.description,
    url: `${process.env.BASE_URL}/listings/single_listing?id=${listingId}`,
    siteName: "First Estates",
    images: [
      {
        url: `https://res.cloudinary.com/dbepfuktm/image/upload/v1749851222/${data.post.mainImage}.jpg`,
        width: 1200,
        height: 630,
      },
    ],
  }
  }
  } catch (err) {
    console.error("Error fetching listing:", err)
  }

 
}

const SingleListingPage = async ({ searchParams }: Props) => {
  const sp = (await searchParams) ?? {}
  const listingId = sp.id

  if (!listingId) {
    return <div>No listing ID provided</div>
  }

  return <SingleListing listingId={listingId} />
}

export default SingleListingPage
