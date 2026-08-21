'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { searchUsersApi } from '@/lib/api/users';
import { SearchedUser, User } from '@/types/user';
import { Search, Loader2, Users, Check, X, ArrowRight, AlertCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface NewGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onCreateGroup: (name: string, participantIds: string[]) => Promise<void>;
}

export function NewGroupModal({
  isOpen,
  onClose,
  currentUser,
  onCreateGroup,
}: NewGroupModalProps) {
  const { error: toastError } = useToast();
  const [groupName, setGroupName] = useState('');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<SearchedUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setGroupName('');
      setQuery('');
      setSearchResults([]);
      setSelectedUsers([]);
      setValidationError(null);
      return;
    }

    // Initial search to give suggestions
    const fetchInitialUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const users = await searchUsersApi('a');
        const filtered = users.filter((u) => u._id !== currentUser?._id);
        setSearchResults(filtered);
      } catch (err) {
        console.error('Initial user fetch error:', err);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchInitialUsers();
  }, [isOpen, currentUser]);

  // Search when query changes
  useEffect(() => {
    if (!isOpen) return;
    const trimmed = query.trim();
    if (!trimmed) return;

    const timer = setTimeout(async () => {
      setIsLoadingUsers(true);
      try {
        const users = await searchUsersApi(trimmed);
        const filtered = users.filter((u) => u._id !== currentUser?._id);
        setSearchResults(filtered);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoadingUsers(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isOpen, currentUser]);

  const toggleUserSelection = (user: SearchedUser) => {
    setValidationError(null);
    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u._id === user._id);
      if (exists) {
        return prev.filter((u) => u._id !== user._id);
      } else {
        return [...prev, user];
      }
    });
  };

  const removeUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const name = groupName.trim();
    if (!name) {
      setValidationError('Please enter a group name');
      return;
    }

    if (selectedUsers.length < 2) {
      setValidationError('A group needs at least 3 total members (you + 2 others). Please select at least 2 participants.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateGroup(
        name,
        selectedUsers.map((u) => u._id)
      );
      onClose();
    } catch (err: any) {
      const msg = err?.message || 'Failed to create group';
      setValidationError(msg);
      toastError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Group Chat"
      description="Create a channel with at least 2 other team members"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 flex flex-col gap-4">
        {/* Group Name Field */}
        <div className="space-y-1.5 flex flex-col w-full">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Group Name
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => {
              setGroupName(e.target.value);
              setValidationError(null);
            }}
            placeholder="e.g. Design Team, Product Sync, Marketing..."
            required
            className="w-full bg-surface-container-low text-on-surface text-sm rounded-xl py-2.5 px-4 border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-surface-container-lowest transition-all placeholder:text-on-surface-variant/40"
          />
        </div>

        {/* Selected Participants Chips Bar */}
        {selectedUsers.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-on-surface-variant font-semibold">
              <span>Selected Participants ({selectedUsers.length})</span>
              <span className="text-[11px] text-primary">Minimum 2 required</span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-2 bg-surface-container-low rounded-xl max-h-24 overflow-y-auto">
              {selectedUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-1.5 bg-secondary-container text-on-secondary-container pl-2 pr-1.5 py-1 rounded-full text-xs font-semibold animate-in fade-in zoom-in-95 duration-150"
                >
                  <Avatar name={user.name} size="xs" />
                  <span className="truncate max-w-[120px]">{user.name}</span>
                  <button
                    type="button"
                    onClick={() => removeUser(user._id)}
                    className="w-4 h-4 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Contacts to Add */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Add Members
          </label>
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search contacts by name..."
              className="w-full bg-surface-container-low text-on-surface text-sm rounded-xl py-2 pl-10 pr-4 border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-on-surface-variant/40"
            />
          </div>
        </div>

        {/* Search / Contact Results List */}
        <div className="max-h-48 overflow-y-auto space-y-1 border border-outline-variant/20 rounded-xl p-1 bg-surface-container-lowest">
          {isLoadingUsers ? (
            <div className="p-6 text-center text-xs text-on-surface-variant flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Loading contacts...</span>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-6 text-center text-xs text-on-surface-variant">
              No contacts found matching your search.
            </div>
          ) : (
            searchResults.map((user) => {
              const isSelected = selectedUsers.some((u) => u._id === user._id);
              return (
                <label
                  key={user._id}
                  onClick={() => toggleUserSelection(user)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-primary-fixed text-on-primary-container font-medium'
                      : 'hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar name={user.name} size="sm" isOnline={true} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold truncate">{user.name}</span>
                      <span className="text-[10px] opacity-70 truncate font-mono">{user.phone}</span>
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
                </label>
              );
            })
          )}
        </div>

        {/* Validation Error banner */}
        {validationError && (
          <div className="p-3 rounded-xl bg-error-container/60 border border-error/30 text-on-error-container text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-error shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

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
            disabled={isSubmitting || selectedUsers.length < 2 || !groupName.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-xl shadow-md hover:bg-primary/90 hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Group...</span>
              </>
            ) : (
              <>
                <span>Create Group ({selectedUsers.length + 1} members)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
