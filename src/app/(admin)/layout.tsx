import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { QueryProvider } from '@/components/providers/query-provider'
import { ErrorBoundary } from '@/components/error-boundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin Panel - Puzzlr Management',
  description: 'Administrative interface for managing the Puzzlr platform',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryProvider>
      <ErrorBoundary>
        <div className={inter.className}>
          {children}
        </div>
      </ErrorBoundary>
    </QueryProvider>
  )
}