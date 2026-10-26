import Footer from "@components/Footer"
import User from "@utils/user"
import Provider from "@utils/sessionProvider"
import ReactQueryProvider from "@utils/ReactQueryProvider"
import { Suspense } from "react"
import Nav from "@components/Nav"
export const metadata = {
  title: "FirstEstates",
  description: "",
  icons: {
   icon: "/logo/favicon.png",
  },
}

export default function RootLayout({ children }) {
  return (
    <>
      <Suspense>
        <ReactQueryProvider>
          <Provider>
            <User>
              {children}
              {/* <Footer />    */}
            </User>
          </Provider>
        </ReactQueryProvider>
      </Suspense>
    </>
  )
}
