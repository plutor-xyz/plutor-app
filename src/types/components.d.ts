import { ReactNode } from 'react'

export interface BaseComponentProps {
  children?: ReactNode
  className?: string
}

export interface ButtonVariant {
  variant?: 'primary' | 'secondary' | 'success' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export interface CardVariant {
  variant?: 'default' | 'light' | 'cosmic' | 'wealth'
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}