import {v2 as cloudinary} from 'cloudinary';
import { NextResponse } from 'next/server';


cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });


  //Delete Single Image
export const POST = async (req) => {
 const { public_id } = await req.json();
 try {
   const result = await cloudinary.uploader.destroy(public_id, {
     resource_type: 'image',
   });
   if (result.result === 'not found') {
     return NextResponse.json({ message: 'Image not found' }, { status: 404 });
   }
   return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
 } catch (err) {
   console.error('Error deleting image:', err);
   return NextResponse.json({ message: 'Failed to delete image' }, { status: 500 });
 }
}
