import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import { NextResponse } from "next/server"
import { auth } from "@auth"
import { faker } from "@faker-js/faker";

export const GET = async (req) => {
const {searchParams} = new URL(req.url)
  const page = searchParams.get('page') || 1
  const limit =  Number(searchParams.get('limit')) ||  10
  const location = searchParams.get('location') || ''
  const school = searchParams.get('school') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const beds =  searchParams.get('beds') || ''
  const baths = searchParams.get('baths') || ''
  const toilets = searchParams.get('toilets') || ''
  const skipNum = Number((page- 1) * Number(limit))
  let cursor = Number(page)
  const searchOptions = []

  if (location) {
   searchOptions.push({location: { $regex: location, $options: "i" }})
  }

  if (minPrice) {
   searchOptions.push({ price: { $gte: Number(minPrice) } })
  }

   if (maxPrice) {
   searchOptions.push({ price: { $lte: Number(maxPrice) } })
  }

  if (school) {
 searchOptions.push({school: { $regex: school, $options: "i" }})
}

if (beds) {
 searchOptions.push({bedrooms: Number(beds)})
}

if (baths) {
 searchOptions.push({bathrooms: Number(baths)})
}

if (toilets) {
 searchOptions.push({toilets: Number(toilets)})
}

  try {
    const session = await auth()
    await connectToDB()
    
    const listings = await Listing.countDocuments({$and:searchOptions})
    
    const numOfPages = Math.ceil(listings / Number(limit))
    if (cursor >= numOfPages) {
      cursor = numOfPages
    }

    let listingConfig
    if(searchOptions.length > 0) {
    listingConfig = Listing.find({$and:searchOptions}).populate(["agent"])
    } else {
    listingConfig = Listing.find().populate(["agent"])
    }
    listingConfig = listingConfig.skip(skipNum).limit(limit).sort('-createdAt')

    const posts = await listingConfig
 return NextResponse.json({posts,cursor,numOfPages}, { status: 200 }) 
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500}) 
  }
}











// seeding


// export const GET = async (req) => {
//   await connectToDB() 
//     const session = await auth()
 
//   try {
//     for(let i=0; i < 36; i++) {
//           const val = {
//         school: 'Lasu',
//         mainImage: faker.image.urlLoremFlickr({ category: "house" }),
//         gallery: Array.from({ length: 4 }, () => faker.image.urlLoremFlickr({ category: "interior" })),
//         address: faker.location.streetAddress(),
//         location: faker.location.city(),
//         price: faker.number.int({ min: 50000, max: 300000 }),
//         amenities: ["Water", "Light", "Parking"],
//         description: faker.lorem.paragraph(),
//         bedrooms: faker.number.int({ min: 1, max: 6 }),
//         bathrooms: faker.number.int({ min: 1, max: 4 }),
//         toilets: faker.number.int({ min: 1, max: 4 }),
//         isFeatured: faker.datatype.boolean(),
//         isVerified: faker.datatype.boolean(),
//         status: "available",
//         weeklyViews: 0,
//         favorites: [],
//       };
//       const newVal = { ...val, agent: session?.user.id }
//     const newListing = new Listing(newVal)
//     await newListing.save()
//     }
//     return NextResponse.json({posts:[]}, { status: 201 }) 

//   } catch (err) {
// console.log(err)
// return NextResponse.json(err, { status: 500})
// }
// }

