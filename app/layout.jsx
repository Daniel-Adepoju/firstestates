import "@styles";
import './globals.css'
import {DarkModeProvider} from '@lib/DarkModeProvider'
import Script from 'next/script'

export const metadata = {
  title: "FirstEstates",
  description: "",
  icons: {
    icon: "/icons/edit.svg",
  },
};

export default function RootLayout({children}) {
  return (
       <html lang="en" suppressHydrationWarning>
     <head>
        {/* <Script 
          src="https://js.paystack.co/v1/inline.js" 
          strategy="beforeInteractive"
        /> */}
        <script  src="https://js.paystack.co/v2/inline.js" >
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
