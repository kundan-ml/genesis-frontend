'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";
import { ThemeProvider } from 'next-themes';
import Header from "@/components/Header";
import { Analytics } from '@vercel/analytics/next';
import ThemeToggle from "@/components/ThemeToggle";
const inter = Inter({ subsets: ["latin"] });

// import { Poppins } from "next/font/google";

// const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export default function RootLayout({ children, session }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <title>Genie Genesis</title>
        <meta name="description" content="Transform text descriptions into stunning images with Genie Genesis." />
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={` scrollbar-hidden dark:bg-neutral-800 bg-neutral-200`}>
        <SessionProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <ThemeToggle />
            {/* <Header /> */}
            <main>
              {children}
              <Analytics />
            </main>
            {/* <Footer /> */}
          </ThemeProvider>
        </SessionProvider>
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
