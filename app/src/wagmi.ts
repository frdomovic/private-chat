import { embeddedWallet } from '@civic/auth-web3/wagmi'
import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [sepolia],
  connectors: [embeddedWallet()],
  transports: {
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
