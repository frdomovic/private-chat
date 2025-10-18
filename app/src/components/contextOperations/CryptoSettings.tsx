import { useEffect, useState } from "react";
import styled from "styled-components";
import { UserButton, useUser } from "@civic/auth-web3/react";
import { useAccount, useChainId, useBalance, useSwitchChain, useDisconnect } from "wagmi";
import { ClientApiDataSource } from "../../api/dataSource/clientApiDataSource";
import { getExecutorPublicKey } from "@calimero-network/calimero-client";
import { sepolia } from "wagmi/chains";

const Container = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 1rem;
    max-width: 100%;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  color: #fff;
  font-family: Helvetica Neue;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const InfoCard = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.75rem;
  }
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  overflow: hidden;
`;

const Label = styled.div`
  color: #888;
  font-family: Helvetica Neue;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
`;

const Value = styled.div`
  color: #fff;
  font-family: Helvetica Neue;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
  word-break: break-all;
  overflow-wrap: break-word;
  hyphens: auto;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const PublicKeyValue = styled.div`
  color: #fff;
  font-family: "Courier New", monospace;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  background: #0a0a0a;
  padding: 0.75rem;
  border-radius: 4px;
  word-break: break-all;
  overflow-wrap: break-word;
  border: 1px solid #333;
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;

  @media (max-width: 768px) {
    font-size: 10px;
    padding: 0.5rem;
    line-height: 1.3;
  }
`;

const BalanceValue = styled.div`
  color: #a5ff11;
  font-family: Helvetica Neue;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%;
  word-break: break-all;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const NetworkInfo = styled.div`
  color: #666;
  font-family: Helvetica Neue;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
`;

const CivicSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.75rem;
  }
`;

const CivicTitle = styled.h3`
  color: #fff;
  font-family: Helvetica Neue;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const LoadingText = styled.div`
  color: #888;
  font-family: Helvetica Neue;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  text-align: center;
  padding: 1rem;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 0.5rem;
  }
`;

const ErrorText = styled.div`
  color: #ff6b6b;
  font-family: Helvetica Neue;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  text-align: center;
  padding: 1rem;
  word-break: break-word;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 0.5rem;
  }
`;

const SuccessText = styled.div`
  color: #4caf50;
  font-family: Helvetica Neue;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  text-align: center;
  padding: 1rem;
  word-break: break-word;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 0.5rem;
  }
`;

const LoadingCryptoKey = styled.div`
  color: #ffa500;
  font-family: Helvetica Neue;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  text-align: center;
  padding: 1rem;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 0.5rem;
  }
`;

const StyledUserButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  /* Style the UserButton component */
  & > * {
    background: #a5ff11 !important;
    color: #fff !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 0.75rem 1.5rem !important;
    font-family: Helvetica Neue !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    line-height: 120% !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    min-width: 120px !important;
    text-align: center !important;

    &:hover {
      background: #adff26 !important;
      transform: translateY(-1px) !important;
    }

    &:active {
      transform: translateY(0) !important;
    }

    &:focus {
      outline: none !important;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3) !important;
    }

    @media (max-width: 768px) {
      padding: 0.625rem 1.25rem !important;
      font-size: 13px !important;
      min-width: 100px !important;
    }
  }
`;

const SwitchChainButton = styled.button`
  background: #ff9800;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-family: Helvetica Neue;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;

  &:hover {
    background: #f57c00;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #333;
    color: #666;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 0.4rem 0.8rem;
  }
`;

const ChainWarning = styled.div`
  background: rgba(255, 152, 0, 0.1);
  border: 1px solid rgba(255, 152, 0, 0.3);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const ChainWarningText = styled.div`
  color: #ff9800;
  font-family: Helvetica Neue;
  font-size: 14px;
  font-weight: 400;
  line-height: 140%;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

// Helper function to format balance
const formatBalance = (
  balance: { formatted: string; symbol: string } | undefined
) => {
  if (!balance) return "0.00 SepoliaETH";
  const formatted = parseFloat(balance.formatted).toFixed(4);
  return `${formatted} SepoliaETH`;
};

