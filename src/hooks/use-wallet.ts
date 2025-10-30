import { useWallet as useWalletAdapter } from '@solana/wallet-adapter-react'
import { useConnection } from '@solana/wallet-adapter-react'
import { WalletName } from '@solana/wallet-adapter-base'
import { Transaction } from '@solana/web3.js'
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
    select,
    wallets,
    sendTransaction,
    signTransaction,
    signAllTransactions,
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

  const sendAndConfirmTransaction = useCallback(
    async (transaction: Transaction) => {
      if (!publicKey || !sendTransaction) {
        throw new Error('Wallet not connected')
      }

      try {
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash('confirmed')
        transaction.recentBlockhash = blockhash
        transaction.lastValidBlockHeight = lastValidBlockHeight

        const signature = await sendTransaction(transaction, connection)

        const confirmation = await connection.confirmTransaction(
          {
            signature,
            blockhash,
            lastValidBlockHeight,
          },
          'confirmed'
        )

        if (confirmation.value.err) {
          throw new Error('Transaction failed to confirm')
        }

        return signature
      } catch (error) {
        console.error('Transaction failed:', error)
        throw error
      }
    },
    [connection, publicKey, sendTransaction]
  )

  const connectSolflare = useCallback(async () => {
    try {
      if (connected && wallet?.adapter?.name === 'Solflare') {
        return
      }

      const solflareWallet = wallets.find((w) => w.adapter.name === 'Solflare')

      if (!solflareWallet) {
        throw new Error('Solflare wallet not found. Please install Solflare.')
      }

      if (wallet && wallet.adapter.name !== 'Solflare') {
        await disconnect()
      }

      select(solflareWallet.adapter.name as WalletName<'Solflare'>)

      if (solflareWallet.adapter.connected) {
        await solflareWallet.adapter.disconnect()
      }

      await solflareWallet.adapter.connect()
    } catch (error) {
      console.error('Failed to connect to Solflare:', error)
      throw error
    }
  }, [select, wallets, wallet, connected, disconnect])

  return {
    wallet,
    publicKey,
    connecting,
    connected,
    disconnecting,
    connect,
    connectSolflare,
    disconnect,
    select,
    sendTransaction,
    signTransaction,
    signAllTransactions,
    getBalance,
    sendAndConfirmTransaction,
    connection,
  }
}
