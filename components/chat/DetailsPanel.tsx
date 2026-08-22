'use client';

import React, { useState } from 'react';
import { Conversation, GroupConversation } from '@/types/chat';
import { User } from '@/types/user';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  Phone,
  Mail,
  Bell,
  BellOff,
  UserPlus,
  Edit2,
  Shield,
  Trash2,
  LogOut,
  Ban,
  Flag,
  Share2,
  Info,
  ChevronRight,
  Crown
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface DetailsPanelProps {
  conversation: Conversation;
  currentUser: User | null;
  onClose: () => void;
  onOpenAddMembers?: () => void;
  onOpenRenameGroup?: () => void;
  onRemoveMember?: (userId: string) => Promise<void>;
  onPromoteAdmin?: (userId: string) => Promise<void>;
  onLeaveGroup?: () => Promise<void>;
}

const SHARED_MEDIA_DEMO = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=200&auto=format&fit=crop&q=80',
];

export function DetailsPanel({
  conversation,
  currentUser,
  onClose,
  onOpenAddMembers,
  onOpenRenameGroup,
  onRemoveMember,
  onPromoteAdmin,
  onLeaveGroup,
}: DetailsPanelProps) {
  const { success, info } = useToast();
  const [isMuted, setIsMuted] = useState(false);

  const isGroup = conversation.type === 'group';
  const group = isGroup ? (conversation as GroupConversation) : null;

  const title = (isGroup ? group?.name : conversation.participant?.name) || 'User';
  const phone = isGroup ? '' : conversation.participant?.phone || '';
  const email = isGroup
    ? `${group?.participants?.length || 0} active members`
    : `${title.toLowerCase().replace(/\s+/g, '.')}@example.com`;

  // Check if current user is an admin of the group
  const isCurrentUserAdmin =
    isGroup &&
    currentUser &&
    group?.admins?.some((adminId) => adminId === currentUser._id || adminId === (currentUser as any).id);

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    info(isMuted ? 'Notifications unmuted' : 'Notifications muted');
  };

  return (
    <div className="w-full lg:w-80 xl:w-88 h-full bg-surface-container-low border-l border-outline-variant/30 flex flex-col shrink-0 select-none overflow-y-auto z-20 animate-in slide-in-from-right-3 duration-200">
      {/* Top Header */}
      <div className="h-16 px-5 border-b border-outline-variant/30 flex items-center justify-between shrink-0 bg-surface-container-low sticky top-0 z-10">
        <span className="text-sm font-bold text-on-surface">Details</span>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Profile Header */}
      <div className="p-6 flex flex-col items-center text-center border-b border-outline-variant/20">
        <div className="relative mb-3">
          <Avatar
            name={title}
            isGroup={isGroup}
            isOnline={!isGroup ? true : undefined}
            size="2xl"
          />
        </div>

        <div className="flex items-center gap-1.5 justify-center mb-1">
          <h3 className="text-lg font-bold text-on-surface truncate max-w-[220px]">
            {title}
          </h3>
          {isGroup && isCurrentUserAdmin && onOpenRenameGroup && (
            <button
              type="button"
              onClick={onOpenRenameGroup}
              className="p-1 text-on-surface-variant hover:text-primary transition-colors rounded-full"
              title="Rename Group"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <p className="text-xs text-on-surface-variant mb-5 font-medium">
          {isGroup ? `${group?.participants?.length || 0} participants` : 'Active on ChatFlow'}
        </p>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3 w-full justify-center">
          <button
            type="button"
            onClick={handleToggleMute}
            className="flex-1 flex flex-col items-center gap-1.5 p-2.5 bg-surface-container-lowest hover:bg-surface-container-high rounded-xl border border-outline-variant/30 transition-all shadow-sm"
          >
            {isMuted ? (
              <BellOff className="w-4 h-4 text-primary" />
            ) : (
              <Bell className="w-4 h-4 text-primary" />
            )}
            <span className="text-[11px] font-semibold text-on-surface">
              {isMuted ? 'Unmute' : 'Mute'}
            </span>
          </button>

          {isGroup && isCurrentUserAdmin && onOpenAddMembers && (
            <button
              type="button"
              onClick={onOpenAddMembers}
              className="flex-1 flex flex-col items-center gap-1.5 p-2.5 bg-surface-container-lowest hover:bg-surface-container-high rounded-xl border border-outline-variant/30 transition-all shadow-sm"
            >
              <UserPlus className="w-4 h-4 text-primary" />
              <span className="text-[11px] font-semibold text-on-surface">+ Members</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Contact Info Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/20 shadow-sm space-y-3.5">
          <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            {isGroup ? 'Group Information' : 'Contact Information'}
          </div>

          {!isGroup && phone && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-on-surface truncate">{phone}</span>
                <span className="text-[10px] text-on-surface-variant font-medium">Mobile</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-on-surface truncate">{email}</span>
              <span className="text-[10px] text-on-surface-variant font-medium">
                {isGroup ? 'Channel Type' : 'Work Email'}
              </span>
            </div>
          </div>
        </div>

        {/* Group Participants Section */}
        {isGroup && group && (
          <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/20 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Members ({group.participants?.length || 0})
              </span>
              {isCurrentUserAdmin && onOpenAddMembers && (
                <button
                  type="button"
                  onClick={onOpenAddMembers}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  + Add
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {group.participants?.map((member) => {
                const isAdmin = group.admins?.includes(member._id);
                const isMemberMe = member._id === currentUser?._id;

                return (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar name={member.name} size="sm" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-on-surface truncate">
                          {member.name} {isMemberMe && '(You)'}
                        </span>
                        <span className="text-[10px] text-on-surface-variant truncate">
                          {member.phone}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isAdmin ? (
                        <Badge variant="primary" size="sm" className="gap-1">
                          <Crown className="w-3 h-3" />
                          Admin
                        </Badge>
                      ) : (
                        isCurrentUserAdmin && (
                          <div className="flex items-center gap-1">
                            {onPromoteAdmin && (
                              <button
                                type="button"
                                onClick={() => onPromoteAdmin(member._id)}
                                className="p-1 hover:bg-primary-fixed text-primary rounded"
                                title="Promote to Admin"
                              >
                                <Crown className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onRemoveMember && (
                              <button
                                type="button"
                                onClick={() => onRemoveMember(member._id)}
                                className="p-1 hover:bg-error-container text-error rounded"
                                title="Remove Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Shared Media Mock Showcase */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/20 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Shared Media
            </span>
            <button
              type="button"
              onClick={() => info('Opening media gallery')}
              className="text-xs font-semibold text-primary hover:underline"
            >
              See All
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {SHARED_MEDIA_DEMO.map((url, i) => (
              <div
                key={i}
                className="aspect-square bg-surface-container-high rounded-xl overflow-hidden shadow-sm"
              >
                <img
                  src={url}
                  alt="Shared media preview"
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions / Danger zone */}
        <div className="bg-surface-container-lowest rounded-2xl p-2 border border-outline-variant/20 shadow-sm space-y-1">
          {isGroup && onLeaveGroup && (
            <button
              type="button"
              onClick={onLeaveGroup}
              className="w-full flex items-center justify-between p-3 text-error hover:bg-error-container/30 rounded-xl transition-colors text-xs font-semibold text-left"
            >
              <span>Leave Group</span>
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {!isGroup && (
            <>
              <button
                type="button"
                onClick={() => info('User blocked')}
                className="w-full flex items-center justify-between p-3 text-error hover:bg-error-container/30 rounded-xl transition-colors text-xs font-semibold text-left"
              >
                <span>Block User</span>
                <Ban className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => info('Report submitted')}
                className="w-full flex items-center justify-between p-3 text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors text-xs font-semibold text-left"
              >
                <span>Report Contact</span>
                <Flag className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
