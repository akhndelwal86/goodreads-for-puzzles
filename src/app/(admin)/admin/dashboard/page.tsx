'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Puzzle,
  Users,
  MessageSquare,
  Bug,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  pending_puzzles: number
  approved_puzzles: number
  rejected_puzzles: number
  new_feature_requests: number
  new_bug_reports: number
  new_users_week: number
  new_puzzles_week: number
  admin_actions_today: number
}

interface RecentActivity {
  id: string
  admin_username: string
  action: string
  target_type: string
  target_id: string
  details: Record<string, any>
  performed_at: string
}

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  color = 'blue',
  href 
}: {
  title: string
  value: number
  description: string
  icon: any
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  href?: string
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  }

  const CardComponent = (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className={`p-2 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-800">{value.toLocaleString()}</div>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{CardComponent}</Link>
  }

  return CardComponent
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const statsResponse = await fetch('/api/admin/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }

        // Fetch recent activity
        const activityResponse = await fetch('/api/admin/activity?limit=10')
        if (activityResponse.ok) {
          const activityData = await activityResponse.json()
          setRecentActivity(activityData)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatActionText = (activity: RecentActivity) => {
    const { action, target_type, details } = activity
    
    switch (action) {
      case 'login_success':
        return 'Logged into admin panel'
      case 'approve_puzzle':
        return `Approved puzzle "${details?.puzzle_title || 'Unknown'}"`
      case 'reject_puzzle':
        return `Rejected puzzle "${details?.puzzle_title || 'Unknown'}"`
      case 'update_feature_request':
        return `Updated feature request status to ${details?.new_status}`
      case 'update_bug_report':
        return `Updated bug report status to ${details?.new_status}`
      case 'delete_user':
        return `Deleted user account`
      default:
        return `Performed ${action.replace('_', ' ')}`
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login_success':
        return Activity
      case 'approve_puzzle':
        return CheckCircle
      case 'reject_puzzle':
        return AlertTriangle
      case 'update_feature_request':
        return MessageSquare
      case 'update_bug_report':
        return Bug
      default:
        return Activity
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'approve_puzzle':
        return 'text-emerald-600'
      case 'reject_puzzle':
        return 'text-red-600'
      case 'login_success':
        return 'text-blue-600'
      default:
        return 'text-slate-600'
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome to Admin Dashboard</h1>
          <p className="text-slate-600">Monitor and manage your Puzzlr platform</p>
        </div>

        {/* Stats grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Pending Puzzles"
              value={stats.pending_puzzles}
              description="Awaiting approval"
              icon={Clock}
              color="yellow"
              href="/admin/puzzles"
            />
            <StatCard
              title="Approved Puzzles"
              value={stats.approved_puzzles}
              description="Live on platform"
              icon={CheckCircle}
              color="green"
            />
            <StatCard
              title="New Feature Requests"
              value={stats.new_feature_requests}
              description="Submitted by users"
              icon={MessageSquare}
              color="blue"
              href="/admin/feedback"
            />
            <StatCard
              title="New Bug Reports"
              value={stats.new_bug_reports}
              description="Needs attention"
              icon={Bug}
              color="red"
              href="/admin/feedback"
            />
          </div>
        )}

        {/* Secondary stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="New Users (7 days)"
              value={stats.new_users_week}
              description="User registrations"
              icon={Users}
              color="purple"
            />
            <StatCard
              title="New Puzzles (7 days)"
              value={stats.new_puzzles_week}
              description="User submissions"
              icon={Puzzle}
              color="blue"
            />
            <StatCard
              title="Admin Actions Today"
              value={stats.admin_actions_today}
              description="Your activity"
              icon={Activity}
              color="green"
            />
            <StatCard
              title="Rejected Puzzles"
              value={stats.rejected_puzzles}
              description="Not approved"
              icon={AlertTriangle}
              color="red"
            />
          </div>
        )}

        {/* Recent activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Recent Admin Activity</span>
              </CardTitle>
              <CardDescription>
                Latest actions performed in the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const ActionIcon = getActionIcon(activity.action)
                    const actionColor = getActionColor(activity.action)
                    
                    return (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`p-1.5 rounded-full bg-slate-100 ${actionColor}`}>
                          <ActionIcon className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-800">
                            {formatActionText(activity)}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-slate-500">
                              {activity.admin_username}
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500">
                              {new Date(activity.performed_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No recent activity</p>
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>
                Common admin tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/puzzles">
                <Button className="w-full justify-start" variant="outline">
                  <Puzzle className="w-4 h-4 mr-2" />
                  Review Pending Puzzles
                  {stats && stats.pending_puzzles > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {stats.pending_puzzles}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              <Link href="/admin/feedback">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Manage Feedback
                  {stats && (stats.new_feature_requests + stats.new_bug_reports) > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {stats.new_feature_requests + stats.new_bug_reports}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              <Link href="/admin/users">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
              </Link>
              
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}