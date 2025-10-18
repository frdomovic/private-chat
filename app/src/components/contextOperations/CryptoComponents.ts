import { styled } from "styled-components";

export const Container = styled.div`
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

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SectionTitle = styled.h2`
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

export const InfoCard = styled.div`
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

export const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  overflow: hidden;
`;

export const Label = styled.div`
  color: #888;
  font-family: Helvetica Neue;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
`;

export const Value = styled.div`
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

export const PublicKeyValue = styled.div`
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

export const BalanceValue = styled.div`
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

export const NetworkInfo = styled.div`
  color: #666;
  font-family: Helvetica Neue;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
`;

export const CivicSection = styled.div`
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

export const CivicTitle = styled.h3`
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

export const LoadingText = styled.div`
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

export const ErrorText = styled.div`
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

export const SuccessText = styled.div`
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

export const LoadingCryptoKey = styled.div`
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

export const StyledUserButton = styled.div`
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

export const SwitchChainButton = styled.button`
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

export const ChainWarning = styled.div`
  background: rgba(255, 152, 0, 0.1);
  border: 1px solid rgba(255, 152, 0, 0.3);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: center;
`;

export const ChainWarningText = styled.div`
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
export const formatBalance = (
  balance: { formatted: string; symbol: string } | undefined
) => {
  if (!balance) return "0.00 SepoliaETH";
  const formatted = parseFloat(balance.formatted).toFixed(4);
  return `${formatted} SepoliaETH`;
};
