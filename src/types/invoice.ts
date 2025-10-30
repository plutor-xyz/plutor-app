export interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail?: string
  clientAddress?: Address
  amount: number
  currency: string
  description?: string
  lineItems: LineItem[]
  dueDate: Date
  issueDate: Date
  status: InvoiceStatus
  paymentTerms?: string
  notes?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  paidAt?: Date
  paidAmount?: number
  txHash?: string
}

export interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  VIEWED = 'viewed',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  FINANCED = 'financed',
}

export interface InvoiceFormData {
  invoiceNumber: string
  clientName: string
  clientEmail: string
  amount: number
  dueDate: string
  description: string
  lineItems: LineItem[]
}

export interface InvoiceFilters {
  status?: InvoiceStatus[]
  dateRange?: {
    start: Date
    end: Date
  }
  amountRange?: {
    min: number
    max: number
  }
  search?: string
}