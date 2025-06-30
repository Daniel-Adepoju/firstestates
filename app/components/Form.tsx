"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSignals } from "@preact/signals-react/runtime"
import { signal } from "@preact/signals-react"
import Button from "@lib/Button"
import { useUser } from "@utils/user"
import { WhiteLoader, Loader, DotsLoader } from "@utils/loaders"
import { useNotification } from "@lib/Notification"
import { useState } from "react"
import {sendOTP,signInWithCredentials,signInWithGoogle} from '@lib/server/auth'
import {schools } from "@lib/constants"
import Image from "next/image"
import { HelpCircle,EyeOff,Eye} from "lucide-react"

export const userDeets = {
  email: signal(""),
  password: signal(""),
  username: signal(""),
  phone: signal(""),
  whatsapp: signal(""),
  address: signal(""),
}

const Form = () => {
  useSignals()
  const notification = useNotification()
  const {status } = useUser()
  const pathName = usePathname()
  const router = useRouter()
  const [sending, setSending] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const [school,setSchool] = useState('')
  const [showPassword,setShowPassword] = useState(false)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      if (name in userDeets) {
          userDeets[name as keyof typeof userDeets].value = value
      }
    }


// Send OTP
const handleSendOTP = async (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault()
  setSending(true)
  try {
    const res = await sendOTP({email:userDeets.email.value})
    notification.setIsActive(true)
      notification.setMessage(res.message)
       notification.setType(res.status)
       notification.setDuration(2000)
       if(res.status === 'success' && pathName === "/signup/agent") {
      router.push(`/signup/verify?role=agent&username=${userDeets.username.value}&email=${userDeets.email.value}&password=${userDeets.password.value}&phone=${userDeets.phone.value}&whatsapp=${userDeets.whatsapp.value}&address=${userDeets.address.value}`)
       } else if(res.status ==='success' && pathName === "/signup/client") {
   router.push(`/signup/verify?role=client&username=${userDeets.username.value}&email=${userDeets.email.value}&password=${userDeets.password.value}&school=${school}`)
       }
  } catch(err) {
    setSending(false)
    notification.setIsActive(true)
    notification.setType('danger')
    notification.setDuration(2000)
  }
  
}

// Use Google
const handleSignInWithGoogle = async () => {
  await signInWithGoogle()
}

  //Log In
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()  
    setSending(true)
    try {
    const res = await signInWithCredentials(userDeets.email.value,userDeets.password.value)
      if (res.status === 'success') {
        notification.setIsActive(true)
        notification.setMessage(res.message)
        notification.setType(res.status)
        setLoggingIn(true)
        router.push('/')
      } else {
        notification.setIsActive(true)
        notification.setMessage(res.message)
        notification.setType(res.status)
      }
      setSending(false)
      console.log(res.other)
    } 
   catch(err) {
    console.log(err)
    setSending(false)
    notification.setIsActive(true)
    notification.setMessage('An error occured,please try again')
    notification.setType('danger')
  }

  }

  if (status === 'authenticated') {
    return (
      <div className="mt-35 mx-auto flex flex-col gap-4 items-center justify-center">
     <div className="otherHead  mt-5 text-2xl font-bold">
     You're already logged in
      </div>
      <Link href='/' className="smallScale cursor-pointer dark:bg-black/20 bg-darkblue text-white py-2 px-4 rounded-md"> Go Back To Homepage</Link>
      </div>
    )
  }
  if(status === 'loading') {  
    return <Loader className="my-45"/>
  }

if(loggingIn) {
  return (<div className="blackboard">
    <div className='blackboardItems'>
    <div className="subheading">Logging In</div>
  <DotsLoader/>
  </div>
  </div>
  )
}
  return (
    <div className="form_container">
      {pathName.startsWith("/signup") ? (
        <div className="typeOfAccount">
          {pathName === "/signup/agent"
            ? "Create a new agent account"
            : "Create a new client account"}
        </div>
      ) : (
        <div className="typeOfAccount">
          Log in to your account
          </div>      
      )}

      <form
        onSubmit={pathName === "/login" ? handleSignIn : handleSendOTP}
        className="signUpAndLogin form"
      >
        {/* General Scheme */}
        <div className="general_details">
          {pathName.startsWith("/signup") && (
            <>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                onChange={(e) => handleInput(e)}
                value={userDeets.username.value}
                id="username"
                name="username"
                 className='red'
                 required
              />
            </>
          )}

          <label htmlFor="email">Email</label>
          <input
            onChange={(e) => handleInput(e)}
            value={userDeets.email.value}
            type="email"
            id="email"
            name="email"
             className='red'
             required
          />

          <label htmlFor="password">Password</label>
          <div className="relative w-full">
              <input
            onChange={(e) => handleInput(e)}
            type={showPassword ? 'text' : 'password'}
            value={userDeets.password.value}
            id="password"
            name="password"
             className='red'
             required
          />
          <div className="absolute right-[4%] top-3">
          <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          >
          {showPassword ? <EyeOff color="gray"/> : <Eye color='gray'/>}
          </button>
          </div>
          </div>
     

            {/* Unique To Students */}
        {pathName === "/signup/client" &&
          <div className="w-[90%] mx-auto">
            <label>School</label>
            <select
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-full border rounded p-3 dark:bg-gray-700"
            required
          >
            <option value="">Select a school</option>
            {schools.map((school) => (
        <option
        key={school} 
        value={school}
        >{school}</option>
            ))}
          </select>
        </div>}
        </div>
      
        {/* Unique To Agents */}
        {pathName === "/signup/agent" && (
          <div className="agent_details">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              onChange={(e) => handleInput(e)}
              value={userDeets.phone.value}
               className='red'
               required
            />
            <label htmlFor="whatsApp">WhatsApp Number</label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              onChange={(e) => handleInput(e)}
              value={userDeets.whatsapp.value}
               className='red'
               required
            />
            <label htmlFor="address">Office Address</label>
            <input
              type="text"
              id="address"
              name="address"
              onChange={(e) => handleInput(e)}
              value={userDeets.address.value}
               className='red'
               required
            />
          </div>
        )}

        <div className="bottom">
          <div className="btns">
          
          <Button
              type="submit"
              disabled={sending}
              className="clickable directional darkblueBtn"
            >
              {pathName === "/login" ? "Login" : "Create account"}
              {sending && <WhiteLoader />}
          </Button>
   {pathName === '/login' &&
          <Button 
          text='Continue With Google'
          reverse={true}
          functions={() =>{
            handleSignInWithGoogle()
          }}
          className="directional clickable mb-2 rounded-md mx-auto bg-gray-200 dark:bg-gray-700 w-80 h-10">
            <Image width={25} height={25} src='/icons/google.svg' alt='icon'/>
            </Button>}

          </div>
          <div className="info">
            {pathName === "/login" ? `Don't have an account?` : `Already have an account?`}
            {pathName === "/login" ? (
              <Link href="/signup" className="quickLink">Create One Here</Link>
            ) : (
              <Link href="/login" className="quickLink"> Login Here </Link>
            )}
          </div>
          {/* Forgot Password */}
          {pathName === '/login' && (
          <div className="mx-auto flex items-center justify-center gap-1">
            <HelpCircle size={15} color="#9CA3AF"/>
          <Link href='forgot-password' className="quickLink">
          Forgot Password?
          </Link> 
            </div> )}
        </div>
      </form>
    </div>
  )


}

export default Form
