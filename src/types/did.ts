export interface DID {
  id: string
  did: string
  userId: string
  document: DIDDocument
  verified: boolean
  trustScore: number
  credentials: Credential[]
  createdAt: Date
  updatedAt: Date
}

export interface DIDDocument {
  '@context': string[]
  id: string
  verificationMethod: VerificationMethod[]
  authentication: string[]
  service: Service[]
}

export interface VerificationMethod {
  id: string
  type: string
  controller: string
  publicKeyJwk?: any
  publicKeyMultibase?: string
}

export interface Service {
  id: string
  type: string
  serviceEndpoint: string
}

export interface Credential {
  id: string
  type: string
  issuer: string
  subject: string
  issuanceDate: Date
  expirationDate?: Date
  credentialSubject: any
  proof: Proof
  verified: boolean
}

export interface Proof {
  type: string
  created: Date
  verificationMethod: string
  proofPurpose: string
  jws?: string
}

export interface TrustScoreMetrics {
  paymentHistory: number
  businessVerification: number
  transactionVolume: number
  networkReputation: number
  overall: number
}

export interface BusinessVerification {
  businessName: string
  registrationNumber?: string
  taxId?: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  verified: boolean
  verifiedAt?: Date
  documents: VerificationDocument[]
}

export interface VerificationDocument {
  id: string
  type: 'business_registration' | 'tax_certificate' | 'bank_statement' | 'other'
  name: string
  url: string
  verified: boolean
  uploadedAt: Date
}