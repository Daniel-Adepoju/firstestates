"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSignals } from "@preact/signals-react/runtime"
import { signal } from "@preact/signals-react"
import Button from "@lib/Button"
import { useUser } from "@utils/user"
import { WhiteLoader,DotsLoader } from "@utils/loaders"
import { useNotification } from "@lib/Notification"
import { useState } from "react"
import {sendOTP,signInWithCredentials} from '@lib/server/auth'

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
  const { session,status } = useUser()
  const pathName = usePathname()
  const router = useRouter()
  const [sending, setSending] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const handleInput = (e) => {
    const { name, value } = e.target
    userDeets[name].value = value
  }


// Send OTP
const handleSendOTP = async (e) => {
   e.preventDefault()
  setSending(true)
  try {
    const res = await sendOTP({email:userDeets.email.value})
    setSending(false)
    notification.setIsActive(true)
      notification.setMessage(res.message)
       notification.setType(res.status)
       notification.setDuration(2000)
       if(res.status === 'success') {
        pathName === "/signup/agent"
      ? router.pushrouter.push(`/signup/verify?role=agent&username=${userDeets.username.value}&email=${userDeets.email.value}&password=${userDeets.password.value}&phone=${userDeets.phone.value}&whatsapp=${userDeets.whatsapp.value}&address=${userDeets.address.value}`)
      : router.push(`/signup/verify?role=client&username=${userDeets.username.value}&email=${userDeets.email.value}&password=${userDeets.password.value}`)
       }
  } catch(err) {
    setSending(false)
    notification.setIsActive(true)
    notification.setMessage(err.response.data.message)
    notification.setType('danger')
    notification.setDuration(2000)
  }
  
}

  //Log In
  const handleSignIn = async (e) => {
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
  // if (status === 'authenticated') {
  //   return (
  //     <div className="currentlyLogged">
  //       <div>
  //      {session?.user.username}, to access this page you have to signout first
  //     </div>
  //       <Button
  //       text={'Signout'}
  //       className={'clickable directional darkblueBtn'}
  //       functions={() => signOut()}/>
  //     </div>
  //   )
  // }
  if(status === 'loading') {  
    return <DotsLoader/>
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
          />

          <label htmlFor="password">Password</label>
          <input
            onChange={(e) => handleInput(e)}
            type="password"
            value={userDeets.password.value}
            id="password"
            name="password"
             className='red'
          />
        </div>

        {/* Unique To Agents */}
        {pathName === "/signup/agent" && (
          <div className="agent_details">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="number"
              id="phone"
              name="phone"
              onChange={(e) => handleInput(e)}
              value={userDeets.phone.value}
               className='red'
            />
            <label htmlFor="whatsApp">WhatsApp Number</label>
            <input
              type="number"
              id="whatsapp"
              name="whatsapp"
              onChange={(e) => handleInput(e)}
              value={userDeets.whatsapp.value}
               className='red'
            />
            <label htmlFor="address">Office Address</label>
            <input
              type="text"
              id="address"
              name="address"
              onChange={(e) => handleInput(e)}
              value={userDeets.address.value}
               className='red'
            />
          </div>
        )}

        <div className="bottom">
          <div className="btns">
            <WhiteLoader />
            <Button
              type="submit"
              disabled={sending}
              className="clickable directional darkblueBtn"
            >
              {pathName === "/login" ? "Login" : "Create account"}
              {sending && <WhiteLoader />}
            </Button>
          </div>
          <div className="info">
            {pathName === "/login" ? `Don't have an account?` : `Already have an account?`}
            {pathName === "/login" ? (
              <Link href="/signup">Create One Here</Link>
            ) : (
              <Link href="/login"> Login Here </Link>
            )}
          </div>
        </div>
      </form>
    </div>
  )


}

export default Form
