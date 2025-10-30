export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FilterParams {
  [key: string]: any
}

export interface SearchParams {
  q?: string
  fields?: string[]
}

export interface ApiError {
  code: string
  message: string
  details?: any
  timestamp: string
  path: string
}

export interface ValidationError {
  field: string
  message: string
  value?: any
}

export interface BulkOperationResult<T> {
  success: T[]
  errors: Array<{
    item: any
    error: ApiError
  }>
  summary: {
    total: number
    successful: number
    failed: number
  }
}

// Request/Response types for specific endpoints
export interface CreateInvoiceRequest {
  invoiceNumber: string
  clientName: string
  clientEmail: string
  amount: number
  dueDate: string
  description?: string
  lineItems: Array<{
    description: string
    quantity: number
    unitPrice: number
  }>
}

export interface UpdateInvoiceRequest extends Partial<CreateInvoiceRequest> {
  status?: string
}

export interface SendInvoiceRequest {
  invoiceId: string
  email: string
  message?: string
}

export interface GeneratePDFRequest {
  invoiceId: string
  template?: string
}

export interface RequestFinancingRequest {
  invoiceId: string
  requestedAmount?: number
  maxInterestRate?: number
  maxFee?: number
  preferredTerms?: number
}

export interface AcceptOfferRequest {
  offerId: string
  terms?: any
}

// Webhook types
export interface WebhookEvent {
  id: string
  type: string
  data: any
  timestamp: string
  signature: string
}

export interface PaymentWebhookData {
  invoiceId: string
  amount: number
  txHash: string
  fromAddress: string
  toAddress: string
}

export interface FinancingWebhookData {
  offerId: string
  invoiceId: string
  amount: number
  status: string
  txHash?: string
}