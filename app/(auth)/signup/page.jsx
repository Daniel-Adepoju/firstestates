'use client'
import Button from '@lib/Button'
import Link from 'next/link'
import Image from 'next/image'
import { signInWithGoogle } from '@lib/server/auth'
import { AgentIcon } from '@components/custom-ui/Icons'
import {User2 } from 'lucide-react'
const SignUp = () => {

 const handleSignInWithGoogle = async () => {
   await signInWithGoogle()
 }

  return (
    <div className="board flex flex-col lg:flex-row items-center justify-center lg:justify-around  gap-20 shadow-sm mt-20 mx-auto">
      <div className='lg:flex  flex-col items-center justify-center gap-4 hidden'>
        <span className='text-4xl font-bold text-gray-400'>
         LOGO
          </span>
          <span className='text-sm'> Discover the full <strong>First Estates</strong> experience, join today</span>
      </div>

      <div className='flex flex-col items-center  justify-center gap-10'>
      <div className="text-center text-xl text-gray-600 dark:text-gray-200 font-extrabold w-[90%] mx-auto">
  Which type of account would you like to create?
   </div>
    <div className="types">
 <div>
       <AgentIcon
          className='w-10 h-10 text-gray-700 dark:text-white rounded-full mb-2 mx-auto'
       />
     <Link href='/signup/agent'>
     <Button 
     link={true}
     href='/signup/agent' 
     text='Agent' className={'directional clickable darkblueBtn'}/>
     </Link>
</div>
 <div>
      <User2 className='w-10 h-10 text-gray-700 dark:text-white rounded-full mb-1 mx-auto' />
     <Link href='/signup/client'>
     <Button link={true}
     href={'/signup/client'}
     text='Client' className={'directional clickable  blueBtn'} />
   </Link>
   </div>

    </div>
     <Button 
              text='Continue With Google'
              reverse={true}
              functions={() =>{
                handleSignInWithGoogle()
              }}
              className="directional clickable py-6.5 mb-12 rounded-md mx-auto bg-gray-200 dark:bg-gray-700 w-80 h-10">
                <Image width={25} height={25} src='/icons/google.svg' alt='icon'/>
      </Button>
      </div>
    </div>
  )
}

export default SignUp