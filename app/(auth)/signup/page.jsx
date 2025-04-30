'use client'
import Button from '@lib/Button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
const SignUp = () => {
  const router = useRouter()


  return (
    <div className=" board pickSignUpType">
      <div className="subheading">
   Choose the type of account you want to create
   </div>
    <div className="types">
     <Link href='/signup/agent'>
     <Button 
     link={true}
     href='/signup/agent' 
     text='Agent' className={'directional clickable darkblueBtn'}/>
     </Link>
     <Link href='/signup/client'>
     <Button link={true}
     href={'/signup/client'}
     text='Client' className={'directional clickable  blueBtn'} />
   </Link>
    </div>
    </div>
  )
}

export default SignUp