'use client';

import React, { useEffect, useRef } from 'react';
import { Conversation, Message } from '@/types/chat';
import { User } from '@/types/user';
import { Avatar } from '@/components/ui/Avatar';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';
import { formatMessageDateGroup } from '@/lib/utils';
import {
  Phone,
  Video,
  Info,
  Search,
  ArrowLeft,
  MoreVertical,
  Circle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface ChatAreaProps {
  conversation: Conversation;
  messages: Message[];
  currentUser: User | null;
  isLoadingMessages: boolean;
  onSendMessage: (text: string) => Promise<void>;
  onToggleDetails: () => void;
  onBackToConversations?: () => void;
}

export function ChatArea({
  conversation,
  messages,
  currentUser,
  isLoadingMessages,
  onSendMessage,
  onToggleDetails,
  onBackToConversations,
}: ChatAreaProps) {
  const { info } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isGroup = conversation.type === 'group';
  const title = isGroup ? conversation.name : conversation.participant?.name || 'User';
  const statusSubtitle = isGroup
    ? `${conversation.participants?.length || 0} participants`
    : 'Online';

  // Map participant IDs to names for displaying in group chat
  const participantMap = React.useMemo(() => {
    const map = new Map<string, string>();
    if (isGroup && conversation.participants) {
      conversation.participants.forEach((p) => {
        map.set(p._id, p.name);
      });
    }
    if (currentUser) {
      map.set(currentUser._id, currentUser.name);
    }
    return map;
  }, [isGroup, conversation, currentUser]);

  // Scroll to bottom on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 h-full flex flex-col bg-surface overflow-hidden relative">
      {/* Chat Header matching Stich design */}
      <header className="h-16 px-4 md:px-6 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Back Button */}
          {onBackToConversations && (
            <button
              type="button"
              onClick={onBackToConversations}
              className="md:hidden p-1.5 -ml-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
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
              <span className="truncate">{statusSubtitle}</span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => info('Starting video call')}
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors"
            title="Video call"
          >
            <Video className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => info('Starting voice call')}
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors"
            title="Voice call"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onToggleDetails}
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors"
            title="Conversation Details"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
        {isLoadingMessages ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-xs text-on-surface-variant font-medium">Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
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
          messages.map((msg, index) => {
            const isMe =
              msg.sender === currentUser?._id ||
              msg.sender === (currentUser as any)?.id ||
              msg.sender === 'me';

            const senderName = isMe ? 'You' : participantMap.get(msg.sender) || 'Member';

            const showDateHeader =
              index === 0 ||
              formatMessageDateGroup(messages[index - 1].createdAt) !==
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

        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <MessageComposer
        onSendMessage={onSendMessage}
        placeholder={`Message ${title}...`}
        disabled={isLoadingMessages}
      />
    </div>
  );
}
