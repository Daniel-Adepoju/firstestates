import redis from "./redis"
import { connectToDB } from "@utils/database"
import Listing from "@api/models/listing"

export async function incrementView(listingId: string) {
await redis.hincrby("views:weekly", listingId, 1)
}

export async function syncWeeklyViewsToMongo() {
    const updatePromises = []
    const views: Record<string,number> | null = await redis.hgetall("views:weekly")
    if (!views || Object.keys(views).length === 0) return  
       await connectToDB()
        for (const [listingId, count] of Object.entries(views)) {
       const parsedCount = parseInt(count as unknown as string);
       if (!listingId || isNaN(parsedCount)) continue;
       const updatePromise = Listing.findByIdAndUpdate(listingId, {
            $inc: { weeklyViews: parsedCount }
            })
            updatePromises.push(updatePromise)
        }
    await Promise.all(updatePromises)

    await redis.del("views:weekly")

}

export async function resetWeeklyViews() {
  await connectToDB();
  const views: Record<string,number> = await redis.hgetall("views:weekly") || {};
   const listingIds = Object.keys(views)
  await Listing.updateMany({ _id: { $in: listingIds } }, [
    {
      $set: {
        weeklyViews: 0
      }
    }
  ]);
}



