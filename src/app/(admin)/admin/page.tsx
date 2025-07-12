'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminRootPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to admin login or dashboard based on auth status
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/validate')
        if (response.ok) {
          const data = await response.json()
          if (data.valid) {
            router.push('/admin/dashboard')
          } else {
            router.push('/admin/login')
          }
        } else {
          router.push('/admin/login')
        }
      } catch (error) {
        router.push('/admin/login')
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Redirecting to admin panel...</p>
      </div>
    </div>
  )
}