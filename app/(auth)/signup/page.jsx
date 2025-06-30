'use client'
import Button from '@lib/Button'
import Link from 'next/link'
import Image from 'next/image'
import { signInWithGoogle } from '@lib/server/auth'

const SignUp = () => {

 const handleSignInWithGoogle = async () => {
   await signInWithGoogle()
 }

  return (
    <div className="board pickSignUpType shadow-md">
      <div className="text-center otherHead text-xl font-extrabold w-[90%] mx-auto">
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
     <Button 
              text='Continue With Google'
              reverse={true}
              functions={() =>{
                handleSignInWithGoogle()
              }}
              className="directional clickable py-6 mb-12 rounded-md mx-auto bg-gray-200 dark:bg-gray-700 w-80 h-10">
                <Image width={25} height={25} src='/icons/google.svg' alt='icon'/>
      </Button>
    </div>
  )
}

export default SignUp