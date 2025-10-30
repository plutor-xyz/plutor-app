import { useWallet as useWalletAdapter } from '@solana/wallet-adapter-react'
import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { useCallback } from 'react'

export function useWallet() {
  const { connection } = useConnection()
  const {
    wallet,
    publicKey,
    connecting,
    connected,
    disconnecting,
    connect,
    disconnect,
    sendTransaction,
    signTransaction,
    signAllTransactions
  } = useWalletAdapter()

  const getBalance = useCallback(async () => {
    if (!publicKey) return 0
    try {
      const balance = await connection.getBalance(publicKey)
      return balance / 1e9 // Convert lamports to SOL
    } catch (error) {
      console.error('Error getting balance:', error)
      return 0
    }
  }, [connection, publicKey])

  const sendAndConfirmTransaction = useCallback(async (transaction: Transaction) => {
    if (!publicKey || !sendTransaction) {
      throw new Error('Wallet not connected')
    }

    try {
      const signature = await sendTransaction(transaction, connection)
      await connection.confirmTransaction(signature, 'confirmed')
      return signature
    } catch (error) {
      console.error('Transaction failed:', error)
      throw error
    }
  }, [connection, publicKey, sendTransaction])

  return {
    wallet,
    publicKey,
    connecting,
    connected,
    disconnecting,
    connect,
    disconnect,
    sendTransaction,
    signTransaction,
    signAllTransactions,
    getBalance,
    sendAndConfirmTransaction,
    connection
  }
}