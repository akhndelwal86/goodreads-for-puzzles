import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Configurable logging utility
const isProduction = process.env.NODE_ENV === 'production'
const isDebugEnabled = process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development'

export const logger = {
  debug: (message: string, data?: any) => {
    if (isDebugEnabled && !isProduction) {
      if (data) {
        console.log(`🔍 ${message}`, data)
      } else {
        console.log(`🔍 ${message}`)
      }
    }
  },
  info: (message: string, data?: any) => {
    if (isDebugEnabled && !isProduction) {
      if (data) {
        console.log(`ℹ️ ${message}`, data)
      } else {
        console.log(`ℹ️ ${message}`)
      }
    }
  },
  success: (message: string, data?: any) => {
    if (isDebugEnabled && !isProduction) {
      if (data) {
        console.log(`✅ ${message}`, data)
      } else {
        console.log(`✅ ${message}`)
      }
    }
  },
  warning: (message: string, data?: any) => {
    if (isDebugEnabled && !isProduction) {
      if (data) {
        console.warn(`⚠️ ${message}`, data)
      } else {
        console.warn(`⚠️ ${message}`)
      }
    }
  },
  error: (message: string, error?: any) => {
    // Always log errors, even in production
    if (error) {
      console.error(`❌ ${message}`, error)
    } else {
      console.error(`❌ ${message}`)
    }
  }
}
