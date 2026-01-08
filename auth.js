import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { connectToDB } from "@utils/database"
import { compare } from "bcryptjs"
import User from "@models/user"
import { redirect } from "next/navigation"

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    newUser: "/",
    error: "/login?error=true",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          await connectToDB()
          const user = await User.findOne({ email: credentials?.email })
          if (!user) {
            return null
          }

          const passwordMatch = await compare(credentials?.password || "", user?.password)
          if (passwordMatch) {
            const { password, _id, ...rest } = user.toObject()
            return {
              id: _id.toString(),
              ...rest,
            }
          }
          if (!passwordMatch) {
            return null
          }
          return null
        } catch (err) {
          throw new Error(err.message)
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session, account }) {
      if (trigger === "update") {
        return { ...token, ...session.user }
      }
      if (account?.isNewUser !== undefined) {
        token.isNewUser = account.isNewUser
      }

      return { ...token, ...user }
    },
    async session({ session, token }) {
      if (!token?.email) return null
      await connectToDB()
      const user = await User.findOne({ email: token?.email })

      if (!user) {
        return null
      }
      const { password, _id, ...rest } = user.toObject()
      session.user = { id: _id.toString(), isNewUser: token.isNewUser ?? false, ...rest }
      return session
    },

    async signIn({ profile, account }) {
      // console.log(profile)
      if (account?.provider !== "google") {
        return true
      }
      // for google auth
      try {
        await connectToDB()
        const userExists = await User.findOne({ email: profile?.email })
        if (!userExists) {
          await User.create({
            email: profile?.email,
            username: profile?.name.replace(" ", ""),
          })
          account.isNewUser = true
        } else {
          account.isNewUser = false
        }
        return true
      } catch (err) {
        console.log(err)
        return false
      }
    },
  },
})
