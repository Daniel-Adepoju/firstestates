import Image from 'next/image'
import Link from 'next/link'
import '@styles'
const page = () => {
  return (
  
   <div className="not_found">
     <h1>404 Not Found</h1>
      <Image
      width={100}
      height={100}
      alt='error icon'
      src={'/icons/not_found.svg'}
      />
    <div>Sorry the page you're looking for doesn't exist.This could be bacause it has been deleted or archived.
      Please check the URL and try again.</div>
    <div>
      <Link href="/">Go back to Homepage</Link>
    </div>
    </div>
  )
}

export default page