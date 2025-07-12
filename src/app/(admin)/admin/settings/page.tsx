'use client'

import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Cog } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Platform Settings</h1>
          <p className="text-slate-600">Configure platform settings and preferences</p>
        </div>

        {/* Coming Soon */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Settings className="w-16 h-16 text-slate-400 mb-4" />
            <h3 className="text-xl font-medium text-slate-800 mb-2">Settings Panel Coming Soon</h3>
            <p className="text-slate-600 text-center max-w-md">
              Platform configuration, email settings, and system preferences will be available in a future update.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}