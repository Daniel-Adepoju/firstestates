"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSignals } from "@preact/signals-react/runtime"
import { signal } from "@preact/signals-react"
import Button from "@lib/Button"
import { useUser } from "@utils/user"
import { WhiteLoader, Loader, DotsLoader } from "@utils/loaders"
import { useToast } from "@utils/Toast"
import { useState } from "react"
import { sendOTP, signInWithCredentials, signInWithGoogle } from "@lib/server/auth"
import { useSchools } from "@lib/useSchools"
import Image from "next/image"
import { HelpCircle, EyeOff, Eye, ChevronRight, ChevronLeft } from "lucide-react"

export const userDeets = {
  email: signal(""),
  password: signal(""),
  username: signal(""),
  phone: signal(""),
  address: signal(""),
  firstname: signal(""),
  lastname: signal(""),
}

const Form = () => {
  useSignals()
  const { setToastValues } = useToast()
  // const {status } = useUser()
  const pathname = usePathname()
  const router = useRouter()
  const [sending, setSending] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const [school, setSchool] = useState("")
  const { schools } = useSchools()
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name in userDeets) {
      userDeets[name as keyof typeof userDeets].value = value
    }
  }

  // Send OTP
  const handleSendOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validations for agent
    if (pathname === "/signup/agent") {
      //  check steps for agent
      // change to 3
      if (step < 2) {
        setToastValues({
          isActive: true,
          message: "Complete all steps before proceeding",
          status: "danger",
          duration: 3000,
        })
        return
      }
const allFilled = Object.entries(userDeets)
  .filter(([key]) => !["firstname", "lastname"].includes(key))
  .every(([, sig]) => sig.value.trim() !== "")
      if (!allFilled) {
        setToastValues({
          isActive: true,
          message: "Please fill in all fields",
          status: "danger",
          duration: 3000,
        })
        return
      }
    }

    // Validation for client
    if (
      pathname === "/signup/client" &&
      userDeets.firstname.value.trim().length > 0 &&
      userDeets.lastname.value.trim().length > 0
    ) {
      userDeets.username.value = `${userDeets.firstname.value}  ${userDeets.lastname.value}`
    }
     
    //  start sending OTP

    // setSending(true)
    // try {
    //   const res = await sendOTP({ email: userDeets.email.value })
    //   setToastValues({
    //     isActive: true,
    //     message: res.message,
    //     status: res.status,
    //     duration: 2000,
    //   })
    //   if (res.status === "success" && pathname === "/signup/agent") {
    //     router.push(
    //       `/signup/verify?role=agent&username=${userDeets.username.value}&email=${userDeets.email.value}&password=${userDeets.password.value}&phone=${userDeets.phone.value}&address=${userDeets.address.value}`
    //     )
    //   } else if (res.status === "success" && pathname === "/signup/client") {
    //     router.push(
    //       `/signup/verify?role=client&username=${userDeets.username.value}&email=${userDeets.email.value}&password=${userDeets.password.value}&school=${school}`
    //     )
    //   }
    //   setSending(false)
    // } catch (err) {
    //   setSending(false)
    //   setToastValues({
    //     isActive: true,
    //     message: "An error occured, please try again",
    //     status: "danger",
    //     duration: 2000,
    //   })
    // }
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
      const res = await signInWithCredentials(userDeets.email.value, userDeets.password.value)
      if (res.status === "success") {
        setToastValues({
          isActive: true,
          message: res.message,
          status: res.status,
          duration: 2000,
        })
        setLoggingIn(true)
        router.push("/")
      } else {
        setToastValues({
          isActive: true,
          message: res.message,
          status: res.status,
          duration: 2000,
        })
      }
      setSending(false)
      console.log(res.other)
    } catch (err) {
      console.log(err)
      setSending(false)
      setToastValues({
        isActive: true,
        message: "An error occured, please try again",
        status: "danger",
        duration: 2000,
      })
    }
  }

  // Agent Steps

  const handleStep = (type: "next" | "prev") => {
    if (type === "next") {
      setStep(step + 1)
    } else if (type === "prev") {
      setStep(step - 1)
    }
    if (type === "prev" && step === 1) {
      setStep(1)
    }

    // change to 3
    if (type === "next" && step === 2) {
      setStep(2)
    }
  }

  // if (status === 'authenticated') {
  //   return (
  //     <div className="mt-35 mx-auto flex flex-col gap-4 items-center justify-center">
  //    <div className="otherHead  mt-5 text-2xl font-bold">
  //    You're already logged in
  //     </div>
  //     <Link href='/' className="smallScale cursor-pointer dark:bg-black/20 darkblue-gradient text-white py-3 px-4 rounded-md"> Go Back To Homepage</Link>
  //     </div>
  //   )
  // }
  // if(status === 'loading') {
  //   return <Loader className="my-45"/>
  // }

  // if(loggingIn) {
  //   return (<div className="blackboard">
  //     <div className='blackboardItems'>
  //     <div className="subheading">Logging In</div>
  //   <DotsLoader/>
  //   </div>
  //   </div>
  //   )
  // }
  return (
    <div className="w-full pb-8 min-h-screen">
      {pathname.startsWith("/signup") ? (
        <div className="typeOfAccount">
          {pathname === "/signup/agent"
            ? "Create a new agent account"
            : "Create a new client account"}
        </div>
      ) : (
        <div className="typeOfAccount">Log in to your account</div>
      )}

      <div className="flex lg:flex-row flex-col items-center  gap-4">
        {/* side content */}

        <div className="w-[60%] lg:flex  flex-col items-center justify-center gap-4 hidden">
          <span className="text-4xl font-bold text-gray-400">LOGO</span>
          <span className="text-sm pl-3 w-[100%] text-center">
            {pathname.startsWith("/signup") &&
              (pathname === "/signup/agent" ? (
                <>
                  Become an agent on <strong>First Estates</strong>, join today
                </>
              ) : (
                <>
                  Find a perfect home with <strong>First Estates</strong>, sign up today
                </>
              ))}
            {pathname === "/login" && (
              <>
                Log in to your account and start exploring <strong>First Estates</strong>
              </>
            )}{" "}
            .
          </span>
        </div>

        {/* form */}
        <form
          onSubmit={pathname === "/login" ? handleSignIn : handleSendOTP}
          className="signUpAndLogin  form  w-[100%] py-6"
        >
          {/* General Scheme */}
          {step === 1 && (
            <div className="general_details">
              {pathname.startsWith("/signup") &&
                (pathname === "/signup/client" ? (
                  <>
                    <label htmlFor="username">Firstname</label>
                    <input
                      type="text"
                      onChange={(e) => handleInput(e)}
                      value={userDeets.firstname.value}
                      id="firstname"
                      name="firstname"
                      className="red"
                      required
                    />
                    <label htmlFor="username">Lastname</label>
                    <input
                      type="text"
                      onChange={(e) => handleInput(e)}
                      value={userDeets.lastname.value}
                      id="lastname"
                      name="lastname"
                      className="red"
                      required
                    />
                  </>
                ) : (
                  <>
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      onChange={(e) => handleInput(e)}
                      value={userDeets.username.value}
                      id="username"
                      name="username"
                      className="red"
                      required
                    />
                  </>
                ))}

              <label htmlFor="email">Email</label>
              <input
                onChange={(e) => handleInput(e)}
                value={userDeets.email.value}
                type="email"
                id="email"
                name="email"
                className="red"
                required
              />

              <label htmlFor="password">Password</label>
              <div className="relative w-full">
                <input
                  onChange={(e) => handleInput(e)}
                  type={showPassword ? "text" : "password"}
                  value={userDeets.password.value}
                  id="password"
                  name="password"
                  className="red"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (
                        pathname === "/signup/agent" &&
                        userDeets.email.value &&
                        userDeets.password.value &&
                        userDeets.username.value
                      ) {
                        handleStep("next")
                      }
                    }
                  }}
                  required
                />
                <div className="absolute right-[4%] top-[26.5%]">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff
                        size={22}
                        color="#abaaa9"
                      />
                    ) : (
                      <Eye
                        size={22}
                        color="#abaaa9"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Unique To Students */}
              {pathname === "/signup/client" && (
                <>
                <div className="flex flex-col gap-[8px] w-full self-start">
                  <label>School</label>
                  <select
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className={`w-full dark:bg-darkGray ${!school && "text-gray-400"}`}
                  >
                    <option value="">Select a school</option>
                    {schools.map((school: School) => (
                      <option
                        key={school._id}
                        value={school?.shortname}
                      >
                        {school?.shortname} ({school?.fullname})
                      </option>
                    ))}
                  </select>
                
                </div>
                  <div className="mx-auto self-center text-center text-sm mt-2 text-gray-500 dark:text-gray-300">
                    If you’re not a student, you don’t need to select a school.
                  </div>
                </>
              )}
            </div>
          )}

          {/* Unique To Agents */}
          {pathname === "/signup/agent" && (
            <>
              {step === 2 && (
                <div className="agent_details w-[100%]">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    onChange={(e) => handleInput(e)}
                    value={userDeets.phone.value}
                    className="red"
                    required
                  />

                  <label htmlFor="address">Office Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    onChange={(e) => handleInput(e)}
                    value={userDeets.address.value}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (
                          pathname === "/signup/agent" &&
                          userDeets.email.value &&
                          userDeets.password.value &&
                          userDeets.username.value &&
                          userDeets.phone.value &&
                          userDeets.address.value
                        ) {
                          handleStep("next")
                        }
                      }
                    }}
                    required
                  />
                </div>
              )}

              {step === 3 && <div className="agent_details w-[100%]">NIN and stuffs</div>}

              {pathname === "/signup/agent" && (
                <>
                  <div className="w-[100%] flex items-center justify-center  mt-4">
                   {/* change to 3 */}
                    <div className="w-60 font-bold text-md font-list text-gray-500 dark:text-gray-200">
                      Step {step}/2
                    </div>
                    <div className="w-80 flex self-end items-center justify-end gap-4 mt-4">
                      <ChevronLeft
                        size={44}
                        className="p-2 cursor-pointer clickable bg-gray-600 text-white dark:text-black dark:bg-white rounded-full"
                        onClick={() => handleStep("prev")}
                      />
                      <ChevronRight
                        size={44}
                        className="p-2 cursor-pointer clickable bg-gray-600 text-white dark:text-black dark:bg-white rounded-full"
                        onClick={() => handleStep("next")}
                      />
                    </div>
                  </div>

                  <div className="text-center text-sm text-gray-500 dark:text-gray-300">
                    Ensure you complete all steps and fill in all the details
                  </div>
                </>
              )}
            </>
          )}

          <div className="bottom">
            <div className="btns">
              <Button
                type="submit"
                disabled={sending}
                className="clickable directional font-medium text-sm darkblueBtn p-6"
              >
                {pathname === "/login" ? "Login" : "Create account"}
                {sending && <WhiteLoader />}
              </Button>
              {pathname === "/login" && (
                <Button
                  text="Continue With Google"
                  reverse={true}
                  functions={() => {
                    handleSignInWithGoogle()
                  }}
                  className="text-white directional font-medium text-sm clickable mb-2 rounded-md mx-auto gray-gradient w-80 h-10 p-6"
                >
                  <Image
                    width={25}
                    height={25}
                    src="/icons/google.svg"
                    alt="icon"
                  />
                </Button>
              )}
            </div>
            <div className="info text-sm">
              {pathname === "/login" ? `Don't have an account?` : `Already have an account?`}
              {pathname === "/login" ? (
                <Link
                  href="/signup"
                  className="quickLink text-sm"
                >
                  Create One Here
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="quickLink text-sm"
                >
                  {" "}
                  Login Here{" "}
                </Link>
              )}
            </div>
            {/* Forgot Password */}
            {pathname === "/login" && (
              <div className="mx-auto flex items-center justify-center gap-1">
                <HelpCircle
                  size={15}
                  color="#9CA3AF"
                />
                <Link
                  href="forgot-password"
                  className="quickLink"
                >
                  Forgot Password?
                </Link>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Form
