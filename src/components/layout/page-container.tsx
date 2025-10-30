import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {children}
      </div>
    </div>
  )
}