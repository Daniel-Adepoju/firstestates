
import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"
import {connectToDB} from '@utils/database'
import {compare} from 'bcryptjs' 
import User from '@models/user'


export const {auth,handlers,signIn,signOut} = NextAuth({
     session: {
       strategy: 'jwt',
    },
  
  
    pages: {
       signIn:'/login',
       newUser:'/',
       error: '/login?error=true',
    },
    providers: [CredentialsProvider({
       async authorize(credentials) {
        try {
           await connectToDB()
           const user = await User.findOne({email: credentials?.email})
           if (!user) {
            return null
        }
     
           const passwordMatch = await compare(credentials?.password || '', user?.password)
           if (passwordMatch) {
            return {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                profilePic: user.profilePic,
            }
           }
           if(!passwordMatch) {
           return null
           }
            return null
        }
 catch (err) {
    throw new Error(err.message)
}
    }
    })],

    callbacks: {
        async jwt({token,user,trigger,session}) {
            if (trigger ===  "update") {
    token = session
    return {...token, ...session.user}
            }
            return {...token, ...user};
        },
        async session({session, token}) {
            session.user = token
            return session
        }
        
         },
   })