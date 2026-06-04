"use client"
import { useState } from "react"
import { CircleCheck, InfoIcon, MailIcon } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { axiosdata } from "@utils/axiosUrl"
import { nanoid } from "nanoid"
import { useNotification } from "@lib/Notification"

export type SendEmailParams = {
  to: string
  subject: string
  message: string
}

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [success, setSuccess] = useState(false)
  const token = nanoid(27)
  const notification = useNotification()
  const url = process.env.NEXT_PUBLIC_BASE_URL

  const sendEmail = async (val: SendEmailParams): Promise<void> => {
    try {
      const res = await axiosdata.value.post(`/api/send_emails`, val)
      if (res.status === 200) {
        setSuccess(true)
      }
    } catch (err: unknown) {
      console.log(err)
      notification.setIsActive(true)
      notification.setMessage("Error sending password reset link")
      notification.setType("danger")
    }
  }

  const sendMutation = useMutation({
    mutationFn: sendEmail,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    sendMutation.mutate({
      to: email,
      subject: "Password Reset Request",
      message: `
      <p> You requested a password reset. Click the link below to reset your password.</p>
      <a href="${url}/auth/forgot-password/reset?reset_id=${token}&email=${email}"
    href="#"
    style="
    color:#0874c7;
    text-decoration:none;
    font-weight:600;
    display:block;
    width:100%;
    text-align:center;
    margin-inline:auto;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  "
>
  Reset Your Password
</a>`,
    })
  }
  if (success) {
    return (
      <div className="flex flex-col justify-center items-center gap-2 mt-35 text-center mx-auto">
        <CircleCheck className="h-10 w-10 text-green-500 mr-2 inline" />
        <div className="otherHead text-lg font-bold">Password reset link sent to your email</div>
      </div>
    )
  }
  return (
    <div className="max-w-md w-[98%] mx-auto mt-20 mb-5 p-6 rounded-lg shadow-md bg-white dark:bg-darkGray dark:text-white">
      <h2 className="otherHead text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
      <p className="w-full text-gray-500 dark:text-gray-400 text-sm text-center mb-6">
        Enter your email address and we’ll send you a link to reset your password.
      </p>
      <form
        onSubmit={handleSubmit}
        className="w-full space-y-4"
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1"
          >
            Email Address
          </label>
          <div className="flex items-center border rounded-sm px-3 py-2 dark:border-gray-600 dark:bg-darkGray">
            <MailIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full  p-1 bg-transparent focus:outline-none"
            />
          </div>
        </div>
        <span className="w-full  inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 my-2 mb-4">
          <InfoIcon className="h-4 w-4  text-orange-400" />
          <span> Check spam folder if you don't see the email in your inbox.</span>
        </span>
        <button
          onClick={handleSubmit}
          type="submit"
          className="clickable w-56 block mx-auto darkblue-gradient dark:bg-coffee
          hover:opacity-90 text-white text-sm
          py-3 font-medium rounded-2xl transition-colors"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  )
}

export default ForgotPassword
