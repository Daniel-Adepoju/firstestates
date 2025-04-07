'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
const Form = () => {
  const pathName = usePathname()
  return (
    <div className="form_container">
    {pathName.startsWith('/signup') ?
    <div className="typeOfAccount">
     {pathName === '/signup/agent' ? 'Create a new agent account' 
     : 'Create a new client account'}
    </div> :
    <div className="typeOfAccount">
      Log in to your account
    </div>}

    <form className='signUpAndLogin form'>
        {/*  General Scheme*/}
       
        <div className="general_details">
    {pathName.startsWith('/signup') &&
    <>
    <label htmlFor='username'>Username</label>
    <input type='text' id="username" name='username' />
    </>}

      <label htmlFor="email">Email</label>
      <input type='email' id="email" name='email'/>

      <label htmlFor='password'>Password</label>
      <input type='password' id="password" name='password'/> 
        </div>


       {/* Unique To Agents */}
       {pathName === '/signup/agent' &&
       <div className="agent_details">
        <label htmlFor="phone">Phone Number</label>
        <input type='number' id='phone' name='phone'/>
        <label htmlFor="whatsApp" >WhatsApp Number</label>
        <input type='number' id='whatsapp' name='whatsApp' />
        <label htmlFor="address">Office Address</label>
        <input type='text' id="address" name='address'/>
       </div>
       }
    </form>

          <div className="bottom">
          <div className="btns">
         <button className='clickable directional darkblueBtn'>
         {pathName === '/login' ? 'Login' 
          : 'Create account'}
          </button>
       </div>
    <div className="info">
    {pathName === '/login' ? `Don't have an account?` : `Already have an account?`}
    {pathName === '/login' ? <Link href='/signup'>Create One Here</Link>
  : <Link href='/login'> Login Here </Link>}
    </div>
       </div>
    </div>
  )
}

export default Form