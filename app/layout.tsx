import "./styles/css/styles.css";
import type { Metadata } from "next";
import Nav from './components/Nav'
import Footer from './components/Footer' 
export const metadata: Metadata = {
  title: "FirstEstates",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
       <html lang="en">
      <body>
         <Nav />
          {children}
          {/* {agent} */}
          <Footer />
      </body>
    </html> 
 
  );
}
