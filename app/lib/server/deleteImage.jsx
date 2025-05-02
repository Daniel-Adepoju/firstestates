'use server'
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
export const deleteImage = async (public_id) => {
     try {
       const result = await cloudinary.uploader.destroy(public_id, {
         resource_type: 'image',
       });
       if (result.result === 'not found') {
         return { message: 'Image not found',status: 'warning'};
       }
       return { message: 'Image deleted successfully', status: 'success'};
     } catch (err) {
       console.error('Error deleting image:', err);
       return { message: 'Failed to delete image', status: 'danger'};
     }
    }

export const deleteMultipleImages = async (public_ids) => {
    try {
        const result = await cloudinary.api.delete_resources(public_ids);
       if(!Array.isArray(public_ids) || public_ids.length === 0) {
        console.log('Invalid input:', public_ids); 
        return {message: 'Invalid input', status:'danger'};
        } 
    
        if (result.deleted) {
          console.log('Deleted images:', result.deleted);
          return {message: 'Deleted successfully', status: 'success'};
        } else {
          console.log('Images not found:', result.deleted);
          return {message: 'Images not found',status:'warning'};
        }
      } catch(err) {
      console.error('Error deleting images:', err);
      return {message: 'Failed to delete images',status: 'danger'};
      }
}