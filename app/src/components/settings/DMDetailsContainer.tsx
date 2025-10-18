import React, { useEffect, useState } from "react";
import styled from "styled-components";
import type { ActiveChat } from "../../types/Common";
import { ClientApiDataSource } from "../../api/dataSource/clientApiDataSource";

const Wrapper = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const AccountSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AccountName = styled.div`
  color: #fff;
  font-family: Helvetica Neue;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%;
`;

const PublicKeyLabel = styled.div`
  color: #888;
  font-family: Helvetica Neue;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  margin-bottom: 0.25rem;
`;

const NetworkInfo = styled.div`
  color: #666;
  font-family: Helvetica Neue;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  margin-bottom: 0.5rem;
`;

const SetupMessage = styled.div`
  color: #ffa500;
  font-family: Helvetica Neue;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  text-align: center;
  padding: 1rem;
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid rgba(255, 165, 0, 0.3);
  border-radius: 6px;
  margin-top: 1rem;
`;

const NotifyMessage = styled.div`
  color: #ffa500;
  font-family: Helvetica Neue;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  text-align: center;
  padding: 1rem;
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid rgba(255, 165, 0, 0.3);
  border-radius: 6px;
  margin-top: 1rem;
`;

const PublicKeyValue = styled.div`
  color: #fff;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  background: #1a1a1a;
  padding: 0.5rem;
  border-radius: 4px;
  word-break: break-all;
  border: 1px solid #333;
`;

const PaymentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.div`
  color: #fff;
  font-family: Helvetica Neue;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AmountInput = styled.input`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 0.75rem;
  color: #fff;
  font-family: Helvetica Neue;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  
  &::placeholder {
    color: #666;
  }
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'warning' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  border: none;
  font-family: Helvetica Neue;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 120px;
  
  ${props => {
    if (props.disabled) {
      return `
        background: #333;
        color: #666;
        cursor: not-allowed;
      `;
    }
    
    switch (props.variant) {
      case 'primary':
        return `
          background: #4CAF50;
          color: #fff;
          &:hover {
            background: #45a049;
          }
        `;
      case 'secondary':
        return `
          background: #2196F3;
          color: #fff;
          &:hover {
            background: #1976D2;
          }
        `;
      case 'warning':
        return `
          background: #FF9800;
          color: #fff;
          &:hover {
            background: #F57C00;
          }
        `;
      default:
        return `
          background: #4CAF50;
          color: #fff;
          &:hover {
            background: #45a049;
          }
        `;
    }
  }}
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-family: Helvetica Neue;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  margin-top: 0.25rem;
`;

const BellIcon = styled.span`
  margin-right: 0.5rem;
  font-size: 16px;
`;

interface DetailsContainerProps {
  channelName: string;
  chat: ActiveChat;
}

const DMDetailsContainer: React.FC<DetailsContainerProps> = (props) => {
  const [receiverCryptoKey, setReceiverCryptoKey] = useState<string | null>(null);
  const [executorCryptoKey, setExecutorCryptoKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const channelName = props.channelName;
  const receiverAccount = props.chat.account ?? "";

  useEffect(() => {
    const fetchCryptoKeys = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const clientApi = new ClientApiDataSource();
        
        // Get receiver's crypto key
        const receiverResponse = await clientApi.getUserCryptoKey({
          user_id: receiverAccount,
        });
        
        if (receiverResponse.data) {
          setReceiverCryptoKey(receiverResponse.data);
        } else {
          setReceiverCryptoKey(null);
        }
        
        // Get executor's (current user's) crypto key
        // For now, we'll mock this - in real implementation, you'd get current user's ID
        const executorResponse = await clientApi.getUserCryptoKey({
          user_id: "current_user_id", // This should be replaced with actual current user ID
        });
        
        if (executorResponse.data) {
          setExecutorCryptoKey(executorResponse.data);
        } else {
          setExecutorCryptoKey(null);
        }
        
      } catch (err) {
        setError("Failed to fetch crypto keys");
        console.error("Error fetching crypto keys:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCryptoKeys();
  }, [receiverAccount]);

  const handleRequestPayment = () => {
    // Mock implementation - will be implemented in next iteration
    console.log("Request payment:", { amount, receiver: receiverAccount });
    alert(`Request payment of ${amount} ETH to ${channelName} (Mock)`);
  };

  const handleSendPayment = () => {
    // Mock implementation - will be implemented in next iteration
    console.log("Send payment:", { amount, receiver: receiverAccount });
    alert(`Send payment of ${amount} ETH to ${channelName} (Mock)`);
  };

  const handleNotifyUser = () => {
    // Mock implementation - will be implemented in next iteration
    console.log("Notify user to setup wallet:", receiverAccount);
    alert(`Notifying ${channelName} to setup their wallet (Mock)`);
  };

  const formatPublicKey = (key: string | null) => {
    if (!key) return "Not set";
    return `${key.slice(0, 6)}...${key.slice(-6)}`;
  };

  const canRequestPayment = executorCryptoKey !== null;
  const canSendPayment = executorCryptoKey !== null && receiverCryptoKey !== null;
  const shouldShowNotifyButton = executorCryptoKey !== null && receiverCryptoKey === null;

  if (isLoading) {
    return (
      <Wrapper>
        <div style={{ color: '#fff', textAlign: 'center' }}>Loading...</div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <AccountSection>
        <AccountName>{channelName}</AccountName>
        <PublicKeyLabel>Ethereum Public Key:</PublicKeyLabel>
        <NetworkInfo>Network: Sepolia</NetworkInfo>
        <PublicKeyValue>
          {receiverCryptoKey ? formatPublicKey(receiverCryptoKey) : "Not set"}
        </PublicKeyValue>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </AccountSection>

      <PaymentSection>
        <SectionTitle>Payment</SectionTitle>
        <InputGroup>
          <AmountInput
            type="text"
            placeholder="Enter amount in Ethereum"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={!canRequestPayment && !canSendPayment}
          />
        </InputGroup>
        
        <ButtonGroup>
          <Button
            variant="primary"
            onClick={handleRequestPayment}
            disabled={!canRequestPayment}
          >
            Request Payment
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleSendPayment}
            disabled={!canSendPayment}
          >
            Send Payment
          </Button>
          
          {shouldShowNotifyButton && (
            <Button
              variant="warning"
              onClick={handleNotifyUser}
            >
              <BellIcon>🔔</BellIcon>
              Notify User to Setup Crypto Key
            </Button>
          )}
        </ButtonGroup>

        {/* Setup message when user doesn't have their own crypto key */}
        {!canRequestPayment && (
          <SetupMessage>
            Setup your Ethereum public key in General Settings to send and request crypto payments.
          </SetupMessage>
        )}

        {/* Notify message when user has key but receiver doesn't */}
        {canRequestPayment && !canSendPayment && !shouldShowNotifyButton && (
          <NotifyMessage>
            This user hasn't set up their Ethereum public key yet. They need to configure it to receive crypto payments.
          </NotifyMessage>
        )}
      </PaymentSection>
    </Wrapper>
  );
};

export default DMDetailsContainer;
