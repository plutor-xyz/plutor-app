import { ReactNode } from 'react'

interface TableProps {
  children: ReactNode
  className?: string
}

export default function Table({ children, className = '' }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
        {children}
      </table>
    </div>
  )
}

interface TableHeaderProps {
  children: ReactNode
  className?: string
}

export function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <thead className={`bg-gray-50 ${className}`}>
      {children}
    </thead>
  )
}

interface TableBodyProps {
  children: ReactNode
  className?: string
}

export function TableBody({ children, className = '' }: TableBodyProps) {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  )
}

interface TableRowProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function TableRow({ children, className = '', onClick }: TableRowProps) {
  const clickableClasses = onClick ? 'cursor-pointer hover:bg-gray-50' : ''
  
  return (
    <tr 
      className={`${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

interface TableCellProps {
  children: ReactNode
  className?: string
  header?: boolean
}

export function TableCell({ children, className = '', header = false }: TableCellProps) {
  const baseClasses = 'px-6 py-4 whitespace-nowrap'
  const headerClasses = header 
    ? 'text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
    : 'text-sm text-gray-900'
  
  const Tag = header ? 'th' : 'td'
  
  return (
    <Tag className={`${baseClasses} ${headerClasses} ${className}`}>
      {children}
    </Tag>
  )
}