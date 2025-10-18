import { useState } from "react";
import styled from "styled-components";

import { TabPanel, Tabs } from "@calimero-network/mero-ui";
import JoinContextTab from "./JoinContextTab";
import CreateIdentityTab from "./CreateIdentityTab";
import InviteToContextTab from "./InviteToContextTab";
import NotificationSettings from "../settings/NotificationSettings";
import ChatTab from "./ChatTab";
import CryptoSettings from "./CryptoSettings";

const TabsWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #333 transparent;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  min-width: max-content;
  width: 100%;
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    padding: 0 0.5rem;
  }
`;

interface TabbedInterfaceProps {
  tabs: { id: string; label: string }[];
  isAuthenticated?: boolean;
  isConfigSet?: boolean;
}

export default function TabbedInterface({ tabs, isAuthenticated, isConfigSet }: TabbedInterfaceProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  

  return (
    <>
      <TabsWrapper>
        <TabsContainer>
          <Tabs 
            tabs={tabs} 
            value={activeTab} 
            onValueChange={setActiveTab} 
            style={{ 
              justifyContent: "center", 
              display: "flex",
              minWidth: "max-content",
              width: "100%"
            }} 
          />
        </TabsContainer>
      </TabsWrapper>
      
      <TabPanel when="join-context" active={activeTab}>
        <JoinContextTab />
      </TabPanel>
      <TabPanel when="invite-to-context" active={activeTab}>
        <InviteToContextTab />
      </TabPanel>
      <TabPanel when="create-identity" active={activeTab}>
        <CreateIdentityTab />
      </TabPanel>
      <TabPanel when="notification-settings" active={activeTab}>
        <NotificationSettings />
      </TabPanel>
      <TabPanel when="chat" active={activeTab}>
        <ChatTab isAuthenticated={isAuthenticated || false} isConfigSet={isConfigSet || false} />
      </TabPanel>
      <TabPanel when="crypto-settings" active={activeTab}>
        <CryptoSettings />
      </TabPanel>
    </>
  );
}
