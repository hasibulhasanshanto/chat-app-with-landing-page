'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatUIStore } from '@/store/useChatUIStore';
import { useToast } from '@/context/ToastContext';
import { useSocket } from '@/context/SocketContext';
import {
  useConversationsQuery,
  useMessagesQuery,
  useSendMessageMutation,
  useCreateDirectConversationMutation,
  useCreateGroupConversationMutation,
  useAddGroupMembersMutation,
  useRemoveGroupMemberMutation,
  usePromoteAdminMutation,
  useRenameGroupMutation,
} from '@/hooks/queries/useConversationQueries';
import { Conversation, GroupConversation } from '@/types/chat';
import { SearchedUser } from '@/types/user';
import { AppNavSidebar } from '@/components/chat/AppNavSidebar';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatArea } from '@/components/chat/ChatArea';
import { EmptyChatState } from '@/components/chat/EmptyChatState';
import { DetailsPanel } from '@/components/chat/DetailsPanel';
import { NewChatModal } from '@/components/chat/NewChatModal';
import { NewGroupModal } from '@/components/chat/NewGroupModal';
import { ManageGroupModal } from '@/components/chat/ManageGroupModal';
import { Loader2 } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const { success, error: toastError, info } = useToast();

  // Zustand UI State
  const {
    activeConversationId,
    setActiveConversationId,
    isDetailsOpen,
    toggleDetails,
    setDetailsOpen,
    activeNavTab,
    setActiveNavTab,
    mobileView,
    setMobileView,
    isNewChatOpen,
    openNewChat,
    closeNewChat,
    isNewGroupOpen,
    openNewGroup,
    closeNewGroup,
    manageGroupModal,
    openManageGroup,
    closeManageGroup,
  } = useChatUIStore();

  // TanStack Query Server State with Infinite Scroll Pagination
  const { data: conversations = [], isLoading: isLoadingConversations } = useConversationsQuery();
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useMessagesQuery(activeConversationId);
  const messages = messagesData?.messages || [];

  // Mutations
  const sendMessageMutation = useSendMessageMutation();
  const createDirectMutation = useCreateDirectConversationMutation();
  const createGroupMutation = useCreateGroupConversationMutation();
  const addMembersMutation = useAddGroupMembersMutation();
  const removeMemberMutation = useRemoveGroupMemberMutation();
  const promoteAdminMutation = usePromoteAdminMutation();
  const renameGroupMutation = useRenameGroupMutation();
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  // Redirect to login if user becomes unauthenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  // Join active conversation room on socket if supported by backend
  useEffect(() => {
    if (socket && activeConversationId) {
      socket.emit('join', activeConversationId);
      socket.emit('join:room', { conversationId: activeConversationId });
      socket.emit('conversation:join', { conversationId: activeConversationId });
      socket.emit('joinConversation', activeConversationId);
    }
  }, [socket, activeConversationId]);

  // Active conversation object
  const activeConversation = conversations.find((c) => c._id === activeConversationId) || null;

  // Handlers
  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversationId(conv._id);
    setMobileView('chat');
    // Clear unread count for the opened conversation
    queryClient.setQueryData<Conversation[]>(
      queryKeys.conversations.list(),
      (old = []) => old.map((c) => (c._id === conv._id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = async (text: string) => {
    if (!activeConversationId) return;
    try {
      await sendMessageMutation.mutateAsync({ conversationId: activeConversationId, text });
    } catch (err: any) {
      toastError(err?.message || 'Failed to send message');
    }
  };

  const handleSelectSearchedUser = async (userId: string, targetUser: SearchedUser) => {
    try {
      const existing = conversations.find(
        (c) => c.type === 'direct' && c.participant?._id === userId
      );

      if (existing) {
        setActiveConversationId(existing._id);
        setMobileView('chat');
        return;
      }

      const newConv = await createDirectMutation.mutateAsync({ userId });
      setActiveConversationId(newConv._id);
      setMobileView('chat');
      success(`Started conversation with ${targetUser.name}`);
    } catch (err: any) {
      toastError(err?.message || 'Could not start conversation');
    }
  };

  const handleCreateGroup = async (name: string, participantIds: string[]) => {
    try {
      const newGroup = await createGroupMutation.mutateAsync({ name, participantIds });
      setActiveConversationId(newGroup._id);
      setMobileView('chat');
      success(`Created channel "${newGroup.name}"`);
    } catch (err: any) {
      toastError(err?.message || 'Could not create group');
    }
  };

  const handleAddMembers = async (userIds: string[]) => {
    if (!activeConversationId) return;
    try {
      await addMembersMutation.mutateAsync({ conversationId: activeConversationId, userIds });
      success('Added new members to group');
    } catch (err: any) {
      toastError(err?.message || 'Failed to add members');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!activeConversationId) return;
    try {
      await removeMemberMutation.mutateAsync({ conversationId: activeConversationId, userId });
      success('Removed member from group');
    } catch (err: any) {
      toastError(err?.message || 'Failed to remove member');
    }
  };

  const handlePromoteAdmin = async (userId: string) => {
    if (!activeConversationId) return;
    try {
      await promoteAdminMutation.mutateAsync({ conversationId: activeConversationId, userId });
      success('Promoted member to group admin');
    } catch (err: any) {
      toastError(err?.message || 'Failed to promote member');
    }
  };

  const handleRenameGroup = async (name: string) => {
    if (!activeConversationId) return;
    try {
      await renameGroupMutation.mutateAsync({ conversationId: activeConversationId, name });
      success('Group renamed successfully');
    } catch (err: any) {
      toastError(err?.message || 'Failed to rename group');
    }
  };

  const handleLeaveGroup = async () => {
    if (!activeConversationId || !user) return;
    try {
      await removeMemberMutation.mutateAsync({
        conversationId: activeConversationId,
        userId: user._id,
      });
      setActiveConversationId(null);
      setMobileView('list');
      info('You left the group');
    } catch (err: any) {
      toastError(err?.message || 'Failed to leave group');
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-surface text-on-surface font-sans">
      {/* 1. Primary Left App Navigation Sidebar (hidden on mobile and tablet when chatting) */}
      <div className={`${mobileView === 'chat' ? 'hidden lg:flex' : 'flex'} h-full shrink-0`}>
        <AppNavSidebar
          activeTab={activeNavTab}
          setActiveTab={setActiveNavTab}
          onOpenNewChat={openNewChat}
          onOpenNewGroup={openNewGroup}
        />
      </div>

      {/* 2. Secondary Sidebar: Conversation List (TanStack Query Cache) */}
      <div className={`${mobileView === 'chat' ? 'hidden lg:flex' : 'flex'} h-full shrink-0 flex-1 lg:flex-initial`}>
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          currentUser={user}
          isLoading={isLoadingConversations}
          onSelectConversation={handleSelectConversation}
          onOpenNewChat={openNewChat}
          onOpenNewGroup={openNewGroup}
        />
      </div>

      {/* 3. Main Center Chat Area or Empty State */}
      <main className={`flex-1 h-full flex overflow-hidden ${mobileView === 'list' ? 'hidden lg:flex' : 'flex'}`}>
        {activeConversation ? (
          <div className="flex-1 h-full flex overflow-hidden relative">
            <ChatArea
              conversation={activeConversation}
              messages={messages}
              currentUser={user}
              isLoadingMessages={isLoadingMessages}
              hasNextPage={Boolean(hasNextPage)}
              isFetchingNextPage={Boolean(isFetchingNextPage)}
              fetchNextPage={fetchNextPage}
              onSendMessage={handleSendMessage}
              onToggleDetails={toggleDetails}
              onBackToConversations={() => setMobileView('list')}
            />

            {/* 4. Right Details Panel (Desktop in-flow, Mobile/Tablet Slide-over drawer) */}
            {isDetailsOpen && (
              <>
                {/* Desktop in-flow panel (>= lg) */}
                <div className="hidden lg:block h-full shrink-0">
                  <DetailsPanel
                    conversation={activeConversation}
                    currentUser={user}
                    onClose={() => setDetailsOpen(false)}
                    onOpenAddMembers={() => openManageGroup('add_members')}
                    onOpenRenameGroup={() => openManageGroup('rename')}
                    onRemoveMember={handleRemoveMember}
                    onPromoteAdmin={handlePromoteAdmin}
                    onLeaveGroup={handleLeaveGroup}
                  />
                </div>

                {/* Mobile & Tablet Slide-Over Drawer (< lg) */}
                <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
                    onClick={() => setDetailsOpen(false)}
                  />
                  {/* Drawer Content */}
                  <div className="relative w-full max-w-sm sm:max-w-md h-full bg-surface-container-low z-10 shadow-2xl animate-in slide-in-from-right duration-200 flex flex-col">
                    <DetailsPanel
                      conversation={activeConversation}
                      currentUser={user}
                      onClose={() => setDetailsOpen(false)}
                      onOpenAddMembers={() => openManageGroup('add_members')}
                      onOpenRenameGroup={() => openManageGroup('rename')}
                      onRemoveMember={handleRemoveMember}
                      onPromoteAdmin={handlePromoteAdmin}
                      onLeaveGroup={handleLeaveGroup}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <EmptyChatState onOpenNewChat={openNewChat} />
        )}
      </main>

      {/* Modals controlled via Zustand */}
      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={closeNewChat}
        currentUser={user}
        onSelectUser={handleSelectSearchedUser}
      />

      <NewGroupModal
        isOpen={isNewGroupOpen}
        onClose={closeNewGroup}
        currentUser={user}
        onCreateGroup={handleCreateGroup}
      />

      {activeConversation && activeConversation.type === 'group' && (
        <ManageGroupModal
          isOpen={manageGroupModal.isOpen}
          mode={manageGroupModal.mode}
          group={activeConversation as GroupConversation}
          currentUser={user}
          onClose={closeManageGroup}
          onAddMembers={handleAddMembers}
          onRenameGroup={handleRenameGroup}
        />
      )}
    </div>
  );
}
