import { ReactNode } from 'react'
import Card, { CardContent } from '@/components/ui/card'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
  icon?: ReactNode
}

export default function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="text-center py-12">
        {icon && (
          <div className="mx-auto w-16 h-16 bg-plutor-green/10 rounded-full flex items-center justify-center mb-4">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300 mb-6">{description}</p>
        {action}
      </CardContent>
    </Card>
  )
}