import "@styles"
import "../globals.css"
import Sidebar from "@components/agent/Sidebar"
import User from "@utils/user"
import UserModel from "@models/user"
import Provider from "@utils/sessionProvider"
import ReactQueryProvider from "@utils/ReactQueryProvider"
import Notification from "@lib/Notification"
import Toast from "@utils/Toast"
import { after } from "next/server"
import { auth } from "@auth"
import { connectToDB } from "@utils/database"
import Header from "@components/admin/Header"
import { DarkModeProvider } from "@lib/DarkModeProvider"
import Nav from "@components/Nav"
import { ShieldCheck, LockKeyhole } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Agent",
  description: "Manage listings, clients, and performance in the First Estates Agent Dashboard.",
  icons: {
    icon: "/logo/favicon.png",
  },

  openGraph: {
    title: "First Estates Agent Dashboard",
    description: "Manage listings, clients, and performance in the First Estates Agent Dashboard.",
    url: `${process.env.BASE_URL}/agent`,
    siteName: "First Estates",
    // images: [
    //   {
    //     url: `${process.env.BASE_URL}/og.png`,
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
    locale: "en-US",
    type: "website",
  },
}
export default async function AdminLayout({ children }) {
  const session = await auth()

  after(async () => {
    if (!session?.user.id) return
    await connectToDB()
    const user = await UserModel.findById(session?.user.id)
    if (user.lastActivityDate === new Date().toLocaleDateString("en-GB")) return
    await user.updateOne(
      { lastActivityDate: new Date().toLocaleDateString("en-GB") },
      { new: true, runValidators: true },
    )
  })

  // if (!session || session?.user?.role !== "agent") {
  //   return (
  //     <div className="flex min-h-[90vh] w-full items-center justify-center p-4 sm:p-6">
  //       <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-3xl border border-zinc-200 bg-white/80 p-6 text-center shadow backdrop-blur-sm dark:border-zinc-800 dark:bg-darkGray sm:p-8">
  //         <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
  //           <ShieldCheck className="h-7 w-7 text-red-600 dark:text-red-400" />
  //         </div>

  //         <div className="flex flex-col items-center">
  //           <div className="flex items-center gap-2">
  //             <LockKeyhole className="h-4 w-4 text-red-500" />

  //             <h2 className="text-lg font-semibold tracking-wide text-goldPrimary">
  //               Restricted Access
  //             </h2>
  //           </div>

  //           <p className="mt-2 max-w-sm text-xs font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">
  //             This page is only accessible to verified agents.
  //           </p>

  //           <Link
  //             href="/"
  //             className="quickLink mt-3 text-sm"
  //           >
  //             Go back to the home page
  //           </Link>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <>
      <DarkModeProvider>
        <ReactQueryProvider>
          <Provider>
            <User>
              {/* <Nav /> */}
              <Notification>
                <Toast>
                  <div className="admin-container nobar null">
                    <Sidebar session={session} />
                    <div className="admin-content-container nobar null">
                      <Header session={session} />
                      <div className="agentDashboardContainer nobar null">{children}</div>

                      {/* {agent}
  {listings} */}
                    </div>
                  </div>
                </Toast>
              </Notification>
            </User>
          </Provider>
        </ReactQueryProvider>
      </DarkModeProvider>
    </>
  )
}
