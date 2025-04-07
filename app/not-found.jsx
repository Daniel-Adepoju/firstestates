import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
  
   <div className="not_found">
     <h1>404 Not Found</h1>
    <div> Sorry the page you're looking for doesn't exist.This could be bacause it has been either deleted or archived</div>
    <div>Please check the URL and try again.</div>
    <div>
      <Link href="/">Go back to Homepage</Link>
    </div>
    <div>If you think this is a mistake, please contact our support team at <Link href="mailto:support@example.com">support@example.com</Link>.</div>
    <div>We apologize for any inconvenience caused.</div>
    <div>
    </div>
    <div>
    </div>
    </div>
  )
}

export default page