'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { searchUsersApi } from '@/lib/api/users';
import { SearchedUser, User } from '@/types/user';
import { Search, Loader2, User as UserIcon, MessageSquare } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSelectUser: (userId: string, user: SearchedUser) => Promise<void>;
}

export function NewChatModal({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}: NewChatModalProps) {
  const { error: toastError } = useToast();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search users whenever query changes (with debounce)
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }

    const trimmed = query.trim();
    if (!trimmed) {
      // Try searching generic single letters to get suggestions or clear
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const users = await searchUsersApi(trimmed);
        // Exclude current logged in user
        const filtered = users.filter((u) => u._id !== currentUser?._id);
        setResults(filtered);
      } catch (err: any) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isOpen, currentUser]);

  const handleUserClick = async (user: SearchedUser) => {
    setIsSubmitting(true);
    try {
      await onSelectUser(user._id, user);
      onClose();
    } catch (err: any) {
      toastError(err?.message || 'Failed to start conversation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Conversation"
      description="Search users by name to start a direct message"
      maxWidth="md"
    >
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        {/* Search Input Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type name (e.g. Sarah, Ada, Rafi, John)..."
            autoFocus
            className="w-full bg-surface-container-low text-on-surface text-sm rounded-xl py-3 pl-10 pr-4 border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-surface-container-lowest transition-all placeholder:text-on-surface-variant/40"
          />
          {isLoading && (
            <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
          )}
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto space-y-1">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-on-surface-variant flex flex-col items-center">
              <UserIcon className="w-8 h-8 text-on-surface-variant/40 mb-2" />
              <p className="text-xs font-semibold text-on-surface">Search for contacts</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Type at least one letter of the person&apos;s name above
              </p>
            </div>
          ) : isLoading ? (
            <div className="p-6 text-center text-xs text-on-surface-variant flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Searching users...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant">
              <p className="text-xs font-semibold text-on-surface">No users found</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Try searching with a different name or spelling
              </p>
            </div>
          ) : (
            results.map((u) => (
              <button
                key={u._id}
                type="button"
                disabled={isSubmitting}
                onClick={() => handleUserClick(u)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-colors text-left group cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={u.name} size="md" isOnline={true} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                      {u.name}
                    </span>
                    <span className="text-xs text-on-surface-variant truncate font-mono">
                      {u.phone}
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
