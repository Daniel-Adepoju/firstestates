// Delete Multiple Images

export const POST = async (req) => {
    const {public_ids} = await req.json();
    try {
      const result = await cloudinary.api.delete_resources(public_ids);
     if(!Array.isArray(public_ids) || public_ids.length === 0) {
      console.log('Invalid input:', public_ids); 
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
      } 
  
      if (result.deleted) {
        console.log('Deleted images:', result.deleted);
        return NextResponse.json({ message: 'Images deleted successfully' }, { status: 200 });
      } else {
        console.log('Images not found:', result.deleted);
        return NextResponse.json({ message: 'Images not found' }, { status: 404 });
      }
    } catch(err) {
    console.error('Error deleting images:', err);
    return NextResponse.json({ message: 'Failed to delete images' }, { status: 500 });
    }
}  