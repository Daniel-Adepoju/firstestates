import "@styles";
import './globals.css'

export const metadata = {
  title: "FirstEstates",
  description: "",
  icons: {
    icon: "/icons/edit.svg",
  },
};

export default function RootLayout({children}) {
  return (
       <html lang="en">
      <body>
  {children}
      </body>  
    </html> 
 
  );
}
