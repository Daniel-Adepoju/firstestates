import { MetadataRoute } from "next";

async function getAllListings(): Promise<Listing[]> {

  const baseUrl = process.env.BASE_URL as string
  let page = 1
  let allListings: Listing[] = []

  while (true) {
    const res = await fetch(`${baseUrl}/api/listings?page=${page}&limit=50`, {
      cache: "no-store",
    })
    if (!res.ok) break

    const data = await res.json()

   
    const listings: Listing[] = data.posts

    if (listings.length === 0) break

    allListings = [...allListings, ...listings]
    page++
  }

  return allListings
}

export default async function siteMap():Promise<MetadataRoute.Sitemap> {
 

  const baseUrl = process.env.BASE_URL as string

  const listings = await getAllListings()

  const dynamicRoutes: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${baseUrl}/listings/single_listing?id=${listing._id}`,
    lastModified: new Date(listing.createdAt || Date.now()),
  }))



    return (
       [
        {
            url:process.env.BASE_URL as string,
            lastModified:new Date(),
            
       },
           {
            url:`${process.env.BASE_URL}/agent`,
            lastModified:new Date(),
            
       },
       ...dynamicRoutes
    ]
    )
}