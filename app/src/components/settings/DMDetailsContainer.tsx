import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useUser } from "@civic/auth-web3/react";
import type { ActiveChat } from "../../types/Common";
import { ClientApiDataSource } from "../../api/dataSource/clientApiDataSource";
import { getExecutorPublicKey } from "@calimero-network/calimero-client";
import { extractAndAddMentions } from "../../utils/mentions";
import type { UserId } from "../../api/clientApi";
import {
  useSendTransaction,
  useWaitForTransactionReceipt,
  useChainId,
} from 'wagmi';
import { parseEther } from 'viem';
import { sepolia } from 'wagmi/chains';

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
  font-size: 14px;
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
  font-size: 14px;
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
  font-size: 14px;
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
  font-size: 14px;
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
  padding: 0.5rem;
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
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  border: none;
  font-family: Helvetica Neue;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 80px;
  
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

const NotifyButton = styled.button`
  background: #FF9800;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.375rem;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  
  &:hover {
    background: #F57C00;
  }
  
  &:disabled {
    background: #333;
    color: #666;
    cursor: not-allowed;
  }
`;

const NotifyText = styled.div`
  color: #888;
  font-family: Helvetica Neue;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
`;

const NotifyContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const NetworkWarning = styled.div`
  background: rgba(255, 152, 0, 0.1);
  border: 1px solid rgba(255, 152, 0, 0.3);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const NetworkWarningText = styled.div`
  color: #ff9800;
  font-family: Helvetica Neue;
  font-size: 14px;
  font-weight: 400;
  line-height: 140%;
