import { z } from 'zod'

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address')
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')
export const walletAddressSchema = z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid wallet address')

// Invoice validation schemas
export const lineItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  unitPrice: z.number().min(0.01, 'Unit price must be greater than 0'),
})

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: emailSchema.optional(),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  dueDate: z.string().min(1, 'Due date is required'),
  description: z.string().optional(),
  lineItems: z.array(lineItemSchema).min(1, 'At least one line item is required'),
})

// User validation schemas
export const userProfileSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  email: emailSchema,
  walletAddress: walletAddressSchema.optional(),
})

// Financing validation schemas
export const financingRequestSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice ID is required'),
  requestedAmount: z.number().min(0.01, 'Requested amount must be greater than 0').optional(),
  maxInterestRate: z.number().min(0, 'Interest rate must be non-negative').max(100, 'Interest rate cannot exceed 100%').optional(),
  maxFee: z.number().min(0, 'Fee must be non-negative').optional(),
  preferredTerms: z.number().min(1, 'Terms must be at least 1 day').max(365, 'Terms cannot exceed 365 days').optional(),
})

// Validation utility functions
export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success
}

export function validateWalletAddress(address: string): boolean {
  return walletAddressSchema.safeParse(address).success
}

export function validateInvoiceAmount(amount: number): boolean {
  return z.number().min(0.01).safeParse(amount).success
}

export function validateDate(dateString: string): boolean {
  const date = new Date(dateString)
  return !isNaN(date.getTime()) && date > new Date()
}

export function validatePercentage(value: number): boolean {
  return z.number().min(0).max(100).safeParse(value).success
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

export function validateFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return file.size <= maxSizeInBytes
}

// Form validation helpers
export function getValidationErrors<T>(
  schema: z.ZodSchema<T>,
  data: any
): Record<string, string> {
  const result = schema.safeParse(data)
  const errors: Record<string, string> = {}
  
  if (!result.success) {
    result.error.errors.forEach((error) => {
      const path = error.path.join('.')
      errors[path] = error.message
    })
  }
  
  return errors
}

export function hasValidationErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0
}