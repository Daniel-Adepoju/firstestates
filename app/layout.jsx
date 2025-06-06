import "@styles";
import './globals.css'
import {DarkModeProvider} from '@lib/DarkModeProvider'

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
