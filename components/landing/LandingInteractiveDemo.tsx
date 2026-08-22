'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Send, CheckCheck, Circle, Smile, Plus, Phone, Video } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

const EMOJI_LIST = ['👍', '❤️', '😊', '🎉', '🚀', '🔥', '👏', '✨', '👋', '💯'];

const DEMO_PREVIEWS = [
  {
    id: 'sarah',
    name: 'Sarah Ahmed',
    role: 'Product Manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    online: true,
    lastTime: '10:44 AM',
    messages: [
      { id: 1, sender: 'sarah', text: 'Hey! Are we still meeting at 4 PM for the design review?', time: '10:42 AM' },
      { id: 2, sender: 'me', text: "Yes, absolutely! I've updated the Figma components.", time: '10:43 AM' },
      { id: 3, sender: 'sarah', text: 'Perfect! See you then. Looking forward to it.', time: '10:44 AM' },
    ],
  },
  {
    id: 'team',
    name: 'Design Team',
    role: '6 members',
    isGroup: true,
    online: true,
    lastTime: '10:30 AM',
    messages: [
      { id: 1, sender: 'Alex Rivera', text: 'New landing page components have been deployed!', time: '10:25 AM' },
      { id: 2, sender: 'me', text: 'The typography and micro-interactions look stunning.', time: '10:28 AM' },
      { id: 3, sender: 'Sarah Ahmed', text: 'Agree! Let us do a quick QA pass today.', time: '10:30 AM' },
    ],
  },
  {
    id: 'david',
    name: 'David Chen',
    role: 'Engineering Lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    online: false,
    lastTime: 'Yesterday',
    messages: [
      { id: 1, sender: 'david', text: 'API endpoints for socket events are fully tested.', time: 'Yesterday' },
      { id: 2, sender: 'me', text: 'Awesome! Optimistic UI handling is rock solid.', time: 'Yesterday' },
    ],
  },
];

