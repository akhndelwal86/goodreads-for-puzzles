import { NavigationBar } from '@/components/layout/navigation-bar'
import { Footer } from '@/components/layout/footer'
import { ErrorBoundary } from '@/components/error-boundary'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ErrorBoundary>
        <NavigationBar />
      </ErrorBoundary>
      <main>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
    </>
  )
}