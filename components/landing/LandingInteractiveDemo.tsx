'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, CheckCheck, Circle } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

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

  const handleSelectTab = (item: typeof DEMO_PREVIEWS[0]) => {
    setActiveTab(item);
    setInteractiveMessages(item.messages);
  };

  const handleSendMock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: inputText.trim(),
      time: 'Just now',
    };
    setInteractiveMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Auto simulated response
    setTimeout(() => {
      setInteractiveMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: activeTab.name,
          text: `Got it! Ready whenever you are 👍`,
          time: 'Just now',
        },
      ]);
    }, 1000);
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
              Live Sandbox
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
        <div className="grid grid-cols-1 md:grid-cols-12 h-[520px]">
          {/* Left Sidebar in preview */}
          <div className="hidden md:flex md:col-span-4 bg-surface-container-low border-r border-outline-variant/30 flex-col">
            <div className="p-4 border-b border-outline-variant/30">
              <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                Recent Chats
              </div>
              <div className="text-xs text-on-surface-variant/80">Click a contact to test</div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {DEMO_PREVIEWS.map((item) => {
                const isSelected = item.id === activeTab.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item)}
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
          <div className="col-span-12 md:col-span-8 flex flex-col bg-surface">
            {/* Chat Header */}
            <div className="h-14 px-5 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  name={activeTab.name}
                  src={activeTab.avatar}
                  isOnline={activeTab.online}
                  isGroup={activeTab.isGroup}
                  size="sm"
                />
                <div>
                  <div className="text-sm font-bold text-on-surface leading-none">
                    {activeTab.name}
                  </div>
                  <div className="text-[10px] text-on-surface-variant mt-0.5 flex items-center gap-1">
                    {activeTab.online ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        <span>Online</span>
                      </>
                    ) : (
                      <span>{activeTab.role}</span>
                    )}
                  </div>
                </div>
              </div>

              <Link
                href="/login"
                className="text-xs font-medium bg-primary-fixed text-on-primary-fixed-variant px-3 py-1.5 rounded-lg hover:bg-primary-fixed-dim transition-colors"
              >
                Login to Chat Live
              </Link>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <div className="flex justify-center">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant/70 bg-surface-container px-2.5 py-1 rounded-full">
                  Today
                </span>
              </div>

              {interactiveMessages.map((msg) => {
                const isMe = msg.sender === 'me';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[80%] ${
                      isMe ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    {!isMe && activeTab.isGroup && (
                      <span className="text-[10px] font-semibold text-primary mb-0.5 ml-1">
                        {msg.sender}
                      </span>
                    )}
                    <div
                      className={`p-3 text-xs leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-primary text-on-primary rounded-2xl rounded-br-sm'
                          : 'bg-surface-container-high text-on-surface rounded-2xl rounded-bl-sm'
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
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSendMock}
              className="p-3 bg-surface-container-lowest border-t border-outline-variant/30 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeTab.name}... (Press Enter)`}
                className="flex-1 bg-surface-container-low text-xs rounded-xl py-2.5 px-3.5 text-on-surface border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-9 h-9 bg-primary text-on-primary rounded-xl flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 transition-all cursor-pointer"
                title="Send simulated message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
