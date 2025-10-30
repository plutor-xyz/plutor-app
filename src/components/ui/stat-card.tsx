import { ReactNode } from 'react'
import Card, { CardContent } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: ReactNode
  variant?: 'default' | 'wealth'
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  variant = 'default' 
}: StatCardProps) {
  const changeColors = {
    positive: 'text-plutor-green',
    negative: 'text-red-400',
    neutral: 'text-gray-400'
  }

  return (
    <Card variant={variant === 'wealth' ? 'wealth' : 'default'} glow={variant === 'wealth'}>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            {change && (
              <p className={`text-sm mt-1 ${changeColors[changeType]}`}>
                {change}
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-plutor-green/20 rounded-xl flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}