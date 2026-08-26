'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import {
  MessageSquare,
  MessageCircle,
  Users,
  Settings,
  LogOut,
  MoreVertical,
  User as UserIcon,
  Shield,
  Copy,
  Check
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface AppNavSidebarProps {
  activeTab: 'messages' | 'contacts' | 'settings';
  setActiveTab: (tab: 'messages' | 'contacts' | 'settings') => void;
  onOpenNewChat: () => void;
  onOpenNewGroup: () => void;
}

export function AppNavSidebar({
  activeTab,
  setActiveTab,
  onOpenNewChat,
  onOpenNewGroup,
}: AppNavSidebarProps) {
  const { user, logout } = useAuth();
  const { info } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    if (user?._id) {
      navigator.clipboard.writeText(user._id);
      setCopied(true);
      info('User ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <aside className="w-20 md:w-64 bg-surface-container-low border-r border-outline-variant/30 flex flex-col shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-outline-variant/30">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-md shadow-primary/25 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="font-bold text-base text-on-surface tracking-tight leading-none">
              ChatFlow
            </span>
            <span className="text-[10px] text-on-surface-variant font-medium mt-0.5">
              Live Workspace
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation items */}
      <nav className="p-3 md:p-4 space-y-1.5 flex-1">
        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`w-full flex items-center gap-3.5 px-3 md:px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'messages'
              ? 'bg-primary text-on-primary shadow-md shadow-primary/25'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
          title="Messages"
        >
          <MessageCircle className="w-5 h-5 shrink-0" />
          <span className="hidden md:inline">Messages</span>
        </button>

        <button
          type="button"
          onClick={onOpenNewChat}
          className="w-full flex items-center gap-3.5 px-3 md:px-4 py-3 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
          title="New Conversation"
        >
          <UserIcon className="w-5 h-5 shrink-0" />
          <span className="hidden md:inline">New Direct Chat</span>
        </button>

        <button
          type="button"
          onClick={onOpenNewGroup}
          className="w-full flex items-center gap-3.5 px-3 md:px-4 py-3 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
          title="New Group"
        >
          <Users className="w-5 h-5 shrink-0" />
          <span className="hidden md:inline">New Group</span>
        </button>
      </nav>

      {/* User Profile Bar at Bottom */}
      <div className="p-2 md:p-4 border-t border-outline-variant/30 relative">
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className={`w-full flex items-center justify-center md:justify-between p-2 rounded-xl transition-all cursor-pointer ${
            isMenuOpen
              ? 'bg-surface-container-high ring-2 ring-primary/20'
              : 'hover:bg-surface-container-high/80 active:scale-95'
          }`}
          aria-label="User Profile and Options"
          title={user?.name ? `${user.name} - Profile & Logout` : 'Profile & Logout'}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={user?.name} isOnline={true} size="md" />
            <div className="hidden md:flex flex-col min-w-0 text-left">
              <span className="text-sm font-bold text-on-surface truncate">{user?.name || 'User'}</span>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                {user?.phone || 'Online'}
              </span>
            </div>
          </div>

          <div className="hidden md:flex p-1 text-on-surface-variant hover:text-on-surface">
            <MoreVertical className="w-4 h-4" />
          </div>
        </button>

        {/* User Options Popover */}
        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
            <div className="absolute bottom-full left-2 md:left-4 mb-2 w-60 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-outline-variant/20 mb-1.5">
                <div className="text-xs font-bold text-on-surface truncate">{user?.name || 'User'}</div>
                <div className="text-[10px] text-on-surface-variant font-mono truncate">{user?.phone || ''}</div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyId();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high rounded-xl transition-colors text-left cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <Copy className="w-4 h-4 text-on-surface-variant shrink-0" />}
                <span>{copied ? 'Copied ID' : 'Copy User ID'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-error hover:bg-error-container/40 rounded-xl transition-colors text-left mt-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Log Out</span>
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
