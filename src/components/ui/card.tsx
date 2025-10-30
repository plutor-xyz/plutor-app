import { ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'light' | 'cosmic' | 'wealth'
  padding?: boolean
  glow?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  variant = 'default',
  padding = true,
  glow = false,
  className,
  ...props
}, ref) => {
  const variantClasses = {
    default: 'card',
    light: 'card-light',
    cosmic: 'card cosmic-bg',
    wealth: 'card bg-wealth/10 border-plutor-gold/30 hover:border-plutor-gold/50',
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        variantClasses[variant],
        !padding && 'p-0',
        glow && (variant === 'wealth' ? 'glow-gold' : 'glow-purple'),
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  gradient?: boolean
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({
  children,
  gradient = false,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'mb-6 pb-4 border-b border-plutor-navy-600/30',
        gradient && 'text-gradient',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

CardHeader.displayName = 'CardHeader'

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  gradient?: boolean
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({
  children,
  size = 'md',
  gradient = false,
  className,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'text-display-4',
    md: 'text-display-3',
    lg: 'text-display-2',
  }
  
  return (
    <h3
      ref={ref}
      className={cn(
        'font-bold',
        sizeClasses[size],
        gradient && 'text-gradient',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
})

CardTitle.displayName = 'CardTitle'

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('text-plutor-navy-200', className)}
      {...props}
    >
      {children}
    </div>
  )
})

CardContent.displayName = 'CardContent'

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('mt-6 pt-4 border-t border-plutor-navy-600/30 flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  )
})

CardFooter.displayName = 'CardFooter'

export default Card