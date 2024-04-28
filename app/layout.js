import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/Navbar/Navbar";
import { ThemeProvider } from "@/components/ui/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DocuFlow",
  description: "This is the builder for the DocuFlow",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed top-0 z-50">
            <Navbar />
          </div>
          <div>
            {children}
          </div>
          <ToastContainer/>
        </ThemeProvider>
      </body>
    </html>
  );
}
