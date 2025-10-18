import { styled } from "styled-components";
import Loader from "../loader/Loader";
import type { ActiveChat } from "../../types/Common";
import { useCallback, useEffect, useState } from "react";
import { ClientApiDataSource } from "../../api/dataSource/clientApiDataSource";
import {
  getExecutorPublicKey,
  type ResponseData,
} from "@calimero-network/calimero-client";
import type { DMChatInfo } from "../../api/clientApi";
import { Button, SearchInput } from "@calimero-network/mero-ui";

const SearchContainer = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  @media (min-width: 1025px) {
    height: 100%;
  }
  @media (max-width: 1024px) {
    padding: 42px 0 0;
    background-color: #0e0e10;
  }
  .inputFieldWrapper {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
    @media (max-width: 1024px) {
      margin-top: 24px;
      padding-left: 16px;
      padding-right: 16px;
    }
  }
  .searchInput {
    width: 100%;
    background-color: #070707;
    border: none;
    outline: 0;
    color: #fff;
    font-family: Helvetica Neue;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    padding: 8px 16px;
    border-radius: 4px;
  }
  .searchIcon {
    fill: #777583;
    position: absolute;
    z-index: 10;
    right: 16px;
    top: 10px;
    cursor: pointer;
    :hover {
      fill: #fff;
    }
    @media (max-width: 1024px) {
      right: 32px;
    }
  }
  .channelListWrapper {
    padding-top: 24px;
    padding-left: 16px;
    padding-right: 16px;
    width: 100%;
    scrollbar-color: black transparent;
    ::-webkit-scrollbar {
      width: 0px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: black;
      border-radius: 6px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background-color: black;
    }
    * {
      scrollbar-color: black transparent;
    }
    html::-webkit-scrollbar {
      width: 12px;
    }
    html::-webkit-scrollbar-thumb {
      background-color: black;
      border-radius: 6px;
    }
    html::-webkit-scrollbar-thumb:hover {
      background-color: black;
    }
    @media (max-width: 1024px) {
      padding-top: 16px;
      overflow: scroll;
      padding-bottom: 16px;
    }
    @media (min-width: 1025px) {
      height: 100%;
      overflow: scroll;
    }
  }
  .listHeader {
    width: 100%;
    color: #777583;
    font-family: Helvetica Neue;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%;
  }
  .list {
    width: 100%;
    padding-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    @media (min-width: 1025px) {
      height: 100%;
    }
    @media (max-width: 1024px) {
      flex: 1;
    }
  }
  .listItem {
    padding: 8px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #141418;
    border-radius: 4px;
  }
  .channelNameText {
    color: #777583;
    font-family: Helvetica Neue;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    padding-left: 6px;
  }
  .creatorText {
    color: #777583;
    font-family: Helvetica Neue;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    padding-left: 4px;
  }
  .listItemOptions {
    display: flex;
    gap: 8px;
    font-family: Helvetica Neue;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
  }
  .viewChannelButton,
  .joinChannelButton {
    padding: 4px 13px;
    border-radius: 4px;
    width: 64px;
    cursor: pointer;
    text-align: center;
  }
  .viewChannelButton {
    color: #777583;
    border: 1px solid #141418;
    :hover {
      color: #fff;
      background-color: #070707;
      border: 1px solid #070707;
    }
  }
  .joinChannelButton {
    color: #fff;
    border: 1px solid #1e1f28;
  }
  .spinnerWrapper {
    margin-top: 4px;
  }
