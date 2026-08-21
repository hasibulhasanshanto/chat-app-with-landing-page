'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  MessageSquare,
  Sparkles,
  Zap,
  ShieldCheck,
  Users,
  ArrowRight,
  Send,
  CheckCheck,
  Circle,
  Globe,
  Radio,
  Lock,
  MessageCircle,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

import { useMounted } from '@/hooks/useMounted';

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
      { id: 2, sender: 'me', text: "Yes, absolutely! I've updated the figma components.", time: '10:43 AM' },
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

export default function LandingPage() {
  const mounted = useMounted();
  const { isAuthenticated, user } = useAuth();
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
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-md shadow-primary/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-on-surface tracking-tight leading-none">
                ChatFlow
              </span>
              <span className="text-[10px] uppercase font-semibold text-primary tracking-widest mt-0.5">
                Real-time Messaging
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
            <a href="#demo" className="hover:text-primary transition-colors">Interactive Demo</a>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#architecture" className="hover:text-primary transition-colors">Architecture</a>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            {mounted && isAuthenticated ? (
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 bg-primary text-on-primary text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md hover:bg-primary/90 hover:shadow-lg transition-all"
              >
                <span>Open Chat</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-on-surface px-4 py-2 rounded-xl hover:bg-surface-container-high transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-primary text-on-primary text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md hover:bg-primary/90 hover:shadow-lg transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-secondary-container/20 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 text-on-surface px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Next.js 16 + WebSockets Real-Time Platform</span>
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-on-surface tracking-tight leading-[1.1] mb-6">
              Seamless Conversations. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary via-indigo-600 to-sky-500 bg-clip-text text-transparent">
                Instant Collaboration.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed mb-8 max-w-2xl mx-auto">
              Experience lightning-fast 1-on-1 and group messaging with optimistic UI, live presence indicators, user search, and enterprise-grade reliability.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold text-base px-7 py-3.5 rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <span>Start Chatting Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface-container-lowest text-on-surface border border-outline-variant/40 font-semibold text-base px-6 py-3.5 rounded-xl hover:bg-surface-container-high shadow-sm hover:shadow transition-all"
              >
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span>Try Live Preview</span>
              </a>
            </div>

            {/* Trust Metrics */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-10 pt-8 border-t border-outline-variant/30 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-on-surface">&lt; 30ms</div>
                <div className="text-xs text-on-surface-variant font-medium">Socket Latency</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-on-surface">100%</div>
                <div className="text-xs text-on-surface-variant font-medium">Live Synced</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-on-surface">JWT</div>
                <div className="text-xs text-on-surface-variant font-medium">Secure Auth</div>
              </div>
            </div>
          </div>

          {/* Interactive Live Teaser Component */}
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
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
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
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-16 bg-surface-container-low border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mb-3">
              Engineered for Speed, Clarity, and Scale
            </h2>
            <p className="text-sm text-on-surface-variant">
              Built with Next.js 16 App Router, Tailwind CSS, and Socket.io for an uncompromising communication experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-on-surface mb-2">Real-Time WebSockets</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Bi-directional Socket.io connection delivering instant messages, real-time group updates, and optimistic UI synchronization.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-on-surface mb-2">Dynamic Group Channels</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Create multi-member groups, manage participants, assign admin privileges, and rename channels seamlessly in real time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-on-surface mb-2">Enterprise Security</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                JWT Bearer authentication on every request and WebSocket handshake with automatic session verification and refresh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-surface relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-primary to-indigo-700 text-on-primary rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-white">
                Ready to Experience ChatFlow?
              </h2>
              <p className="text-sm text-indigo-100 mb-6 leading-relaxed">
                Join with your name and phone number in seconds. No complex setup or password required.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-white text-primary font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg hover:bg-indigo-50 transition-all active:scale-[0.98]"
              >
                <span>Launch ChatFlow Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-surface-container-lowest border-t border-outline-variant/30 text-xs text-on-surface-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-on-primary text-xs font-bold">
              CF
            </div>
            <span className="font-semibold text-on-surface">ChatFlow</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-primary transition-colors">
              Log In
            </Link>
            <Link href="/chat" className="hover:text-primary transition-colors">
              Chat Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
