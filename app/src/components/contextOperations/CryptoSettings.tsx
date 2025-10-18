import { useEffect, useState } from "react";
import { UserButton, useUser } from "@civic/auth-web3/react";
import { useAccount, useChainId, useBalance, useSwitchChain, useDisconnect } from "wagmi";
import { ClientApiDataSource } from "../../api/dataSource/clientApiDataSource";
import { getExecutorPublicKey } from "@calimero-network/calimero-client";
import { sepolia } from "wagmi/chains";
import { BalanceValue, ChainWarning, ChainWarningText, CivicSection, CivicTitle, Container, ErrorText, formatBalance, InfoCard, InfoRow, Label, LoadingCryptoKey, LoadingText, NetworkInfo, PublicKeyValue, Section, SectionTitle, StyledUserButton, SuccessText, SwitchChainButton, Value } from "./CryptoComponents";

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
              <Label>EVM Address</Label>
              {isSettingCryptoKey ? (
                <Value style={{ color: "#ffa500" }}>
                  Setting EVM address...
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
          <LoadingCryptoKey>Setting your EVM address...</LoadingCryptoKey>
        )}

        {cryptoKeyMessage && <SuccessText>{cryptoKeyMessage}</SuccessText>}
      </Container>
    </div>
  );
}
