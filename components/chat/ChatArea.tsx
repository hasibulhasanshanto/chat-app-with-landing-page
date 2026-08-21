'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Conversation, Message } from '@/types/chat';
import { User } from '@/types/user';
import { Avatar } from '@/components/ui/Avatar';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';
import { formatMessageDateGroup, resolveDisplayName } from '@/lib/utils';
import {
  Phone,
  Video,
  Info,
  ArrowLeft,
  ArrowDown,
  Loader2
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useSocket } from '@/context/SocketContext';

interface ChatAreaProps {
  conversation: Conversation;
  messages: Message[];
  currentUser: User | null;
  isLoadingMessages: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  onSendMessage: (text: string) => Promise<void>;
  onToggleDetails: () => void;
  onBackToConversations?: () => void;
}

export function ChatArea({
  conversation,
  messages,
  currentUser,
  isLoadingMessages,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  onSendMessage,
  onToggleDetails,
  onBackToConversations,
}: ChatAreaProps) {
  const { info } = useToast();
  const { typingUsers } = useSocket();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [unreadNewCount, setUnreadNewCount] = useState(0);
  const prevMessagesLengthRef = useRef(messages.length);

  const isGroup = conversation.type === 'group';
  const directParticipant = conversation.type === 'direct' ? conversation.participant : undefined;
  const title = isGroup
    ? conversation.name
    : resolveDisplayName(directParticipant?.name, directParticipant?.phone);

  const statusSubtitle = isGroup
    ? `${conversation.participants?.length || 0} participants`
    : 'Online';

  // Active typing users strictly for this conversation ID
  const currentTypingUsers = useMemo(() => {
    return typingUsers[conversation._id] || [];
  }, [typingUsers, conversation._id]);

  // Map participant IDs to names for displaying in group and direct chat
  const participantMap = useMemo(() => {
    const map = new Map<string, string>();
    if (isGroup && conversation.participants) {
      conversation.participants.forEach((p) => {
        map.set(p._id, resolveDisplayName(p.name, p.phone));
      });
    } else if (directParticipant) {
      map.set(directParticipant._id, resolveDisplayName(directParticipant.name, directParticipant.phone));
    }
    if (currentUser) {
      map.set(currentUser._id, currentUser.name);
      map.set('me', currentUser.name);
    }
    return map;
  }, [isGroup, conversation, directParticipant, currentUser]);

  // Guarantee chronological order: oldest at top, newest at bottom
  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messages]);

  // Scroll to bottom smoothly
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end',
      });
    }
    setIsAtBottom(true);
    setUnreadNewCount(0);
  }, []);

  // Track the newest message ID so we can distinguish "older messages prepended" from "new message appended"
  const newestMsgIdRef = useRef<string | null>(null);
  const isFetchingOlderRef = useRef(false);

  // Monitor scroll position (both for bottom auto-scroll & top infinite loading)
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;

    // Trigger loading older messages when scrolling near the top
    if (scrollTop < 120 && hasNextPage && !isFetchingNextPage && !isFetchingOlderRef.current && fetchNextPage) {
      isFetchingOlderRef.current = true;
      prevScrollHeightRef.current = scrollHeight;
      fetchNextPage();
    }

    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const atBottom = distanceFromBottom < 100;

    setIsAtBottom(atBottom);
    if (atBottom) {
      setUnreadNewCount(0);
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Preserve scroll offset when older messages are prepended to the top
  useEffect(() => {
    if (prevScrollHeightRef.current > 0 && scrollContainerRef.current && isFetchingOlderRef.current) {
      const currentScrollHeight = scrollContainerRef.current.scrollHeight;
      const heightDifference = currentScrollHeight - prevScrollHeightRef.current;
      if (heightDifference > 0) {
        scrollContainerRef.current.scrollTop += heightDifference;
      }
      prevScrollHeightRef.current = 0;
      // Keep isFetchingOlderRef true for a tick so the new-message effect doesn't fire
      requestAnimationFrame(() => {
        isFetchingOlderRef.current = false;
      });
    }
  }, [sortedMessages.length]);

  // Reset scroll & unread count when switching conversations
  useEffect(() => {
    setUnreadNewCount(0);
    setIsAtBottom(true);
    prevMessagesLengthRef.current = messages.length;
    prevScrollHeightRef.current = 0;
    isFetchingOlderRef.current = false;
    newestMsgIdRef.current = null;
    setTimeout(() => {
      scrollToBottom(false);
    }, 50);
  }, [conversation._id, scrollToBottom]);

  // Handle incoming new messages (only scroll to bottom if a genuinely NEW message was appended at the end)
  useEffect(() => {
    const currentLen = sortedMessages.length;
    if (currentLen === 0) {
      prevMessagesLengthRef.current = 0;
      newestMsgIdRef.current = null;
      return;
    }

    const currentNewestId = sortedMessages[currentLen - 1]?._id;
    const prevNewestId = newestMsgIdRef.current;
    const prevLen = prevMessagesLengthRef.current;

    // Update refs
    prevMessagesLengthRef.current = currentLen;
    newestMsgIdRef.current = currentNewestId || null;

    // Skip if we're in the middle of fetching older messages
    if (isFetchingOlderRef.current) return;

    // Only auto-scroll if the newest message ID actually changed (a new message was appended, not old ones prepended)
    if (currentLen > prevLen && currentNewestId && currentNewestId !== prevNewestId) {
      const newMessagesDiff = currentLen - prevLen;
      const lastMsg = sortedMessages[currentLen - 1];
      const isSentByMe =
        lastMsg?.sender === currentUser?._id ||
        lastMsg?.sender === (currentUser as any)?.id ||
        lastMsg?.sender === 'me' ||
        lastMsg?.isOptimistic;

      if (isSentByMe || isAtBottom) {
        scrollToBottom(true);
      } else {
        setUnreadNewCount((prev) => prev + newMessagesDiff);
      }
    }
  }, [sortedMessages, isAtBottom, currentUser, scrollToBottom]);

  // Scroll down if typing indicator appears while at bottom
  useEffect(() => {
    if (currentTypingUsers.length > 0 && isAtBottom) {
      scrollToBottom(true);
    }
  }, [currentTypingUsers.length, isAtBottom, scrollToBottom]);

  return (
    <div className="flex-1 h-full flex flex-col bg-surface overflow-hidden relative select-none">
      {/* Chat Header matching Stich design */}
      <header className="h-16 px-4 md:px-6 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Back Button */}
          {onBackToConversations && (
            <button
              type="button"
              onClick={onBackToConversations}
              className="md:hidden p-1.5 -ml-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
              title="Back to inbox"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <Avatar
            name={title}
            isGroup={isGroup}
            isOnline={!isGroup ? true : undefined}
            size="md"
          />

          <div className="flex flex-col min-w-0">
            <h2 className="text-sm font-bold text-on-surface truncate leading-tight">
              {title}
            </h2>
            <div className="text-[11px] text-on-surface-variant flex items-center gap-1.5">
              {!isGroup && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
              )}
              <span className="truncate">
                {currentTypingUsers.length > 0
                  ? `${currentTypingUsers[0]?.name || 'Someone'} is typing...`
                  : statusSubtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => info('Starting video call')}
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors cursor-pointer"
            title="Video call"
          >
            <Video className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => info('Starting voice call')}
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors cursor-pointer"
            title="Voice call"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onToggleDetails}
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors cursor-pointer"
            title="Conversation Details"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages Stream Scroll Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 relative"
      >
        {/* Top Loading Indicator / Beginning of Conversation Banner */}
        {isFetchingNextPage && (
          <div className="flex items-center justify-center py-2 shrink-0 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 bg-surface-container-high/80 text-on-surface-variant px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs">
              <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
              <span>Loading earlier messages...</span>
            </div>
          </div>
        )}

        {hasNextPage && !isFetchingNextPage && (
          <div className="flex items-center justify-center py-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (scrollContainerRef.current) {
                  prevScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
                }
                fetchNextPage?.();
              }}
              className="text-[11px] font-semibold text-primary hover:underline bg-surface-container-low hover:bg-surface-container-high px-3.5 py-1 rounded-full shadow-xs cursor-pointer transition-colors"
            >
              ↑ Load earlier messages
            </button>
          </div>
        )}

        {!hasNextPage && sortedMessages.length > 0 && !isLoadingMessages && (
          <div className="flex flex-col items-center justify-center text-center py-3 mb-2 text-on-surface-variant/80 border-b border-outline-variant/20 shrink-0">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center mb-1.5">
              <Avatar name={title} isGroup={isGroup} size="sm" />
            </div>
            <p className="text-xs font-bold text-on-surface">Beginning of conversation with {title}</p>
            <p className="text-[10px] text-on-surface-variant/60">This is the start of your message history.</p>
          </div>
        )}

        {isLoadingMessages ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-xs text-on-surface-variant font-medium">Loading messages...</span>
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-on-surface-variant">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-3">
              <Avatar name={title} isGroup={isGroup} size="md" />
            </div>
            <h4 className="text-sm font-bold text-on-surface mb-1">
              Start of your conversation with {title}
            </h4>
            <p className="text-xs max-w-xs leading-relaxed">
              Send a friendly message below to say hello and start collaborating!
            </p>
          </div>
        ) : (
          sortedMessages.map((msg, index) => {
            const isMe =
              msg.sender === currentUser?._id ||
              msg.sender === (currentUser as any)?.id ||
              msg.sender === 'me';

            const senderName = isMe
              ? (currentUser?.name || 'You')
              : (participantMap.get(msg.sender) || title);

            const showDateHeader =
              index === 0 ||
              formatMessageDateGroup(sortedMessages[index - 1].createdAt) !==
                formatMessageDateGroup(msg.createdAt);

            return (
              <React.Fragment key={msg._id || `msg-${index}`}>
                {showDateHeader && (
                  <div className="flex justify-center my-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/80 bg-surface-container-high/80 px-3 py-1 rounded-full shadow-xs">
                      {formatMessageDateGroup(msg.createdAt)}
                    </span>
                  </div>
                )}

                <MessageBubble
                  message={msg}
                  isMe={isMe}
                  senderName={senderName}
                  isGroup={isGroup}
                />
              </React.Fragment>
            );
          })
        )}

        {/* Real-time Messenger / Stich-design 3-Dots Typing Indicator strictly for this conversation */}
        {currentTypingUsers.length > 0 && (
          <div className="flex items-end gap-2 max-w-[85%] mt-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <Avatar
              name={currentTypingUsers[0]?.name || title}
              size="sm"
              className="mb-0.5"
            />
            <div className="bg-surface-container-low text-on-surface rounded-2xl rounded-bl-xs px-3.5 py-2.5 shadow-xs flex items-center gap-1.5 w-14 h-9">
              <span className="w-1.5 h-1.5 bg-on-surface-variant/80 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-on-surface-variant/80 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-on-surface-variant/80 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-2 shrink-0" />
      </div>

      {/* Floating "New Messages" / Scroll-to-Bottom Pill Button matching Stich Screenshot */}
      {(!isAtBottom || unreadNewCount > 0) && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 animate-in fade-in zoom-in-95 duration-150">
          <button
            type="button"
            onClick={() => scrollToBottom(true)}
            className="bg-secondary-container text-on-secondary-container hover:bg-secondary-container/90 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer border border-on-secondary-container/10"
          >
            <ArrowDown className="w-4 h-4" />
            <span>
              {unreadNewCount > 0
                ? `${unreadNewCount} New Message${unreadNewCount > 1 ? 's' : ''}`
                : 'Scroll to bottom'}
            </span>
          </button>
        </div>
      )}

      {/* Message Composer */}
      <MessageComposer
        conversationId={conversation._id}
        onSendMessage={onSendMessage}
        placeholder={`Message ${title}...`}
        disabled={isLoadingMessages}
      />
    </div>
  );
}
