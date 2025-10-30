export interface User {
  id: string
  walletAddress: string
  businessName?: string
  email?: string
  did?: string
  trustScore?: number
  createdAt: Date
  updatedAt: Date
}

export interface Wallet {
  address: string
  connected: boolean
  balance?: number
  publicKey?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}