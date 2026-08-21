'use client';

import React from 'react';
import { Message } from '@/types/chat';
import { User } from '@/types/user';
import { Avatar } from '@/components/ui/Avatar';
import { formatTime } from '@/lib/utils';
import { CheckCheck, Check, Clock } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  senderName?: string;
  isGroup?: boolean;
}

export function MessageBubble({
  message,
  isMe,
  senderName,
  isGroup = false,
}: MessageBubbleProps) {
  const timeStr = formatTime(message.createdAt);

  return (
    <div
      className={`flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[70%] group ${
        isMe ? 'ml-auto items-end self-end' : 'mr-auto items-start self-start'
      }`}
    >
      <div className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Incoming message sender avatar */}
        {!isMe && (
          <Avatar
            name={senderName || 'User'}
            size="xs"
            className="mb-1 shrink-0"
          />
        )}

        <div className="flex flex-col">
          {/* Sender label in group chat for incoming messages */}
          {!isMe && isGroup && senderName && (
            <span className="text-[11px] font-bold text-primary mb-1 ml-1">
              {senderName}
            </span>
          )}

          {/* Bubble content */}
          <div
            className={`p-3.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
              isMe
                ? 'bg-primary text-on-primary rounded-2xl rounded-br-sm shadow-sm'
                : 'bg-surface-container-high text-on-surface rounded-2xl rounded-bl-sm shadow-sm'
            }`}
          >
            {message.text}
          </div>
        </div>
      </div>

      {/* Meta timestamp & delivery status */}
      <div
        className={`flex items-center gap-1 mt-1 text-[10px] text-on-surface-variant/70 ${
          isMe ? 'mr-1' : 'ml-8'
        }`}
      >
        <span>{timeStr || 'Just now'}</span>
        {isMe && (
          <>
            {message.isOptimistic ? (
              <Clock className="w-3 h-3 text-on-surface-variant/60 animate-pulse" />
            ) : (
              <CheckCheck className="w-3.5 h-3.5 text-primary" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
