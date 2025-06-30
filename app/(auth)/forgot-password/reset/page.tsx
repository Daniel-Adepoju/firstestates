"use client"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { resetPassword } from "@lib/server/auth"
import Link from "next/link"
const Reset = () => {
  const params = useSearchParams()
  const isId = params.get("reset_id")
  const isEmail = params.get('email')
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 5) {
      setError("Password must be at least 5 characters")
      return
    }

    try {
      const res = await resetPassword({
        email: isEmail,
        password
      })
      setSuccess("Password reset successfully. You can now log in.")
      setError("")
      setPassword("")
      setConfirmPassword("")
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Try again.")
    }
  }

  if (!isId || !isEmail) {
    return (
      <div className="mt-32 text-center mx-auto">
        <p className="text-3xl font-semibold text-red-600">Invalid or Missing Reset Link</p>
        <p className="dark:text-gray-300 text-gray-600 mt-2 text-sm">
          Please check your email or try again.
        </p>
      </div>
    )
  }
  if(success) {
    return (
    <div className="w-full mt-40 mx-auto flex flex-col items-center gap-4">
    <span className="md:text-xl text-sm font-bold  text-green-600">{success}</span>
    <Link href='/login'
    className="text-center py-2 px-4 rounded-md 
    w-50 bg-darkblue dark:bg-coffee hover:opacity-90 transition-all duration-300">
        Login Now</Link>
    </div> )
  }
  return (
    <div className="mt-14 w-[80%] md:w-100 mx-auto text-center px-4">
      <h1 className="otherHead text-2xl font-bold mb-4">Reset Your Password</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm">
        Enter your new password below.
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full space-y-4 text-left"
      >
        <div className="relative">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="password"
          >
            New Password
          </label>
          <input
            id="password"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none "
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-[38px] right-3 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="relative">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute top-[38px] right-3 text-gray-500"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full directional bg-darkblue dark:bg-coffee text-white py-2 rounded hover:opacity-90 transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  )
}

export default Reset
