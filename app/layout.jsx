import "@styles";
import './globals.css'
import {DarkModeProvider} from '@lib/DarkModeProvider'
import Script from "next/script";
import Nav from "@components/Nav";
import { auth } from "@auth";
import Image from "next/image";
import Link from "next/link";


export const metadata = {
  title: "FirstEstates",
  description: "Find Your Perfect Student Home",
  icons: {
    icon: "/icons/edit.svg",
  },
};

export default async function RootLayout({children}) {

 const session = await auth()

if (session?.user?.banStatus === true) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="text-foreground whitespace-pre-wrap break-words">
      <div className="mx-auto mt-50">
          <h1 className="text-3xl font-bold mx-auto text-center">Access Denied</h1>
          <p>Your account has been banned. Please contact support if you believe this is a mistake.</p>
        
       <p>
  <span>Contact email support at:</span>
  <a
    href="https://mail.google.com/mail/?view=cm&fs=1&to=firstestatesng@gmail.com"
    target="_blank"
    rel="noopener noreferrer"
    className="quickLink ml-1"
  >
  firstestatesng@gmail.com
  </a>
      </p>
      <div className='mx-auto text-center w-80'>or contact support on</div>
    <div className="flex items-center justify-center w-80 mx-auto gap-2">
    
    <Link href="https://instagram.com/yourusername" target="_blank">
  <Image 
    src="/icons/instagram.svg"
    alt="instagram"
    width={30}
    height={30}
  />
</Link>

<Link href="https://wa.me/2340000000000" target="_blank">
  <Image 
    src="/icons/whatsapp.svg"
    alt="whatsapp"
    width={40}
    height={40}
  />
</Link>

<Link href="https://twitter.com/yourusername" target="_blank">
  <Image 
    src="/icons/x.svg"
    alt="X"
    width={40}
    height={40}
  />
</Link>
    </div>
    </div>
      </body>
    </html>
  )
}

  return (
       <html lang="en" suppressHydrationWarning>
     <head>
      <Script src="https://js.paystack.co/v2/inline.js" 
      strategy="beforeInteractive" />
        <script>
            {`
    (function() {
        const storedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        //  document.documentElement.classList.add(storedTheme');
        if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
          document.documentElement.classList.add('dark');
        }
    })();
  `}
        </script>
            
      
      
        </head>
              <body>
    
      <DarkModeProvider>
          {children} 
   </DarkModeProvider>

      </body>  
       
  
    </html> 
 
  );
}
