import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { NavigationBar } from '@/components/layout/navigation-bar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PuzzleBase - Goodreads for Jigsaw Puzzles',
  description: 'A social platform for puzzle enthusiasts to discover, track, and share their jigsaw puzzle journey',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  <ClerkProvider>
    <html lang="en">
      <body 
        className={inter.className}
        suppressHydrationWarning={true}
      >
        <NavigationBar />
        <main>
          {children}
        </main>
      </body>
    </html>
  </ClerkProvider>
  )
}