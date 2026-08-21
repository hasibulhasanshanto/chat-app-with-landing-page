'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { searchUsersApi } from '@/lib/api/users';
import { SearchedUser, User } from '@/types/user';
import { GroupConversation } from '@/types/chat';
import { Search, Loader2, UserPlus, Edit3, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface ManageGroupModalProps {
  isOpen: boolean;
  mode: 'add_members' | 'rename';
  group: GroupConversation | null;
  currentUser: User | null;
  onClose: () => void;
  onAddMembers?: (userIds: string[]) => Promise<void>;
  onRenameGroup?: (name: string) => Promise<void>;
}

export function ManageGroupModal({
  isOpen,
  mode,
  group,
  currentUser,
  onClose,
  onAddMembers,
  onRenameGroup,
}: ManageGroupModalProps) {
  const { error: toastError } = useToast();
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'rename' && group) {
        setName(group.name);
      } else {
        setName('');
        setQuery('');
        setSelectedUserIds([]);
        // Fetch candidates for adding
        searchUsersApi('a').then((users) => {
          const existingIds = new Set(group?.participants?.map((p) => p._id) || []);
          const available = users.filter((u) => !existingIds.has(u._id));
          setSearchResults(available);
        });
      }
    }
  }, [isOpen, mode, group]);

  // Search when query changes
  useEffect(() => {
    if (!isOpen || mode !== 'add_members') return;
    const trimmed = query.trim();
    if (!trimmed) return;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const users = await searchUsersApi(trimmed);
        const existingIds = new Set(group?.participants?.map((p) => p._id) || []);
        const available = users.filter((u) => !existingIds.has(u._id));
        setSearchResults(available);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isOpen, mode, group]);

  const toggleSelect = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !onRenameGroup) return;

    setIsSubmitting(true);
    try {
      await onRenameGroup(name.trim());
      onClose();
    } catch (err: any) {
      toastError(err?.message || 'Failed to rename group');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserIds.length === 0 || !onAddMembers) return;

    setIsSubmitting(true);
    try {
      await onAddMembers(selectedUserIds);
      onClose();
    } catch (err: any) {
      toastError(err?.message || 'Failed to add members');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === 'rename') {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Rename Group"
        description="Update the name of this conversation channel"
        maxWidth="sm"
      >
        <form onSubmit={handleRenameSubmit} className="p-4 sm:p-6 flex flex-col gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Group Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter new channel name..."
              required
              autoFocus
              className="w-full bg-surface-container-low text-on-surface text-sm rounded-xl py-2.5 px-4 border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-surface-container-lowest transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container-high rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-5 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-xl shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : 'Save Name'}
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Group Members"
      description={`Add more team members to ${group?.name || 'this group'}`}
      maxWidth="md"
    >
      <form onSubmit={handleAddSubmit} className="p-4 sm:p-6 flex flex-col gap-4">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users to add..."
            className="w-full bg-surface-container-low text-on-surface text-sm rounded-xl py-2 pl-10 pr-4 border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* List */}
        <div className="max-h-56 overflow-y-auto space-y-1 border border-outline-variant/20 rounded-xl p-1 bg-surface-container-lowest">
          {isLoading ? (
            <div className="p-6 text-center text-xs text-on-surface-variant flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Searching...</span>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-6 text-center text-xs text-on-surface-variant">
              No new contacts found to add.
            </div>
          ) : (
            searchResults.map((u) => {
              const isSelected = selectedUserIds.includes(u._id);
              return (
                <div
                  key={u._id}
                  onClick={() => toggleSelect(u._id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-primary-fixed text-on-primary-container font-medium'
                      : 'hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar name={u.name} size="sm" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold truncate">{u.name}</span>
                      <span className="text-[10px] opacity-70 truncate font-mono">{u.phone}</span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-primary border-primary text-on-primary'
                        : 'border-outline-variant/50 bg-surface-container-low'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container-high rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || selectedUserIds.length === 0}
            className="px-5 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-xl shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSubmitting ? 'Adding...' : `Add Selected (${selectedUserIds.length})`}
          </button>
        </div>
      </form>
    </Modal>
  );
}
