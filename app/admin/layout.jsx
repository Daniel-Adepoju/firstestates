import "@styles"
import Sidebar from "@components/admin/Sidebar"
import User from "@utils/user"
import Provider from "@utils/sessionProvider"
import ReactQueryProvider from "@utils/ReactQueryProvider"
import Notification from "@lib/Notification"
import { auth } from "@auth"
import Header from "@components/admin/Header"
import Nav from "@components/Nav"
import Toast from "@utils/Toast"
import { ShieldCheck, LockKeyhole } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Firstestate | Admin",
  description: "Admin dashboard",
  icons: {
    icon: "/logo/favicon.png",
  },
}

export default async function AdminLayout({ children }) {
  const session = await auth()
  // !session || session?.user?.role !== 'admin'

  if (!session) {
    return (
      <div className="flex min-h-[90vh] w-full items-center justify-center p-4 sm:p-6">
        <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-3xl border border-zinc-200 bg-white/80 p-6 text-center shadow backdrop-blur-sm dark:border-zinc-800 dark:bg-darkGray sm:p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
            <ShieldCheck className="h-7 w-7 text-red-600 dark:text-red-400" />
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <LockKeyhole className="h-4 w-4 text-red-500" />

              <h2 className="text-lg font-semibold tracking-wide text-goldPrimary">
                Restricted Access
              </h2>
            </div>

            <p className="mt-2 max-w-sm text-xs font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">
              This page is only accessible to admins.
            </p>

            <Link
              href="/"
              className="quickLink mt-3 text-sm"
            >
              Go back to the home page
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ReactQueryProvider>
      <Provider>
        <User>
          <Notification>
            <Toast>
              <div className="admin-container">
                <Sidebar session={session} />
                <div className="admin-content-container nobar null">
                  {/* <Nav /> */}
                  <Header session={session} />
                  {children}
                </div>
              </div>
            </Toast>
          </Notification>
        </User>
      </Provider>
    </ReactQueryProvider>
  )
}