export default function CryptoSettings() {
  const [username, setUsername] = useState<string>("");
  const [evmPublicKey, setEvmPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSettingCryptoKey, setIsSettingCryptoKey] = useState<boolean>(false);
  const [cryptoKeyMessage, setCryptoKeyMessage] = useState<string | null>(null);

  // Civic and Wagmi hooks
  const userContext = useUser();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const { disconnect } = useDisconnect();

  const balance = useBalance({
    address: address,
  });

  // Check if user is on Sepolia
  const isOnSepolia = chainId === sepolia.id;

  // Debug logging
  useEffect(() => {
    console.log("Wallet Debug:", {
      address,
      isConnected,
      chainId,
      isOnSepolia,
      userContext: !!userContext.user
    });
  }, [address, isConnected, chainId, isOnSepolia, userContext.user]);

  // Function to switch to Sepolia chain
  const handleSwitchToSepolia = async () => {
    try {
      await switchChain({ chainId: sepolia.id });
    } catch (err) {
      console.error("Error switching to Sepolia:", err);
    }
  };

  // Function to set user crypto key
  const setUserCryptoKey = async (walletAddress: string) => {
    if (!walletAddress) return;

    setIsSettingCryptoKey(true);
    setCryptoKeyMessage(null);

    try {
      const executorId = getExecutorPublicKey();
      if (!executorId) {
        setCryptoKeyMessage("No executor public key found");
        return;
      }

      const clientApi = new ClientApiDataSource();
      const response = await clientApi.setUserCryptoKey({
        user_id: executorId,
        address: walletAddress,
      });

      if (response.data) {
        setEvmPublicKey(walletAddress);
        setCryptoKeyMessage("EVM public key set successfully!");
        // Clear success message after 3 seconds
        setTimeout(() => setCryptoKeyMessage(null), 3000);
      } else {
        setCryptoKeyMessage("Failed to set EVM public key");
      }
    } catch (err) {
      console.error("Error setting crypto key:", err);
      setCryptoKeyMessage("Error setting EVM public key");
    } finally {
      setIsSettingCryptoKey(false);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const executorId = getExecutorPublicKey();
        if (!executorId) {
          setError("No executor public key found");
          return;
        }

        const clientApi = new ClientApiDataSource();

        // Get username
        const usernameResponse = await clientApi.getUsername({
          user_id: executorId,
        });

        if (usernameResponse.data) {
          setUsername(usernameResponse.data);
        } else {
          setError("Failed to fetch username");
        }

        // Get EVM public key
        const cryptoKeyResponse = await clientApi.getUserCryptoKey({
          user_id: executorId,
        });

        if (cryptoKeyResponse.data) {
          setEvmPublicKey(cryptoKeyResponse.data);
        } else {
          setEvmPublicKey(null);
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to fetch user information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // Auto-set crypto key when user has address but no EVM public key
  useEffect(() => {
    if (address && !evmPublicKey && !isLoading && !isSettingCryptoKey) {
      setUserCryptoKey(address);
    }
  }, [address, evmPublicKey, isLoading, isSettingCryptoKey]);

  // Handle logout - clear balance and address when user disconnects from Civic
  useEffect(() => {
    if (!userContext.user) {
      // User logged out from Civic - clear any crypto key messages and disconnect wallet
      setCryptoKeyMessage(null);
      setIsSettingCryptoKey(false);
      
      // Disconnect wallet when user logs out from Civic
      if (address) {
        try {
          disconnect();
        } catch (err) {
          console.error("Error disconnecting wallet:", err);
        }
      }
    }
  }, [userContext.user, address, disconnect]);

  // Refresh user info when user logs back in to Civic
  useEffect(() => {
    if (userContext.user && !isLoading) {
      // User logged back in to Civic - refresh user info
      const refreshUserInfo = async () => {
        try {
          const executorId = getExecutorPublicKey();
          if (!executorId) return;

          const clientApi = new ClientApiDataSource();

          // Refresh username
          const usernameResponse = await clientApi.getUsername({
            user_id: executorId,
          });

          if (usernameResponse.data) {
            setUsername(usernameResponse.data);
          }

          // Refresh EVM public key
          const cryptoKeyResponse = await clientApi.getUserCryptoKey({
            user_id: executorId,
          });

          if (cryptoKeyResponse.data) {
            setEvmPublicKey(cryptoKeyResponse.data);
          } else {
            setEvmPublicKey(null);
          }
        } catch (err) {
          console.error("Error refreshing user info:", err);
        }
      };

      refreshUserInfo();
    }
  }, [userContext.user, isLoading]);

  if (isLoading) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: "100vw",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <Container>
          <SectionTitle>Crypto Settings</SectionTitle>
          <LoadingText>Loading user information...</LoadingText>
        </Container>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100vw",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Container>
        <SectionTitle>Crypto Settings</SectionTitle>

        {/* User Information Section */}
        <Section>
          <InfoCard>
            <InfoRow>
              <Label>Username</Label>
              <Value>{username || "Not available"}</Value>
            </InfoRow>

            <InfoRow>
              <Label>EVM Public Key</Label>
              {isSettingCryptoKey ? (
                <Value style={{ color: "#ffa500" }}>
                  Setting EVM public key...
                </Value>
              ) : evmPublicKey ? (
                <PublicKeyValue>{evmPublicKey}</PublicKeyValue>
              ) : (
                <Value style={{ color: "#ff6b6b" }}>Not set</Value>
              )}
            </InfoRow>

            <InfoRow>
              <Label>Network</Label>
              <NetworkInfo>Sepolia Testnet</NetworkInfo>
            </InfoRow>
          </InfoCard>
        </Section>

        {/* Civic Integration Section */}
        <Section>
          <CivicSection>
            <CivicTitle>Wallet Connection</CivicTitle>

            {/* Show chain warning if user is connected but not on Sepolia */}
            {userContext.user && address && !isOnSepolia && (
              <ChainWarning>
                <ChainWarningText>
                  ⚠️ Please switch to Sepolia Testnet to use crypto features
                </ChainWarningText>
                <SwitchChainButton 
                  onClick={handleSwitchToSepolia}
                  disabled={isSwitchingChain}
                >
                  {isSwitchingChain ? "Switching..." : "Switch to Sepolia"}
                </SwitchChainButton>
              </ChainWarning>
            )}

            {/* Always show login button centered */}
            <StyledUserButton style={{ marginBottom: "1rem" }}>
              <UserButton />
            </StyledUserButton>

            {/* Only show other elements when user is logged in */}
            {userContext.user && (
              <>
                {balance.data && isOnSepolia && (
                  <InfoRow>
                    <Label>Wallet Balance</Label>
                    <BalanceValue>{formatBalance(balance.data)}</BalanceValue>
                  </InfoRow>
                )}

                <InfoRow>
                  <Label>Connected Address</Label>
                  <PublicKeyValue>
                    {address ? address : isConnected ? "Connected but address not available" : "Not connected"}
                  </PublicKeyValue>
                </InfoRow>

                <InfoRow>
                  <Label>Network</Label>
                  <Value>
                    {isOnSepolia ? "Sepolia Testnet" : `Chain ID: ${chainId || "Not available"}`}
                  </Value>
                </InfoRow>

                {/* Debug info - remove this later */}
                <InfoRow>
                  <Label>Debug Info</Label>
                  <Value style={{ fontSize: '12px', color: '#888' }}>
                    Connected: {isConnected ? 'Yes' : 'No'} | Address: {address ? 'Available' : 'Not Available'}
                  </Value>
                </InfoRow>
              </>
            )}

            {/* Show message when not logged in */}
            {!userContext.user && (
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <p style={{ color: "#888", margin: 0 }}>
                  Connect your wallet to manage crypto settings
                </p>
              </div>
            )}
          </CivicSection>
        </Section>

        {error && <ErrorText>{error}</ErrorText>}

        {isSettingCryptoKey && (
          <LoadingCryptoKey>Setting your EVM public key...</LoadingCryptoKey>
        )}

        {cryptoKeyMessage && <SuccessText>{cryptoKeyMessage}</SuccessText>}
      </Container>
    </div>
  );
}
