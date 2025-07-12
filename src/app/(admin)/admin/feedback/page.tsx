'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  MessageSquare,
  Bug,
  Calendar,
  User,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Filter
} from 'lucide-react'

interface FeatureRequest {
  id: string
  title: string
  category: string
  description: string
  problem: string
  solution: string
  priority: string
  status: string
  user_email: string
  votes_count: number
  submitted_at: string
  admin_notes: string
  implementation_effort: string
}

interface BugReport {
  id: string
  title: string
  description: string
  steps_to_reproduce: string
  expected_behavior: string
  actual_behavior: string
  device: string
  browser: string
  severity: string
  status: string
  user_email: string
  priority_score: number
  submitted_at: string
  admin_notes: string
}

const FeatureRequestCard = ({ 
  request, 
  onView, 
  onUpdateStatus 
}: { 
  request: FeatureRequest
  onView: (request: FeatureRequest) => void
  onUpdateStatus: (id: string, status: string, notes?: string) => void
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700'
      case 'important': return 'bg-orange-100 text-orange-700'
      case 'helpful': return 'bg-blue-100 text-blue-700'
      case 'nice-to-have': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-700'
      case 'reviewing': return 'bg-blue-100 text-blue-700'
      case 'planned': return 'bg-purple-100 text-purple-700'
      case 'in-development': return 'bg-orange-100 text-orange-700'
      case 'completed': return 'bg-green-100 text-green-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{request.title}</CardTitle>
            <CardDescription className="flex items-center space-x-2 mt-1">
              <span>Category: {request.category}</span>
              <span>•</span>
              <span>{new Date(request.submitted_at).toLocaleDateString()}</span>
            </CardDescription>
          </div>
          <div className="flex flex-col space-y-1">
            <Badge className={getPriorityColor(request.priority)}>
              {request.priority}
            </Badge>
            <Badge className={getStatusColor(request.status)}>
              {request.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600 line-clamp-3">{request.description}</p>
        
        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{request.user_email}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>{request.votes_count} votes</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => onView(request)}
            size="sm"
            variant="outline"
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          {request.status === 'submitted' && (
            <Select onValueChange={(status) => onUpdateStatus(request.id, status)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Update" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reviewing">Review</SelectItem>
                <SelectItem value="planned">Plan</SelectItem>
                <SelectItem value="rejected">Reject</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const BugReportCard = ({ 
  report, 
  onView, 
  onUpdateStatus 
}: { 
  report: BugReport
  onView: (report: BugReport) => void
  onUpdateStatus: (id: string, status: string, notes?: string) => void
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-700'
      case 'confirmed': return 'bg-blue-100 text-blue-700'
      case 'in-progress': return 'bg-orange-100 text-orange-700'
      case 'fixed': return 'bg-green-100 text-green-700'
      case 'duplicate': return 'bg-purple-100 text-purple-700'
      case 'cannot-reproduce': return 'bg-gray-100 text-gray-700'
      case 'wont-fix': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{report.title}</CardTitle>
            <CardDescription className="flex items-center space-x-2 mt-1">
              <span>{report.device} • {report.browser}</span>
              <span>•</span>
              <span>{new Date(report.submitted_at).toLocaleDateString()}</span>
            </CardDescription>
          </div>
          <div className="flex flex-col space-y-1">
            <Badge className={getSeverityColor(report.severity)}>
              {report.severity}
            </Badge>
            <Badge className={getStatusColor(report.status)}>
              {report.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600 line-clamp-3">{report.description}</p>
        
        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{report.user_email}</span>
            </div>
            <div className="flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Score: {report.priority_score}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => onView(report)}
            size="sm"
            variant="outline"
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          {report.status === 'submitted' && (
            <Select onValueChange={(status) => onUpdateStatus(report.id, status)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Update" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">Confirm</SelectItem>
                <SelectItem value="in-progress">Start Fix</SelectItem>
                <SelectItem value="cannot-reproduce">Can't Reproduce</SelectItem>
                <SelectItem value="duplicate">Duplicate</SelectItem>
                <SelectItem value="wont-fix">Won't Fix</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminFeedbackPage() {
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([])
  const [bugReports, setBugReports] = useState<BugReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFeature, setSelectedFeature] = useState<FeatureRequest | null>(null)
  const [selectedBug, setBugReport] = useState<BugReport | null>(null)
  const [showFeatureDialog, setShowFeatureDialog] = useState(false)
  const [showBugDialog, setShowBugDialog] = useState(false)

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      setIsLoading(true)
      
      // Fetch feature requests
      const featuresResponse = await fetch('/api/admin/feedback/features')
      if (featuresResponse.ok) {
        const featuresData = await featuresResponse.json()
        setFeatureRequests(featuresData)
      }

      // Fetch bug reports
      const bugsResponse = await fetch('/api/admin/feedback/bugs')
      if (bugsResponse.ok) {
        const bugsData = await bugsResponse.json()
        setBugReports(bugsData)
      }
    } catch (error) {
      console.error('Error fetching feedback:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateFeatureStatus = async (id: string, status: string, notes?: string) => {
    try {
      const response = await fetch('/api/admin/feedback/features/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, adminNotes: notes })
      })

      if (response.ok) {
        // Update local state
        setFeatureRequests(prev => 
          prev.map(req => req.id === id ? { ...req, status } : req)
        )
      }
    } catch (error) {
      console.error('Error updating feature request:', error)
    }
  }

  const handleUpdateBugStatus = async (id: string, status: string, notes?: string) => {
    try {
      const response = await fetch('/api/admin/feedback/bugs/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, adminNotes: notes })
      })

      if (response.ok) {
        // Update local state
        setBugReports(prev => 
          prev.map(report => report.id === id ? { ...report, status } : report)
        )
      }
    } catch (error) {
      console.error('Error updating bug report:', error)
    }
  }

  const newFeatureRequests = featureRequests.filter(req => req.status === 'submitted').length
  const newBugReports = bugReports.filter(report => report.status === 'submitted').length

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Feedback Management</h1>
          <p className="text-slate-600">Manage feature requests and bug reports from users</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{newFeatureRequests}</p>
                <p className="text-sm text-slate-600">New Features</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <Bug className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{newBugReports}</p>
                <p className="text-sm text-slate-600">New Bugs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {featureRequests.filter(req => req.status === 'completed').length}
                </p>
                <p className="text-sm text-slate-600">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {bugReports.filter(report => report.status === 'in-progress').length}
                </p>
                <p className="text-sm text-slate-600">In Progress</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="features" className="space-y-4">
          <TabsList>
            <TabsTrigger value="features" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Feature Requests</span>
              {newFeatureRequests > 0 && (
                <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                  {newFeatureRequests}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="bugs" className="flex items-center space-x-2">
              <Bug className="w-4 h-4" />
              <span>Bug Reports</span>
              {newBugReports > 0 && (
                <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                  {newBugReports}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading feature requests...</p>
                </div>
              </div>
            ) : featureRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featureRequests.map((request) => (
                  <FeatureRequestCard
                    key={request.id}
                    request={request}
                    onView={(req) => {
                      setSelectedFeature(req)
                      setShowFeatureDialog(true)
                    }}
                    onUpdateStatus={handleUpdateFeatureStatus}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="w-12 h-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No feature requests</h3>
                  <p className="text-slate-600 text-center">No feature requests found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="bugs" className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading bug reports...</p>
                </div>
              </div>
            ) : bugReports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bugReports.map((report) => (
                  <BugReportCard
                    key={report.id}
                    report={report}
                    onView={(rep) => {
                      setBugReport(rep)
                      setShowBugDialog(true)
                    }}
                    onUpdateStatus={handleUpdateBugStatus}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bug className="w-12 h-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No bug reports</h3>
                  <p className="text-slate-600 text-center">No bug reports found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Feature Request Dialog */}
        {selectedFeature && (
          <Dialog open={showFeatureDialog} onOpenChange={setShowFeatureDialog}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{selectedFeature.title}</DialogTitle>
                <DialogDescription>
                  Feature request from {selectedFeature.user_email}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-slate-800">Category</h4>
                    <p className="text-sm text-slate-600">{selectedFeature.category}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">Priority</h4>
                    <p className="text-sm text-slate-600">{selectedFeature.priority}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Problem</h4>
                  <p className="text-sm text-slate-600">{selectedFeature.problem}</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Proposed Solution</h4>
                  <p className="text-sm text-slate-600">{selectedFeature.solution}</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Description</h4>
                  <p className="text-sm text-slate-600">{selectedFeature.description}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Bug Report Dialog */}
        {selectedBug && (
          <Dialog open={showBugDialog} onOpenChange={setShowBugDialog}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{selectedBug.title}</DialogTitle>
                <DialogDescription>
                  Bug report from {selectedBug.user_email}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-slate-800">Device</h4>
                    <p className="text-sm text-slate-600">{selectedBug.device}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">Browser</h4>
                    <p className="text-sm text-slate-600">{selectedBug.browser}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">Severity</h4>
                    <p className="text-sm text-slate-600">{selectedBug.severity}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Description</h4>
                  <p className="text-sm text-slate-600">{selectedBug.description}</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Steps to Reproduce</h4>
                  <p className="text-sm text-slate-600 whitespace-pre-line">{selectedBug.steps_to_reproduce}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-slate-800">Expected Behavior</h4>
                    <p className="text-sm text-slate-600">{selectedBug.expected_behavior}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">Actual Behavior</h4>
                    <p className="text-sm text-slate-600">{selectedBug.actual_behavior}</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  )
}