`;

interface SearchChannelsContainerProps {
  onChatSelected: (chat: ActiveChat) => void;
  fetchChannels: () => void;
  createDM: (userId: string) => Promise<{ data: string; error: string }>;
}

export default function SearchChannelsContainer({
  onChatSelected: _onChatSelected,
  fetchChannels: _fetchChannels,
  createDM,
}: SearchChannelsContainerProps) {
  const [availableUsers, setAvailableUsers] = useState<Map<string, string>>(new Map());
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingDM, setIsCreatingDM] = useState<string | null>(null);

  // Filter users based on search input
  const filteredUsers = inputValue
    ? Array.from(availableUsers.entries()).filter(([, username]) => 
        username.toLowerCase().includes(inputValue.toLowerCase())
      )
    : Array.from(availableUsers.entries());

  useEffect(() => {
    const fetchUsersForDM = async () => {
      setIsLoading(true);
      try {
        // Fetch general channel members
        const generalChannelMembers: ResponseData<Map<string, string>> =
          await new ClientApiDataSource().getChannelMembers({
            channel: { name: "general" },
          });

        // Fetch existing DMs
        const dms: ResponseData<DMChatInfo[]> =
          await new ClientApiDataSource().getDms();

        if (generalChannelMembers.data) {
          const generalUsers = generalChannelMembers.data;
          const currentUserId = getExecutorPublicKey();
          
          // Get users who are already in DMs
          const usersInDMs = new Set<string>();

          if (dms.data) {
            dms.data.forEach((dm) => {
              // Add both participants of the DM
              if (dm.own_identity) usersInDMs.add(dm.own_identity);
              if (dm.other_identity_old) usersInDMs.add(dm.other_identity_old);
            });
          }


          // Filter out current user and users already in DMs
          const availableUsersMap = new Map<string, string>();
          for (const [userId, username] of Object.entries(generalUsers)) {
            if (userId !== currentUserId && !usersInDMs.has(userId)) {
              availableUsersMap.set(userId, username);
            }
          }

          setAvailableUsers(availableUsersMap);
        }
      } catch (error) {
        console.error("Error fetching users for DM:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersForDM();
  }, []);

  const handleCreateDM = useCallback(
    async (userId: string) => {
      setIsCreatingDM(userId);
      try {
        const result = await createDM(userId);
        if (result.data) {
          // Remove user from available list after successful DM creation
          const updatedUsers = new Map(availableUsers);
          updatedUsers.delete(userId);
          setAvailableUsers(updatedUsers);
        } else {
          console.error("Failed to create DM:", result.error);
        }
      } catch (error) {
        console.error("Error creating DM:", error);
      } finally {
        setIsCreatingDM(null);
      }
    },
    [createDM, availableUsers]
  );

  return (
    <SearchContainer>
      <div className="inputFieldWrapper">
        <SearchInput
          label="Search Users"
          style={{ width: "100%" }}
          onChange={(e) => setInputValue(e)}
          value={inputValue}
          placeholder="Search users..."
          clearable={false}
          showSuggestions={false}
          showCategories={false}
        />
      </div>
      <div className="channelListWrapper">
        <div className="listHeader">Available Users</div>
        <div className="list">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Loader size={30} />
              <div style={{ color: '#777583', marginTop: '10px' }}>Loading users...</div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#777583' }}>
              {inputValue ? 'No users found matching your search.' : 'No users available for DM creation.'}
            </div>
          ) : (
            filteredUsers.map(([userId, username]) => (
              <div key={userId} className="listItem">
                <div>
                  <div className="channelNameText">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      style={{ marginRight: '8px' }}
                    >
                      <path
                        d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z"
                        fill="#3B3B40"
                      />
                    </svg>
                    {username}
                  </div>
                  <div className="creatorText">
                    User ID: {userId.slice(0, 8)}...
                  </div>
                </div>
                <div className="listItemOptions">
                  {isCreatingDM === userId && (
                    <div className="spinnerWrapper">
                      <Loader size={20} />
                    </div>
                  )}
                  <Button
                    disabled={isCreatingDM === userId}
                    variant="primary"
                    onClick={() => handleCreateDM(userId)}
                    style={{ width: "100px" }}
                  >
                    {isCreatingDM === userId ? "Creating..." : "Start DM"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </SearchContainer>
  );
}
