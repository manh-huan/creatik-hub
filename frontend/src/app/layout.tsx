"use client";
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Text to Video App',
//   description: 'AI-powered text-to-video generation',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isAuthenPage = pathname.startsWith('/auth');
  return (
   <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground">
        {!isAuthenPage && <Navigation />}
        <main>
          {children}
        </main>
        {!isAuthenPage && <Footer /> }
      </body>
    </html>
  )
}
