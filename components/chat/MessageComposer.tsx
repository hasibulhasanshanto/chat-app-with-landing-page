'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Smile, Plus } from 'lucide-react';
import { useSocket } from '@/context/SocketContext';

interface MessageComposerProps {
  conversationId?: string;
  onSendMessage: (text: string) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
}

const EMOJI_LIST = ['👍', '❤️', '😊', '🎉', '🚀', '🔥', '👏', '✨', '👋', '💯'];

export function MessageComposer({
  conversationId,
  onSendMessage,
  placeholder = 'Type a message...',
  disabled = false,
}: MessageComposerProps) {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { emitTyping } = useSocket();
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleStopTyping = useCallback(() => {
    if (conversationId) {
      emitTyping(conversationId, false);
    }
  }, [conversationId, emitTyping]);

  // When conversation / person changes, immediately clear input and stop typing
  useEffect(() => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    handleStopTyping();
    setText('');
    setShowEmojis(false);
    inputRef.current?.focus();
  }, [conversationId, handleStopTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);

    if (!conversationId) return;

    if (val.trim().length > 0) {
      emitTyping(conversationId, true);

      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }

      typingTimerRef.current = setTimeout(() => {
        handleStopTyping();
      }, 2500);
    } else {
      handleStopTyping();
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = text.trim();
    if (!clean || isSending || disabled) return;

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    handleStopTyping();

    setText('');
    setIsSending(true);
    try {
      await onSendMessage(clean);
    } finally {
      setIsSending(false);
      setShowEmojis(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    inputRef.current?.focus();
    if (conversationId) {
      emitTyping(conversationId, true);
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-surface-container-lowest border-t border-outline-variant/30 shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.03)] relative z-20">
      {/* Quick Emoji Picker Popover */}
      {showEmojis && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setShowEmojis(false)} />
          <div className="absolute bottom-full left-6 mb-2 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-xl p-2 z-40 flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
            {EMOJI_LIST.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => insertEmoji(emoji)}
                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-surface-container-high rounded-lg transition-transform hover:scale-125 cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Composer Input Bar matching Stich design */}
      <form onSubmit={handleSend} className="w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-2 bg-surface-container-low rounded-2xl p-1.5 sm:p-2 pr-2.5 sm:pr-3 transition-all focus-within:bg-surface-container-lowest focus-within:shadow-md border border-outline-variant/20 focus-within:border-primary/40">
          <button
            type="button"
            className="w-8 h-8 rounded-full border border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-primary/40 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            title="Add attachment"
          >
            <Plus className="w-4 h-4" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className="flex-1 min-w-0 bg-transparent border-none focus:outline-none text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/50 px-1 sm:px-2"
          />

          <button
            type="button"
            onClick={() => setShowEmojis(!showEmojis)}
            className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-colors shrink-0 cursor-pointer"
            title="Emoji"
          >
            <Smile className="w-5 h-5" />
          </button>

          <button
            type="submit"
            disabled={!text.trim() || isSending || disabled}
            className="w-9 h-9 bg-primary text-on-primary rounded-full shadow-sm hover:shadow-md hover:bg-primary/90 hover:brightness-105 transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-95 shrink-0 flex items-center justify-center cursor-pointer"
            title="Send Message (Enter)"
          >
            <Send className="w-4 h-4 -mr-0.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
