import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vault E-Wallet",
  description: "Manage your finance online and track your tarnsactions",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "900"], 
  variable: "--font-montserrat",
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}>

        <div className="flex">
          <Sidebar /> 
          <main className="flex-1 bg-white">
            {children}
          </main>
        </div>
        
      </body>
    </html>
  );
}