`;

interface DetailsContainerProps {
  channelName: string;
  chat: ActiveChat;
  onClose?: () => void;
  chatMembers?: Map<string, string>;
}

const DMDetailsContainer: React.FC<DetailsContainerProps> = (props) => {
  const { channelName, chat, onClose, chatMembers } = props;
  const [receiverCryptoKey, setReceiverCryptoKey] = useState<string | null>(null);
  const [executorCryptoKey, setExecutorCryptoKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean>(false);
  const [messageSent, setMessageSent] = useState<boolean>(false);
  const { sendTransaction, data: hash, error: sendError, isPending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const chainId = useChainId();
  
  // Civic user context
  const userContext = useUser();
  
  // Check if user is on Sepolia
  const isOnSepolia = chainId === sepolia.id;
  
  const receiverAccount = chat.name ?? "";

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
        const executorId = getExecutorPublicKey();
        if (executorId) {
          const executorResponse = await clientApi.getUserCryptoKey({
            user_id: executorId,
          });
          
          if (executorResponse.data) {
            setExecutorCryptoKey(executorResponse.data);
          } else {
            setExecutorCryptoKey(null);
          }
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

  // Handle transaction success/error
  useEffect(() => {
    if (isSuccess && hash) {
      setTransactionSuccess(true);
      setTransactionError(null);
    }
  }, [isSuccess, hash]);

  useEffect(() => {
    if (sendError) {
      setTransactionError(sendError.message || "Transaction failed");
      setTransactionSuccess(false);
    }
  }, [sendError]);

  const sendFinancialMessage = useCallback(async (message: string, isSending = false) => {
    setIsSendingMessage(true);
    setError(null);
    
    try {
      const isDM = chat.type === "direct_message";
      const membersList = chatMembers || new Map<string, string>();
      
      const result = extractAndAddMentions(message, membersList);
      const mentions: UserId[] = [...result.userIdMentions];
      const usernames: string[] = [...result.usernameMentions];

      await new ClientApiDataSource().sendMessage({
        group: {
          name: isDM ? "private_dm" : chat.name ?? "",
        },
        message,
        mentions,
        usernames,
        timestamp: Math.floor(Date.now() / 1000),
        is_dm: isDM,
        dm_identity: chat.account,
        parent_message: undefined,
        is_financial: true,
      });

      if (isSending) {
        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 1500);
      }

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Error sending financial message:", err);
      setError("Failed to send message");
    } finally {
      setIsSendingMessage(false);
    }
  }, [chat.type, chat.name, chat.account, chatMembers, onClose]);

  const handleRequestPayment = async () => {
    if (!amount.trim()) {
      setError("Please enter an amount");
      return;
    }
    
    const message = `💰 Requesting ${amount} SepoliaETH from ${channelName}`;
    await sendFinancialMessage(message);
  };

  const handleSendPayment = async () => {
    if (!amount.trim()) {
      setError("Please enter an amount");
      return;
    }
    
    // Check if user is on Sepolia network
    if (!isOnSepolia) {
      setTransactionError("Please switch to Sepolia Testnet to send transactions");
      return;
    }
    
    setTransactionError(null);
    setTransactionSuccess(false);
    setMessageSent(false);
    
    try {
      await sendTransaction({
        to: receiverCryptoKey as `0x${string}`,
        value: parseEther(amount),
        chainId: sepolia.id, // Explicitly specify Sepolia chain ID
      });
    } catch (err) {
      console.error("Transaction error:", err);
      setTransactionError("Transaction failed. Please try again.");
    }
  };

  // Handle sending message after successful transaction
  useEffect(() => {
    if (isSuccess && hash && transactionSuccess && !messageSent) {
      setMessageSent(true);
      const message = `✅ Ethereum sent successfully! ${amount} SepoliaETH sent to ${channelName}\nTransaction: ${hash}`;
      sendFinancialMessage(message, true);
    }
  }, [isSuccess, hash, transactionSuccess, messageSent, amount, channelName, sendFinancialMessage]);

  const handleNotifyUser = async () => {
    const message = `🔔 Please setup your Ethereum public key in General Settings to receive crypto payments`;
    await sendFinancialMessage(message);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    // Clear transaction states when amount changes
    setTransactionError(null);
    setTransactionSuccess(false);
    setMessageSent(false);
  };

  const formatPublicKey = (key: string | null) => {
    if (!key) return "Not set";
    return `${key.slice(0, 6)}...${key.slice(-6)}`;
  };

  const canRequestPayment = userContext.user && executorCryptoKey !== null;
  const canSendPayment = userContext.user && executorCryptoKey !== null && receiverCryptoKey !== null && isOnSepolia;
  const shouldShowNotifyButton = userContext.user && executorCryptoKey !== null && receiverCryptoKey === null;

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
        
        {/* Network warning if not on Sepolia */}
        {userContext.user && !isOnSepolia && (
          <NetworkWarning>
            <NetworkWarningText>
              ⚠️ Please switch to Sepolia Testnet to send crypto payments
            </NetworkWarningText>
          </NetworkWarning>
        )}
        
        <InputGroup>
          <AmountInput
            type="text"
            placeholder="Enter amount in Ethereum"
            value={amount}
            onChange={handleAmountChange}
            disabled={!canRequestPayment && !canSendPayment}
          />
          {transactionError && (
            <ErrorMessage>{transactionError}</ErrorMessage>
          )}
          {transactionSuccess && (
            <div style={{ color: '#4CAF50', fontSize: '12px', marginTop: '0.25rem' }}>
              ✅ Transaction successful!
            </div>
          )}
        </InputGroup>
        
        <ButtonGroup>
          <Button
            variant="primary"
            onClick={handleRequestPayment}
            disabled={!canRequestPayment || isSendingMessage}
          >
            {isSendingMessage ? "Sending..." : "Request Payment"}
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleSendPayment}
            disabled={!canSendPayment || isSendingMessage || isPending || isConfirming}
          >
            {!isOnSepolia ? "Switch to Sepolia" : isPending ? "Confirming..." : isConfirming ? "Confirming..." : isSendingMessage ? "Sending..." : "Send Payment"}
          </Button>
        </ButtonGroup>
        
        {shouldShowNotifyButton && (
          <NotifyContainer>
            <NotifyButton 
              onClick={handleNotifyUser}
              disabled={isSendingMessage}
            >
              {isSendingMessage ? "⏳" : "🔔"}
            </NotifyButton>
            <NotifyText>
              {isSendingMessage ? "Sending notification..." : "Notify user to setup crypto key"}
            </NotifyText>
          </NotifyContainer>
        )}

        {/* Setup message when user doesn't have their own crypto key or isn't logged in */}
        {!canRequestPayment && (
          <SetupMessage>
            {!userContext.user 
              ? "Please log in with Civic and setup your Ethereum public key in General Settings to send and request crypto payments."
              : "Setup your Ethereum public key in General Settings to send and request crypto payments."
            }
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
