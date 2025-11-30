import Image from 'next/image'
import Link from 'next/link'
import '@styles'
const page = () => {
  return (
  
   <div className="flex flex-col items-center justify-center gap-4 font-head w-[98%] mx-auto mt-30">
     <h1 className='text-red-500 font-bold'>404 Not Found</h1>
      <Image
      width={100}
      height={100}
      alt='error icon'
      src={'/icons/not_found.svg'}
      />
    <div className='w-[80%] text-center'>Sorry the page you're looking for doesn't exist.
      This could be because it has been deleted or archived.
      Please check the URL and try again.</div>
    <div>
      <Link 
      className='quickLink'
      href="/">Go back to Homepage</Link>
    </div>
    </div>
  )
}

export default page