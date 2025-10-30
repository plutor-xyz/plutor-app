// Invoice constants
export const INVOICE_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  VIEWED: 'viewed',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
  FINANCED: 'financed',
} as const

export const INVOICE_STATUS_LABELS = {
  [INVOICE_STATUS.DRAFT]: 'Draft',
  [INVOICE_STATUS.SENT]: 'Sent',
  [INVOICE_STATUS.VIEWED]: 'Viewed',
  [INVOICE_STATUS.PAID]: 'Paid',
  [INVOICE_STATUS.OVERDUE]: 'Overdue',
  [INVOICE_STATUS.CANCELLED]: 'Cancelled',
  [INVOICE_STATUS.FINANCED]: 'Financed',
} as const

export const INVOICE_STATUS_COLORS = {
  [INVOICE_STATUS.DRAFT]: 'gray',
  [INVOICE_STATUS.SENT]: 'blue',
  [INVOICE_STATUS.VIEWED]: 'yellow',
  [INVOICE_STATUS.PAID]: 'green',
  [INVOICE_STATUS.OVERDUE]: 'red',
  [INVOICE_STATUS.CANCELLED]: 'gray',
  [INVOICE_STATUS.FINANCED]: 'purple',
} as const

// Financing constants
export const FINANCING_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
  COMPLETED: 'completed',
  FUNDED: 'funded',
  CANCELLED: 'cancelled',
} as const

export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const

export const RISK_LEVEL_LABELS = {
  [RISK_LEVELS.LOW]: 'Low Risk',
  [RISK_LEVELS.MEDIUM]: 'Medium Risk',
  [RISK_LEVELS.HIGH]: 'High Risk',
} as const

// Currency constants
export const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
] as const

export const DEFAULT_CURRENCY = 'USD'

// Solana constants
export const SOLANA_NETWORKS = {
  MAINNET: 'mainnet-beta',
  TESTNET: 'testnet',
  DEVNET: 'devnet',
} as const

export const TRANSACTION_CONFIRMATION_LEVELS = {
  PROCESSED: 'processed',
  CONFIRMED: 'confirmed',
  FINALIZED: 'finalized',
} as const

// API constants
export const API_ENDPOINTS = {
  INVOICES: '/api/invoices',
  SEND_INVOICE: '/api/send-invoice',
  GENERATE_PDF: '/api/generate-pdf',
  FINANCING: '/api/financing',
  WEBHOOKS: '/api/webhooks',
  DID: '/api/did',
  USER: '/api/user',
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

// Pagination constants
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// File upload constants
export const MAX_FILE_SIZE_MB = 10
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png']

// Time constants
export const TIME_UNITS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
} as const

// Validation constants
export const VALIDATION_RULES = {
  INVOICE_NUMBER: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  CLIENT_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  DESCRIPTION: {
    MAX_LENGTH: 1000,
  },
  AMOUNT: {
    MIN: 0.01,
    MAX: 1000000,
  },
  INTEREST_RATE: {
    MIN: 0,
    MAX: 100,
  },
  TERMS_DAYS: {
    MIN: 1,
    MAX: 365,
  },
} as const

// Feature flags
export const FEATURES = {
  DID_INTEGRATION: true,
  EMAIL_NOTIFICATIONS: true,
  PDF_GENERATION: true,
  FINANCING_MARKETPLACE: true,
  WEBHOOKS: true,
  MULTI_CURRENCY: false,
  ADVANCED_ANALYTICS: false,
} as const

export type InvoiceStatus = keyof typeof INVOICE_STATUS
export type FinancingStatus = keyof typeof FINANCING_STATUS
export type RiskLevel = keyof typeof RISK_LEVELS
export type SolanaNetwork = keyof typeof SOLANA_NETWORKS