export function LandingInteractiveDemo() {
  const [activeTab, setActiveTab] = useState(DEMO_PREVIEWS[0]);
  const [interactiveMessages, setInteractiveMessages] = useState(DEMO_PREVIEWS[0].messages);
  const [inputText, setInputText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [isTypingReply, setIsTypingReply] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll the inner container ONLY. NEVER use scrollIntoView which causes window scrolling!
  const scrollInnerChatToBottom = useCallback((smooth = true) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      if (smooth) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      } else {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollInnerChatToBottom(true);
  }, [interactiveMessages, isTypingReply, scrollInnerChatToBottom]);

  const handleSelectTab = (e: React.MouseEvent, item: typeof DEMO_PREVIEWS[0]) => {
    e.preventDefault();
    setActiveTab(item);
    setInteractiveMessages(item.messages);
    setIsTypingReply(false);
    setShowEmojis(false);
    setInputText('');
    setTimeout(() => scrollInnerChatToBottom(false), 20);
  };

  const insertEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
    inputRef.current?.focus({ preventScroll: true });
  };

  const handleSendMock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = inputText.trim();
    if (!clean) return;

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: clean,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setInteractiveMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setShowEmojis(false);

    // Simulate realistic typing delay then reply
    setTimeout(() => {
      setIsTypingReply(true);
    }, 400);

    setTimeout(() => {
      setIsTypingReply(false);
      const automatedReplies = [
        `Got it! Ready whenever you are 👍`,
        `That sounds fantastic! Let's ship it 🚀`,
        `Awesome work! The real-time sync feels super smooth ✨`,
        `Received! Checking this right away 😊`,
      ];
      const randomReply = automatedReplies[Math.floor(Math.random() * automatedReplies.length)];

      setInteractiveMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: activeTab.name,
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1400);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMock();
    }
  };

  return (
    <div id="demo" className="max-w-5xl mx-auto">
      <div className="bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden">
        {/* Window Controls Bar */}
        <div className="bg-surface-container-low px-5 py-3 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400/80" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
            <span className="text-xs font-semibold text-on-surface-variant ml-2 font-mono">
              chatflow.app/live-preview
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
              Live Interactive Sandbox
            </span>
            <Link
              href="/login"
              className="text-xs font-semibold text-primary hover:underline ml-2"
            >
              Open Full App →
            </Link>
          </div>
        </div>

        {/* Chat App Mockup Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 h-[540px]">
          {/* Left Sidebar in preview */}
          <div className="hidden md:flex md:col-span-4 bg-surface-container-low border-r border-outline-variant/30 flex-col">
            <div className="p-4 border-b border-outline-variant/30">
              <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                Recent Chats
              </div>
              <div className="text-[11px] text-on-surface-variant/70">Click to switch demo conversation</div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {DEMO_PREVIEWS.map((item) => {
                const isSelected = item.id === activeTab.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={(e) => handleSelectTab(e, item)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                        : 'hover:bg-surface-container-high text-on-surface'
                    }`}
                  >
                    <Avatar
                      name={item.name}
                      src={item.avatar}
                      isOnline={item.online}
                      isGroup={item.isGroup}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="text-xs font-bold truncate">{item.name}</span>
                        <span className="text-[10px] opacity-70">{item.lastTime}</span>
                      </div>
                      <p className="text-[11px] truncate opacity-80">
                        {item.messages[item.messages.length - 1]?.text}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Chat Stream in preview */}
          <div className="col-span-12 md:col-span-8 flex flex-col bg-surface overflow-hidden relative">
            {/* Chat Header matching Stich design */}
            <div className="h-14 px-4 sm:px-5 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 flex items-center justify-between shrink-0 z-10">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar
                  name={activeTab.name}
                  src={activeTab.avatar}
                  isOnline={activeTab.online}
                  isGroup={activeTab.isGroup}
                  size="sm"
                />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-on-surface leading-tight truncate">
                    {activeTab.name}
                  </div>
                  <div className="text-[10px] text-on-surface-variant mt-0.5 flex items-center gap-1">
                    {activeTab.online ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                        <span>Online</span>
                      </>
                    ) : (
                      <span>{activeTab.role}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Icons in header */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-colors cursor-pointer"
                  title="Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-colors cursor-pointer"
                  title="Voice Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <Link
                  href="/login"
                  className="text-xs font-semibold bg-primary text-on-primary px-3 py-1.5 rounded-xl hover:bg-primary/90 transition-all shadow-xs ml-1"
                >
                  Log In
                </Link>
              </div>
            </div>

            {/* Scrollable Message Stream */}
            <div
              ref={scrollContainerRef}
              className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 relative"
            >
              <div className="flex justify-center my-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant/70 bg-surface-container px-2.5 py-1 rounded-full shadow-xs">
                  Today
                </span>
              </div>

              {interactiveMessages.map((msg) => {
                const isMe = msg.sender === 'me';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[82%] animate-in fade-in slide-in-from-bottom-1 duration-150 ${
                      isMe ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    {!isMe && activeTab.isGroup && (
                      <span className="text-[10px] font-semibold text-primary mb-0.5 ml-1">
                        {msg.sender}
                      </span>
                    )}
                    <div
                      className={`p-3 text-xs leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-primary text-on-primary rounded-2xl rounded-br-xs'
                          : 'bg-surface-container-high text-on-surface rounded-2xl rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-on-surface-variant/70 px-1">
                      <span>{msg.time}</span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 text-primary" />}
                    </div>
                  </div>
                );
              })}

              {/* 3-Dots Animated Typing Indicator */}
              {isTypingReply && (
                <div className="flex items-end gap-2 max-w-[85%] mt-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <Avatar
                    name={activeTab.name}
                    src={activeTab.avatar}
                    size="sm"
                    className="mb-0.5"
                  />
                  <div className="bg-surface-container-high text-on-surface rounded-2xl rounded-bl-xs px-3.5 py-2.5 shadow-xs flex items-center gap-1.5 w-14 h-8">
                    <span className="w-1.5 h-1.5 bg-on-surface-variant/80 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-on-surface-variant/80 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-on-surface-variant/80 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Message Composer with Emoji Popover matching Chat App */}
            <div className="p-3 bg-surface-container-lowest border-t border-outline-variant/30 relative z-20">
              {/* Emoji Picker Popover */}
              {showEmojis && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowEmojis(false)} />
                  <div className="absolute bottom-full left-4 mb-2 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-xl p-2 z-40 flex items-center gap-1 animate-in fade-in zoom-in-95 duration-150">
                    {EMOJI_LIST.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-base sm:text-lg hover:bg-surface-container-high rounded-lg transition-transform hover:scale-125 cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <form onSubmit={handleSendMock} className="w-full">
                <div className="flex items-center gap-2 bg-surface-container-low rounded-2xl p-1.5 sm:p-2 pr-2 sm:pr-2.5 transition-all focus-within:bg-surface-container-lowest focus-within:shadow-md border border-outline-variant/20 focus-within:border-primary/40">
                  <button
                    type="button"
                    onClick={() => insertEmoji('📎')}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-primary/40 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                    title="Add attachment / emoji"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Message ${activeTab.name}... (Press Enter)`}
                    className="flex-1 bg-transparent border-none focus:outline-none text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/50 px-1"
                  />

                  <button
                    type="button"
                    onClick={() => setShowEmojis(!showEmojis)}
                    className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-colors shrink-0 cursor-pointer"
                    title="Emoji picker"
                  >
                    <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="w-8 h-8 sm:w-9 sm:h-9 bg-primary text-on-primary rounded-full shadow-xs hover:shadow-md hover:bg-primary/90 transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-95 shrink-0 flex items-center justify-center cursor-pointer"
                    title="Send message"
                  >
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 -mr-0.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
