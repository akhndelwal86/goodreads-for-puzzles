import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className 
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {icon && (
        <div
          className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4"
          role="img"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      
      <h2 className="text-lg font-medium text-gray-900 mb-2" id="empty-state-title">
        {title}
      </h2>
      
      {description && (
        <p className="text-gray-500 mb-6 max-w-sm">{description}</p>
      )}
      
      {action}
    </div>
  )
} 