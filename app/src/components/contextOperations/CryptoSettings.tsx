import { useEffect, useState } from "react";
import { UserButton, useUser } from "@civic/auth-web3/react";
import { useAccount, useChainId, useBalance, useConnect, useDisconnect } from "wagmi";
import { ClientApiDataSource } from "../../api/dataSource/clientApiDataSource";
import { getExecutorPublicKey } from "@calimero-network/calimero-client";
import { sepolia } from "wagmi/chains";
import {
  BalanceValue,
  CivicSection,
  CivicTitle,
  Container,
  ErrorText,
  formatBalance,
  InfoCard,
  InfoRow,
  Label,
  LoadingCryptoKey,
  LoadingText,
  NetworkInfo,
  PublicKeyValue,
  Section,
  SectionTitle,
  StyledUserButton,
  SuccessText,
  Value,
} from "./CryptoComponents";
import { useAutoConnect } from "@civic/auth-web3/wagmi";
import { userHasWallet } from "@civic/auth-web3";
import { Button } from "@calimero-network/mero-ui";

export default function CryptoSettings() {
  const [username, setUsername] = useState<string>("");
  const [evmPublicKey, setEvmPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSettingCryptoKey, _setIsSettingCryptoKey] = useState<boolean>(false);
  const [cryptoKeyMessage, _setCryptoKeyMessage] = useState<string | null>(null);

  // Civic and Wagmi hooks
  const userContext = useUser();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  useAutoConnect();
  const balance = useBalance({
    address: address,
  });

  // Check if user is on Sepolia
  const isOnSepolia = chainId === sepolia.id;

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

  // A function to connect an existing civic embedded wallet
  const connectExistingWallet = () => {
    return connect({
      connector: connectors?.[0],
    });
  };

  const [_isCreatingWallet, setIsCreatingWallet] = useState<boolean>(false);

  // A function that creates the wallet if the user doesn't have one already
  const createWallet = async () => {
    setIsCreatingWallet(true);
    if (userContext.user && !userHasWallet(userContext)) {
      // Once the wallet is created, we can connect it straight away
      return userContext.createWallet().then(connectExistingWallet);
    }
    setIsCreatingWallet(false);
  };

  const [isSavingNewAddress, setIsSavingNewAddress] = useState<boolean>(false);

  const saveNewAddress = async (address: string) => {
    setIsSavingNewAddress(true);
    try {
      const response = await new ClientApiDataSource().setUserCryptoKey({
        user_id: getExecutorPublicKey() ?? "",
        address: address,
      });
      if (response.data === null) {
        setEvmPublicKey(address);
      } else {
        setError("Failed to save new address");
      }
    } catch (err) {
      console.error("Error saving new address:", err);
    } finally {
      setIsSavingNewAddress(false);
    }
  };

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
            {/* Always show login button centered */}
            <StyledUserButton style={{ marginBottom: "1rem" }}>
              <UserButton onSignOut={() => {
                userContext.signOut();
                disconnect();
              }}/>
            </StyledUserButton>

            {userContext.user && !userHasWallet(userContext) && (
              <StyledUserButton onClick={createWallet}>
                Create Wallet
              </StyledUserButton>
            )}

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
                    {address
                      ? address
                      : isConnected
                        ? "Connected but address not available"
                        : "Not connected"}
                  </PublicKeyValue>
                  {address && (
                    <div onClick={() => saveNewAddress(address)}>
                      <Button variant="secondary" disabled={isSavingNewAddress}>
                        {isSavingNewAddress ? "Saving..." : "Save New Address"}
                      </Button>
                    </div>
                  )}
                </InfoRow>

                <InfoRow>
                  <Label>Network</Label>
                  <Value>
                    {isOnSepolia
                      ? "Sepolia Testnet"
                      : `Chain ID: ${chainId || "Not available"}`}
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
