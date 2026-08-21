'use client';

import React, { useState, useMemo } from 'react';
import { Conversation } from '@/types/chat';
import { User } from '@/types/user';
import { Avatar } from '@/components/ui/Avatar';
import { formatConversationDate } from '@/lib/utils';
import { Search, Users, MessageSquarePlus, UserPlus } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  currentUser: User | null;
  isLoading: boolean;
  onSelectConversation: (conversation: Conversation) => void;
  onOpenNewChat: () => void;
  onOpenNewGroup: () => void;
}

export function ConversationList({
  conversations,
  activeConversationId,
  currentUser,
  isLoading,
  onSelectConversation,
  onOpenNewChat,
  onOpenNewGroup,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations by contact/group name or last message text
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase().trim();

    return conversations.filter((conv) => {
      const title =
        conv.type === 'group'
          ? conv.name
          : conv.participant?.name || 'Unknown User';

      const lastText = conv.lastMessage?.text || '';
      return title.toLowerCase().includes(query) || lastText.toLowerCase().includes(query);
    });
  }, [conversations, searchQuery]);

  return (
    <div className="w-full md:w-80 h-full bg-surface-container-low border-r border-outline-variant/30 flex flex-col shrink-0 select-none">
      {/* Header */}
      <div className="p-4 md:p-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-on-surface tracking-tight">Inbox</h2>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenNewChat}
              className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary/90 transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Start New Direct Chat"
            >
              <UserPlus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenNewGroup}
              className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center hover:bg-secondary-container/80 transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Create New Group"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-surface-container-highest/60 text-on-surface text-xs rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-on-surface-variant/50 border border-transparent focus:border-outline-variant/30"
          />
        </div>
      </div>

      {/* Conversation List Stream */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
        {isLoading ? (
          // Skeleton loading
          Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
              <div className="w-12 h-12 rounded-full bg-surface-container-high shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-surface-container-high rounded w-3/4" />
                <div className="h-2.5 bg-surface-container-high rounded w-1/2" />
              </div>
            </div>
          ))
        ) : filteredConversations.length === 0 ? (
          // Empty list state
          <div className="p-8 text-center flex flex-col items-center justify-center h-48">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-3">
              <MessageSquarePlus className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-on-surface mb-1">
              {searchQuery ? 'No chats found' : 'No conversations yet'}
            </p>
            <p className="text-xs text-on-surface-variant mb-4 max-w-[200px]">
              {searchQuery
                ? 'Try searching with a different name'
                : 'Start a direct chat or create a group to begin'}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={onOpenNewChat}
                className="text-xs font-semibold bg-primary text-on-primary px-3.5 py-1.5 rounded-lg shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
              >
                + New Chat
              </button>
            )}
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isSelected = conv._id === activeConversationId;
            const isGroup = conv.type === 'group';
            const title = isGroup ? conv.name : conv.participant?.name || 'Direct Chat';
            const dateStr = formatConversationDate(conv.lastMessage?.createdAt || conv.updatedAt);
            const lastText = conv.lastMessage?.text || 'No messages yet';
            const unreadCount = conv.unreadCount || 0;
            const hasUnread = unreadCount > 0 && !isSelected;

            return (
              <button
                key={conv._id}
                type="button"
                onClick={() => onSelectConversation(conv)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all relative text-left group cursor-pointer ${
                  isSelected
                    ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                    : hasUnread
                    ? 'bg-surface-container-lowest hover:bg-surface-container-high shadow-xs'
                    : 'hover:bg-surface-container-high/80 text-on-surface'
                }`}
              >
                {/* Active indicator bar */}
                {isSelected && (
                  <div className="w-1 absolute left-0 top-1/2 -translate-y-1/2 h-8 bg-primary rounded-r-full" />
                )}

                <div className="relative shrink-0">
                  <Avatar
                    name={title}
                    isGroup={isGroup}
                    isOnline={!isGroup ? true : undefined}
                    size="lg"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span
                      className={`text-xs truncate ${
                        isSelected
                          ? 'text-on-secondary-container font-bold'
                          : hasUnread
                          ? 'text-on-surface font-extrabold'
                          : 'text-on-surface font-bold'
                      }`}
                    >
                      {title}
                    </span>
                    <span
                      className={`text-[10px] shrink-0 font-medium ${
                        isSelected
                          ? 'text-on-secondary-container/80'
                          : hasUnread
                          ? 'text-primary font-bold'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      {dateStr}
                    </span>
                  </div>

                  <p
                    className={`text-xs truncate ${
                      isSelected
                        ? 'text-on-secondary-container/90'
                        : hasUnread
                        ? 'text-on-surface font-semibold'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    {lastText}
                  </p>
                </div>

                {/* Unread Badge Count matching Stich design */}
                {hasUnread && (
                  <div className="w-5 h-5 rounded-full bg-primary text-on-primary text-[11px] font-bold flex items-center justify-center shrink-0 ml-1 shadow-sm animate-in zoom-in-75 duration-150">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
