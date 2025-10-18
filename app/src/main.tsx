import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AppMode, CalimeroProvider } from "@calimero-network/calimero-client";
import { APPLICATION_ID, APPLICATION_PATH } from "./constants/config.ts";
import { config } from "./wagmi.ts";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Buffer } from "buffer";
import { CivicAuthProvider} from '@civic/auth-web3/react';
import { sepolia } from "viem/chains";

globalThis.Buffer = Buffer;

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((_registration) => {})
      .catch((_registrationError) => {});
  });
}

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
if (!CLIENT_ID) throw new Error('CLIENT_ID is required');
const AUTH_SERVER = import.meta.env.VITE_AUTH_SERVER;
const WALLET_API_BASE_URL = import.meta.env.VITE_WALLET_API_BASE_URL;


const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>

        <CivicAuthProvider 
            clientId={CLIENT_ID} 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            initialChain={sepolia as any}
            // oauthServer and wallet are not necessary for production.
            config={{ 
              oauthServer: AUTH_SERVER || 'https://auth.civic.com/oauth'
            }}
            endpoints={{ wallet: WALLET_API_BASE_URL }}
            >
               <CalimeroProvider
            clientApplicationId={APPLICATION_ID}
            mode={AppMode.MultiContext}
            applicationPath={APPLICATION_PATH}
          >
            <App />
          </CalimeroProvider>
            </CivicAuthProvider>
         
        </QueryClientProvider>
      </WagmiProvider>
    </BrowserRouter>
  </StrictMode>
);
