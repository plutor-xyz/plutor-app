import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  description?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'cosmic'
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className,
  label,
  error,
  description,
  leftIcon,
  rightIcon,
  variant = 'default',
  ...props
}, ref) => {
  const variantClasses = {
    default: 'input',
    cosmic: 'input bg-plutor-navy-800/50 border-plutor-purple/30 focus:border-plutor-purple focus:ring-plutor-purple/30',
  }
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-plutor-navy-200">
          {label}
          {required && <span className="text-plutor-red ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-sm text-plutor-navy-400">{description}</p>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-plutor-navy-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={cn(
            variantClasses[variant],
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-plutor-red focus:border-plutor-red focus:ring-plutor-red/30',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-plutor-navy-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-plutor-red flex items-center gap-1">
          <span className="text-xs">⚠</span>
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  description?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className,
  label,
  error,
  description,
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-plutor-navy-200">
          {label}
          {required && <span className="text-plutor-red ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-sm text-plutor-navy-400">{description}</p>
      )}
      
      <textarea
        ref={ref}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        rows={rows}
        className={cn(
          'input resize-none',
          error && 'border-plutor-red focus:border-plutor-red focus:ring-plutor-red/30',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-plutor-red flex items-center gap-1">
          <span className="text-xs">⚠</span>
          {error}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Input