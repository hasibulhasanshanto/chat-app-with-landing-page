'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { useToast } from '@/context/ToastContext';
import { Conversation, GroupConversation, Message } from '@/types/chat';
import { SearchedUser } from '@/types/user';
import {
  getConversationsApi,
  getMessagesApi,
  sendMessageApi,
  createDirectConversationApi,
  createGroupConversationApi,
  addGroupMembersApi,
  removeGroupMemberApi,
  promoteAdminApi,
  renameGroupApi,
} from '@/lib/api/conversations';
import { AppNavSidebar } from '@/components/chat/AppNavSidebar';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatArea } from '@/components/chat/ChatArea';
import { EmptyChatState } from '@/components/chat/EmptyChatState';
import { DetailsPanel } from '@/components/chat/DetailsPanel';
import { NewChatModal } from '@/components/chat/NewChatModal';
import { NewGroupModal } from '@/components/chat/NewGroupModal';
import { ManageGroupModal } from '@/components/chat/ManageGroupModal';
import { Loader2, WifiOff, Wifi } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { isConnected, onNewMessage, onConversationUpdated } = useSocket();
  const { success, error: toastError, info } = useToast();

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<'messages' | 'contacts' | 'settings'>('messages');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

  // Modals state
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  const [manageGroupModal, setManageGroupModal] = useState<{
    isOpen: boolean;
    mode: 'add_members' | 'rename';
  }>({
    isOpen: false,
    mode: 'add_members',
  });

  // Mobile navigation state ('list' or 'chat')
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  // Load conversations on mount
  const fetchConversations = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoadingConversations(true);
    try {
      const data = await getConversationsApi();
      setConversations(data);
    } catch (err: any) {
      console.error('Failed to load conversations:', err);
      toastError(err?.message || 'Failed to load conversations');
    } finally {
      setIsLoadingConversations(false);
    }
  }, [isAuthenticated, toastError]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Load messages when active conversation changes
  const fetchMessages = useCallback(async (convId: string) => {
    setIsLoadingMessages(true);
    try {
      const res = await getMessagesApi(convId, { limit: 50 });
      setMessages(res.messages || []);
    } catch (err: any) {
      console.error('Failed to load messages:', err);
      toastError(err?.message || 'Failed to load message history');
    } finally {
      setIsLoadingMessages(false);
    }
  }, [toastError]);

  useEffect(() => {
    if (activeConversation?._id) {
      fetchMessages(activeConversation._id);
    } else {
      setMessages([]);
    }
  }, [activeConversation?._id, fetchMessages]);

  // Handle Real-time socket events
  useEffect(() => {
    // 1. Real-time message receiver
    const unsubMessage = onNewMessage((incomingMessage) => {
      // Check if message belongs to currently open conversation
      if (activeConversation && incomingMessage.conversation === activeConversation._id) {
        setMessages((prev) => {
          // Avoid duplicate messages
          const exists = prev.some((m) => m._id === incomingMessage._id);
          if (exists) return prev;
          // Check if there is an optimistic message to replace
          const optimisticIndex = prev.findIndex(
            (m) => m.isOptimistic && m.text === incomingMessage.text
          );
          if (optimisticIndex !== -1) {
            const next = [...prev];
            next[optimisticIndex] = incomingMessage;
            return next;
          }
          return [...prev, incomingMessage];
        });
      }

      // Update conversation list item lastMessage and bump to top
      setConversations((prev) => {
        const index = prev.findIndex((c) => c._id === incomingMessage.conversation);
        if (index === -1) {
          // If conversation wasn't in list yet, refetch conversations
          fetchConversations();
          return prev;
        }
        const updated = {
          ...prev[index],
          lastMessage: {
            text: incomingMessage.text,
            sender: incomingMessage.sender,
            createdAt: incomingMessage.createdAt,
          },
          updatedAt: incomingMessage.createdAt,
        };
        const nextList = [...prev];
        nextList.splice(index, 1);
        return [updated, ...nextList];
      });
    });

    // 2. Real-time group updates receiver
    const unsubGroup = onConversationUpdated((updatedGroup) => {
      // If current active conversation is updated
      if (activeConversation && activeConversation._id === updatedGroup._id) {
        setActiveConversation(updatedGroup);
      }

      // Update in conversation list
      setConversations((prev) => {
        const index = prev.findIndex((c) => c._id === updatedGroup._id);
        if (index === -1) {
          return [updatedGroup, ...prev];
        }
        const nextList = [...prev];
        nextList[index] = {
          ...nextList[index],
          ...updatedGroup,
        };
        return nextList;
      });
    });

    return () => {
      unsubMessage();
      unsubGroup();
    };
  }, [activeConversation, onNewMessage, onConversationUpdated, fetchConversations]);

  // Select conversation handler
  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    setMobileView('chat');
  };

  // Send message handler with optimistic UI
  const handleSendMessage = async (text: string) => {
    if (!activeConversation || !user) return;

    const convId = activeConversation._id;
    const tempId = `optimistic-${Date.now()}`;
    const optimisticMessage: Message = {
      _id: tempId,
      conversation: convId,
      sender: user._id,
      text,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // Optimistically update messages
    setMessages((prev) => [...prev, optimisticMessage]);

    // Optimistically update conversation list preview
    setConversations((prev) => {
      const index = prev.findIndex((c) => c._id === convId);
      if (index === -1) return prev;
      const updated = {
        ...prev[index],
        lastMessage: {
          text,
          sender: user._id,
          createdAt: optimisticMessage.createdAt,
        },
        updatedAt: optimisticMessage.createdAt,
      };
      const nextList = [...prev];
      nextList.splice(index, 1);
      return [updated, ...nextList];
    });

    try {
      const sentMessage = await sendMessageApi(convId, text);
      // Swap optimistic message with real message
      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? sentMessage : m))
      );
    } catch (err: any) {
      console.error('Failed to send message:', err);
      toastError(err?.message || 'Message delivery failed');
      // Remove failed optimistic message
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    }
  };

  // Start 1-on-1 Direct Chat
  const handleSelectSearchedUser = async (userId: string, targetUser: SearchedUser) => {
    try {
      // Check if conversation with this user already exists in state
      const existing = conversations.find(
        (c) => c.type === 'direct' && c.participant?._id === userId
      );

      if (existing) {
        setActiveConversation(existing);
        setMobileView('chat');
        return;
      }

      // Create new conversation via API
      const newConv = await createDirectConversationApi({ userId });
      // Enhance with target user details for instant rendering
      const enrichedConv: Conversation = {
        ...newConv,
        type: 'direct',
        participant: {
          _id: targetUser._id,
          name: targetUser.name,
          phone: targetUser.phone,
        },
        lastMessage: {},
        updatedAt: new Date().toISOString(),
      };

      setConversations((prev) => [enrichedConv, ...prev]);
      setActiveConversation(enrichedConv);
      setMobileView('chat');
      success(`Started conversation with ${targetUser.name}`);
    } catch (err: any) {
      console.error('Failed to start direct conversation:', err);
      toastError(err?.message || 'Could not start conversation');
    }
  };

  // Create Group Chat
  const handleCreateGroup = async (name: string, participantIds: string[]) => {
    try {
      const newGroup = await createGroupConversationApi({ name, participantIds });
      setConversations((prev) => [newGroup, ...prev]);
      setActiveConversation(newGroup);
      setMobileView('chat');
      success(`Created channel "${newGroup.name}"`);
    } catch (err: any) {
      console.error('Failed to create group:', err);
      toastError(err?.message || 'Could not create group');
    }
  };

  // Group Admin: Add Members
  const handleAddMembers = async (userIds: string[]) => {
    if (!activeConversation) return;
    try {
      const updated = await addGroupMembersApi(activeConversation._id, userIds);
      setActiveConversation(updated);
      setConversations((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );
      success('Added new members to group');
    } catch (err: any) {
      toastError(err?.message || 'Failed to add members');
    }
  };

  // Group Admin: Remove Member
  const handleRemoveMember = async (userId: string) => {
    if (!activeConversation) return;
    try {
      const updated = await removeGroupMemberApi(activeConversation._id, userId);
      setActiveConversation(updated);
      setConversations((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );
      success('Removed member from group');
    } catch (err: any) {
      toastError(err?.message || 'Failed to remove member');
    }
  };

  // Group Admin: Promote Admin
  const handlePromoteAdmin = async (userId: string) => {
    if (!activeConversation) return;
    try {
      const updated = await promoteAdminApi(activeConversation._id, userId);
      setActiveConversation(updated);
      setConversations((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );
      success('Promoted member to group admin');
    } catch (err: any) {
      toastError(err?.message || 'Failed to promote member');
    }
  };

  // Group Admin: Rename Group
  const handleRenameGroup = async (name: string) => {
    if (!activeConversation) return;
    try {
      const updated = await renameGroupApi(activeConversation._id, name);
      setActiveConversation(updated);
      setConversations((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );
      success('Group renamed successfully');
    } catch (err: any) {
      toastError(err?.message || 'Failed to rename group');
    }
  };

  // Leave Group
  const handleLeaveGroup = async () => {
    if (!activeConversation || !user) return;
    try {
      await removeGroupMemberApi(activeConversation._id, user._id);
      setConversations((prev) => prev.filter((c) => c._id !== activeConversation._id));
      setActiveConversation(null);
      info('You left the group');
    } catch (err: any) {
      toastError(err?.message || 'Failed to leave group');
    }
  };

  // If loading auth state
  if (isAuthLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-surface gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <span className="text-sm font-semibold text-on-surface-variant">Connecting to ChatFlow...</span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-surface text-on-surface font-sans">
      {/* 1. Primary Left App Navigation Sidebar */}
      <AppNavSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewChat={() => setIsNewChatOpen(true)}
        onOpenNewGroup={() => setIsNewGroupOpen(true)}
      />

      {/* 2. Secondary Sidebar: Conversation List */}
      <div className={`${mobileView === 'chat' ? 'hidden md:flex' : 'flex'} h-full shrink-0`}>
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversation?._id || null}
          currentUser={user}
          isLoading={isLoadingConversations}
          onSelectConversation={handleSelectConversation}
          onOpenNewChat={() => setIsNewChatOpen(true)}
          onOpenNewGroup={() => setIsNewGroupOpen(true)}
        />
      </div>

      {/* 3. Main Center Chat Area or Empty State */}
      <main className={`flex-1 h-full flex overflow-hidden ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
        {activeConversation ? (
          <div className="flex-1 h-full flex overflow-hidden">
            <ChatArea
              conversation={activeConversation}
              messages={messages}
              currentUser={user}
              isLoadingMessages={isLoadingMessages}
              onSendMessage={handleSendMessage}
              onToggleDetails={() => setIsDetailsOpen(!isDetailsOpen)}
              onBackToConversations={() => setMobileView('list')}
            />

            {/* 4. Right Details Panel (collapsible) */}
            {isDetailsOpen && (
              <div className="hidden lg:block h-full">
                <DetailsPanel
                  conversation={activeConversation}
                  currentUser={user}
                  onClose={() => setIsDetailsOpen(false)}
                  onOpenAddMembers={() =>
                    setManageGroupModal({ isOpen: true, mode: 'add_members' })
                  }
                  onOpenRenameGroup={() =>
                    setManageGroupModal({ isOpen: true, mode: 'rename' })
                  }
                  onRemoveMember={handleRemoveMember}
                  onPromoteAdmin={handlePromoteAdmin}
                  onLeaveGroup={handleLeaveGroup}
                />
              </div>
            )}
          </div>
        ) : (
          <EmptyChatState onOpenNewChat={() => setIsNewChatOpen(true)} />
        )}
      </main>

      {/* Modals */}
      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        currentUser={user}
        onSelectUser={handleSelectSearchedUser}
      />

      <NewGroupModal
        isOpen={isNewGroupOpen}
        onClose={() => setIsNewGroupOpen(false)}
        currentUser={user}
        onCreateGroup={handleCreateGroup}
      />

      {activeConversation && activeConversation.type === 'group' && (
        <ManageGroupModal
          isOpen={manageGroupModal.isOpen}
          mode={manageGroupModal.mode}
          group={activeConversation as GroupConversation}
          currentUser={user}
          onClose={() => setManageGroupModal({ isOpen: false, mode: 'add_members' })}
          onAddMembers={handleAddMembers}
          onRenameGroup={handleRenameGroup}
        />
      )}
    </div>
  );
}
