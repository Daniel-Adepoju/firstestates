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

export const metadata = {
  title: "Firstestate | Admin",
  description: "Admin dashboard",
  icons: {
    icon: [
      { url: "/logo/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/logo/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/logo/favicon-128.png", sizes: "128x128", type: "image/png" },
    ],
  },
}

export default async function AdminLayout({ children }) {
  const session = await auth()
  if (!session) {
    return (
      <div className="unauthorized">
        <span> This Page Is Only Available To A Verified Admin</span>
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
