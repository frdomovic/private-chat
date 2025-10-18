import React from "react";
import type { ActiveChat } from "../../types/Common";
import BaseModal from "../common/popups/BaseModal";
import DMDetailsContainer from "../settings/DMDetailsContainer";

interface ChannelDetailsPopupProps {
  toggle: React.ReactNode;
  chat: ActiveChat;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function DMDetailsPopup({
  chat,
  toggle,
  isOpen,
  setIsOpen,
}: ChannelDetailsPopupProps) {

  const popupContent = (
    <DMDetailsContainer
      channelName={chat.username ?? ""}
      chat={chat}
    />
  );

  return (
    <BaseModal
      toggle={toggle}
      content={popupContent}
      open={isOpen}
      onOpenChange={setIsOpen}
    />
  );
}
