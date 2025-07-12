'use client'

import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Search, UserPlus } from 'lucide-react'

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-600">Manage user accounts and permissions</p>
        </div>

        {/* Coming Soon */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="w-16 h-16 text-slate-400 mb-4" />
            <h3 className="text-xl font-medium text-slate-800 mb-2">User Management Coming Soon</h3>
            <p className="text-slate-600 text-center max-w-md">
              User search, account management, and moderation tools will be available in a future update.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}