'use server'
import {connectToDB} from '@utils/database'
import Listing from '@models/listing'
import {auth} from '@auth'
import {deleteImage, deleteMultipleImages} from './deleteImage'
export const createListing = async(val) => {
    const session = await auth()
    const newVal = {...val,agent: session?.user.id}
    await connectToDB()
  try {
    const newListing = new Listing(newVal)
    await newListing.save()
    return {message:'Created Successfully', status:'success'}
  } catch(err) {
    await deleteImage(val.mainImage)
    await deleteMultipleImages(val.gallery)
    return {message:'Unable To Create,Refresh And Try Again', status:'danger'}
  }

}