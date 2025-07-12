import { createServiceClient } from './supabase'
import { NextRequest } from 'next/server'
import crypto from 'crypto'

// Admin authentication configuration
const ADMIN_CONFIG = {
  // These should be stored in environment variables in production
  USERNAME: process.env.ADMIN_USERNAME || 'admin',
  PASSWORD: process.env.ADMIN_PASSWORD || 'puzzlr2025!',
  SESSION_DURATION: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
  CLEANUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
}

export interface AdminSession {
  id: string
  sessionToken: string
  adminUsername: string
  createdAt: string
  expiresAt: string
  lastAccessedAt: string
  ipAddress?: string
  userAgent?: string
  isActive: boolean
}

export interface AdminLoginResult {
  success: boolean
  sessionToken?: string
  expiresAt?: string
  error?: string
}

export interface AdminAuthResult {
  isValid: boolean
  session?: AdminSession
  error?: string
}

/**
 * Admin Authentication Service
 * Handles login, session management, and authorization for admin dashboard
 */
export class AdminAuth {
  private supabase = createServiceClient()

  /**
   * Authenticate admin credentials and create session
   */
  async login(
    username: string, 
    password: string, 
    ipAddress?: string, 
    userAgent?: string
  ): Promise<AdminLoginResult> {
    try {
      // Validate credentials
      if (username !== ADMIN_CONFIG.USERNAME || password !== ADMIN_CONFIG.PASSWORD) {
        await this.logActivity(null, username, 'login_failed', null, null, {
          reason: 'Invalid credentials'
        }, ipAddress, userAgent)
        
        return {
          success: false,
          error: 'Invalid credentials'
        }
      }

      // Generate secure session token
      const sessionToken = this.generateSessionToken()
      const expiresAt = new Date(Date.now() + ADMIN_CONFIG.SESSION_DURATION)

      // Create session in database
      const { data: session, error } = await this.supabase
        .from('admin_sessions')
        .insert({
          session_token: sessionToken,
          admin_username: username,
          expires_at: expiresAt.toISOString(),
          ip_address: ipAddress,
          user_agent: userAgent,
          is_active: true
        })
        .select()
        .single()

      if (error) {
        console.error('Failed to create admin session:', error)
        return {
          success: false,
          error: 'Failed to create session'
        }
      }

      // Log successful login
      await this.logActivity(session.id, username, 'login_success', null, null, {
        session_duration_hours: ADMIN_CONFIG.SESSION_DURATION / (60 * 60 * 1000)
      }, ipAddress, userAgent)

      return {
        success: true,
        sessionToken,
        expiresAt: expiresAt.toISOString()
      }

    } catch (error) {
      console.error('Admin login error:', error)
      return {
        success: false,
        error: 'Login failed'
      }
    }
  }

  /**
   * Validate admin session token
   */
  async validateSession(sessionToken: string): Promise<AdminAuthResult> {
    try {
      if (!sessionToken) {
        return { isValid: false, error: 'No session token provided' }
      }

      // Check session in database using the helper function
      const { data, error } = await this.supabase
        .rpc('get_admin_session_info', { token: sessionToken })
        .returns<Array<{
          session_id: string
          admin_username: string
          expires_at: string
          is_valid: boolean
        }>>()

      if (error) {
        console.error('Session validation error:', error)
        // If function doesn't exist, fallback to direct table query
        if (error.message?.includes('function') || error.message?.includes('does not exist')) {
          return await this.validateSessionFallback(sessionToken)
        }
        return { isValid: false, error: 'Session validation failed' }
      }

      if (!data || data.length === 0) {
        return { isValid: false, error: 'Session not found' }
      }

      const sessionInfo = data[0]
      
      if (!sessionInfo.is_valid) {
        // Clean up expired/invalid session
        await this.invalidateSession(sessionToken)
        return { isValid: false, error: 'Session expired or invalid' }
      }

      // Update last accessed time
      await this.supabase
        .from('admin_sessions')
        .update({ last_accessed_at: new Date().toISOString() })
        .eq('session_token', sessionToken)

      // Get full session details
      const { data: fullSession } = await this.supabase
        .from('admin_sessions')
        .select('*')
        .eq('session_token', sessionToken)
        .single()

      return {
        isValid: true,
        session: fullSession ? {
          id: fullSession.id,
          sessionToken: fullSession.session_token,
          adminUsername: fullSession.admin_username,
          createdAt: fullSession.created_at,
          expiresAt: fullSession.expires_at,
          lastAccessedAt: fullSession.last_accessed_at,
          ipAddress: fullSession.ip_address,
          userAgent: fullSession.user_agent,
          isActive: fullSession.is_active
        } : undefined
      }

    } catch (error) {
      console.error('Session validation error:', error)
      return { isValid: false, error: 'Session validation failed' }
    }
  }

