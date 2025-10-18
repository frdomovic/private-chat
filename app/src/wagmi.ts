import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected({
      target: 'metaMask',
    }),
    coinbaseWallet({
      appName: 'Calimero Chat',
    }),
    walletConnect({ 
      projectId: import.meta.env.VITE_WC_PROJECT_ID,
      metadata: {
        name: 'Calimero Chat',
        description: 'Private chat application with crypto payments',
        url: window.location.origin,
        icons: ['https://calimero.network/favicon.ico']
      }
    }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
  ssr: false,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
