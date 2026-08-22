'use client';

import React, { useState } from 'react';
import { getInitials, getAvatarGradient, cn } from '@/lib/utils';
import { Users } from 'lucide-react';

interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isOnline?: boolean;
  isGroup?: boolean;
  className?: string;
}

const SIZE_MAP = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-24 h-24 text-2xl',
};

const BADGE_SIZE_MAP = {
  xs: 'w-2 h-2 border-[1.5px]',
  sm: 'w-2.5 h-2.5 border-[1.5px]',
  md: 'w-3 h-3 border-2',
  lg: 'w-3.5 h-3.5 border-2',
  xl: 'w-4 h-4 border-2',
  '2xl': 'w-5 h-5 border-2',
};

export function Avatar({
  name = '',
  src,
  size = 'md',
  isOnline,
  isGroup = false,
  className,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);
  const gradient = getAvatarGradient(name);

  const showImage = src && !imageError;

  return (
    <div className={cn('relative inline-flex shrink-0 select-none items-center justify-center rounded-full', className)}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-semibold overflow-hidden shadow-sm transition-transform',
          SIZE_MAP[size],
          isGroup
            ? 'bg-gradient-to-br from-indigo-600 to-sky-500 text-white'
            : !showImage
            ? `bg-gradient-to-br ${gradient}`
            : 'bg-surface-container-high'
        )}
      >
        {isGroup ? (
          <Users className={cn(size === 'xs' || size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-6 h-6' : size === '2xl' ? 'w-10 h-10' : 'w-5 h-5')} />
        ) : showImage ? (
          <img
            src={src}
            alt={name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {isOnline !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-surface-container-lowest transition-colors',
            BADGE_SIZE_MAP[size],
            isOnline ? 'bg-emerald-500' : 'bg-zinc-400'
          )}
          title={isOnline ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
}