  /**
   * Fallback session validation using direct table query
   */
  private async validateSessionFallback(sessionToken: string): Promise<AdminAuthResult> {
    try {
      const { data: session, error } = await this.supabase
        .from('admin_sessions')
        .select('*')
        .eq('session_token', sessionToken)
        .eq('is_active', true)
        .single()

      if (error || !session) {
        return { isValid: false, error: 'Session not found' }
      }

      const now = new Date()
      const expiresAt = new Date(session.expires_at)

      if (expiresAt <= now) {
        // Session expired
        await this.invalidateSession(sessionToken)
        return { isValid: false, error: 'Session expired' }
      }

      // Update last accessed time
      await this.supabase
        .from('admin_sessions')
        .update({ last_accessed_at: now.toISOString() })
        .eq('session_token', sessionToken)

      return {
        isValid: true,
        session: {
          id: session.id,
          sessionToken: session.session_token,
          adminUsername: session.admin_username,
          createdAt: session.created_at,
          expiresAt: session.expires_at,
          lastAccessedAt: session.last_accessed_at,
          ipAddress: session.ip_address,
          userAgent: session.user_agent,
          isActive: session.is_active
        }
      }
    } catch (error) {
      console.error('Fallback session validation error:', error)
      return { isValid: false, error: 'Session validation failed' }
    }
  }

  /**
   * Invalidate admin session (logout)
   */
  async logout(sessionToken: string): Promise<boolean> {
    try {
      // Get session info before deletion for logging
      const { data: session } = await this.supabase
        .from('admin_sessions')
        .select('id, admin_username')
        .eq('session_token', sessionToken)
        .single()

      // Mark session as inactive
      const { error } = await this.supabase
        .from('admin_sessions')
        .update({ is_active: false })
        .eq('session_token', sessionToken)

      if (error) {
        console.error('Logout error:', error)
        return false
      }

      // Log logout activity
      if (session) {
        await this.logActivity(session.id, session.admin_username, 'logout', null, null, {
          reason: 'Manual logout'
        })
      }

      return true

    } catch (error) {
      console.error('Logout error:', error)
      return false
    }
  }

  /**
   * Invalidate specific session
   */
  async invalidateSession(sessionToken: string): Promise<void> {
    try {
      await this.supabase
        .from('admin_sessions')
        .update({ is_active: false })
        .eq('session_token', sessionToken)
    } catch (error) {
      console.error('Error invalidating session:', error)
    }
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    try {
      const { data, error } = await this.supabase
        .rpc('cleanup_expired_admin_sessions')

      if (error) {
        console.error('Cleanup error:', error)
        return 0
      }

      return data || 0

    } catch (error) {
      console.error('Session cleanup error:', error)
      return 0
    }
  }

