import SingleListing from "@components/SingleListing"

type Props = {
 searchParams:{ id?: string } | Promise<{ id?: string }>
}

export async function generateMetadata({ searchParams }: Props) {

  const sp =  await Promise.resolve(searchParams)
  const listingId = sp.id
 if (!listingId) {
    return {
      title: "Listing not found",
      description: "No listing ID provided.",
    }
  }

  const res =  await fetch(`${process.env.BASE_URL}/api/listings/${listingId}`)
  const data = await res.json()
 console.log("Metadata data:", data.post.mainImage)
  if (!data) {
    return {
      title: "Listing not found",
      description: "The listing you are looking for does not exist.",
      url: `${process.env.BASE_URL}/listings/${listingId}`,
      siteName: "First Estates",
      images: [
        {
          url: `${process.env.BASE_URL}/og.png`,
          width: 1200,
          height: 630,
        },
      ],
      locale: "en-US",
      type: "website",
    }
  }

  return {
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
    locale: "en-US",
    type: "website",
  }
}



const SingleListingPage =  async ({searchParams}: Props) => {
const sp = await Promise.resolve(searchParams)
const listingId = sp.id


 if (!listingId) {
    return <div>No listing ID provided</div>
  }
  return (
    <>
      <SingleListing listingId={listingId as string} />

    </>
  )
}

export default SingleListingPage