import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { NavigationBar } from '@/components/layout/navigation-bar'
import { QueryProvider } from '@/components/providers/query-provider'
import { ErrorBoundary } from '@/components/error-boundary'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Puzzlr - Discover & Track Jigsaw Puzzles',
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
        <QueryProvider>
          <ErrorBoundary>
            <NavigationBar />
          </ErrorBoundary>
          <main>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </QueryProvider>
      </body>
    </html>
  </ClerkProvider>
  )
}