  /**
   * Log admin activity for audit trail
   */
  async logActivity(
    sessionId: string | null,
    adminUsername: string,
    action: string,
    targetType?: string | null,
    targetId?: string | null,
    details?: Record<string, any> | null,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      // Try using the RPC function first
      const { error } = await this.supabase
        .rpc('log_admin_activity', {
          p_session_id: sessionId,
          p_admin_username: adminUsername,
          p_action: action,
          p_target_type: targetType,
          p_target_id: targetId,
          p_details: details ? JSON.stringify(details) : null,
          p_ip_address: ipAddress,
          p_user_agent: userAgent
        })

      // If RPC fails, fallback to direct insert
      if (error && (error.message?.includes('function') || error.message?.includes('does not exist'))) {
        await this.supabase
          .from('admin_activity_log')
          .insert({
            session_id: sessionId,
            admin_username: adminUsername,
            action,
            target_type: targetType,
            target_id: targetId,
            details: details ? JSON.stringify(details) : null,
            ip_address: ipAddress,
            user_agent: userAgent
          })
      } else if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error logging admin activity:', error)
      // Don't throw here - logging failures shouldn't break the main functionality
    }
  }

  /**
   * Generate secure session token
   */
  private generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  /**
   * Extract IP address from request
   */
  getClientIP(request: NextRequest): string | undefined {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const remoteAddr = request.headers.get('remote-addr')
    
    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }
    
    return realIP || remoteAddr || undefined
  }

  /**
   * Extract user agent from request
   */
  getUserAgent(request: NextRequest): string | undefined {
    return request.headers.get('user-agent') || undefined
  }

  /**
   * Get admin dashboard statistics
   */
  async getDashboardStats(): Promise<Record<string, any>> {
    try {
      const { data, error } = await this.supabase
        .from('admin_dashboard_stats')
        .select('*')
        .single()

      if (error) {
        console.error('Error fetching dashboard stats:', error)
        // Fallback to individual queries if view doesn't exist
        return await this.getDashboardStatsFallback()
      }

      return data || {}

    } catch (error) {
      console.error('Dashboard stats error:', error)
      return await this.getDashboardStatsFallback()
    }
  }

  /**
   * Fallback dashboard stats using individual queries
   */
  private async getDashboardStatsFallback(): Promise<Record<string, any>> {
    try {
      const defaultStats = {
        pending_puzzles: 0,
        approved_puzzles: 0,
        rejected_puzzles: 0,
        new_feature_requests: 0,
        new_bug_reports: 0,
        new_users_week: 0,
        new_puzzles_week: 0,
        admin_actions_today: 0
      }

      // Try to get basic puzzle counts
      const { data: puzzleStats } = await this.supabase
        .from('puzzles')
        .select('approval_status')

      if (puzzleStats) {
        defaultStats.pending_puzzles = puzzleStats.filter(p => p.approval_status === 'pending').length
        defaultStats.approved_puzzles = puzzleStats.filter(p => p.approval_status === 'approved').length
        defaultStats.rejected_puzzles = puzzleStats.filter(p => p.approval_status === 'rejected').length
      }

      return defaultStats
    } catch (error) {
      console.error('Fallback stats error:', error)
      return {
        pending_puzzles: 0,
        approved_puzzles: 0,
        rejected_puzzles: 0,
        new_feature_requests: 0,
        new_bug_reports: 0,
        new_users_week: 0,
        new_puzzles_week: 0,
        admin_actions_today: 0
      }
    }
  }

  /**
   * Get recent admin activity
   */
  async getRecentActivity(limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('admin_activity_log')
        .select('*')
        .order('performed_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching admin activity:', error)
        return []
      }

      return data || []

    } catch (error) {
      console.error('Admin activity error:', error)
      return []
    }
  }
}

// Export singleton instance
export const adminAuth = new AdminAuth()

// Helper function to get admin session from request cookies
export function getAdminSessionFromCookies(request: NextRequest): string | null {
  const sessionCookie = request.cookies.get('admin_session')
  return sessionCookie?.value || null
}

// Helper function to create admin session cookie options
export function getAdminCookieOptions(expiresAt?: string) {
  const expires = expiresAt ? new Date(expiresAt) : new Date(Date.now() + ADMIN_CONFIG.SESSION_DURATION)
  
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    expires,
    path: '/'
  }
}