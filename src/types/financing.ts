export interface FinancingOffer {
  id: string
  invoiceId: string
  lenderId: string
  lenderName: string
  amount: number
  advanceRate: number // Percentage of invoice amount
  interestRate: number // Annual percentage rate
  fee: number // Upfront fee
  terms: number // Days until repayment
  status: FinancingOfferStatus
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
  acceptedAt?: Date
  metadata?: OfferMetadata
}

export enum FinancingOfferStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  COMPLETED = 'completed',
}

export interface OfferMetadata {
  riskScore: number
  collateralRequirement: boolean
  autoAccept: boolean
  priority: number
}

export interface FinancingRequest {
  id: string
  invoiceId: string
  requesterId: string
  requestedAmount: number
  maxInterestRate?: number
  maxFee?: number
  preferredTerms?: number
  status: FinancingRequestStatus
  offers: FinancingOffer[]
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
}

export enum FinancingRequestStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  FUNDED = 'funded',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export interface FinancingPool {
  id: string
  name: string
  description: string
  totalCapacity: number
  availableCapacity: number
  interestRate: number
  minimumAmount: number
  maximumAmount: number
  terms: number[]
  riskTolerance: RiskLevel
  autoApproval: boolean
  requirements: PoolRequirements
  performance: PoolPerformance
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface PoolRequirements {
  minimumTrustScore: number
  businessVerificationRequired: boolean
  maximumDaysOverdue: number
  minimumTransactionHistory: number
}

export interface PoolPerformance {
  totalFinanced: number
  totalRepaid: number
  defaultRate: number
  averageReturn: number
  activeBorrows: number
}

export interface FinancingTransaction {
  id: string
  type: 'advance' | 'repayment' | 'fee'
  offerId: string
  invoiceId: string
  amount: number
  txHash: string
  status: 'pending' | 'confirmed' | 'failed'
  createdAt: Date
  confirmedAt?: Date
}