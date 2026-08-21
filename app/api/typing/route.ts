import { NextResponse } from 'next/server';

interface TyperRecord {
  userId: string;
  name: string;
  conversationId: string;
  isTyping: boolean;
  updatedAt: number;
}

// Global in-memory storage for active typing users strictly isolated per conversationId
const activeTypers = new Map<string, TyperRecord>();

// Global SSE clients list
type SSEListener = (data: TyperRecord) => void;
const sseListeners = new Set<SSEListener>();

export function notifyTypingChange(record: TyperRecord) {
  for (const listener of sseListeners) {
    try {
      listener(record);
    } catch (e) {
      // ignore
    }
  }
}

export function addTypingListener(listener: SSEListener) {
  sseListeners.add(listener);
  return () => {
    sseListeners.delete(listener);
  };
}

// Clean up stale typing records (older than 3.5 seconds)
function cleanupStale() {
  const now = Date.now();
  for (const [key, record] of activeTypers.entries()) {
    if (now - record.updatedAt > 3500) {
      activeTypers.delete(key);
    }
  }
}

export async function GET(request: Request) {
  cleanupStale();
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId');

  const now = Date.now();
  const typingByConversation: Record<string, Array<{ userId: string; name: string }>> = {};

  for (const record of activeTypers.values()) {
    if (record.isTyping && now - record.updatedAt <= 3500) {
      if (!conversationId || record.conversationId === conversationId) {
        if (!typingByConversation[record.conversationId]) {
          typingByConversation[record.conversationId] = [];
        }
        typingByConversation[record.conversationId].push({
          userId: record.userId,
          name: record.name,
        });
      }
    }
  }

  return NextResponse.json({ typingByConversation });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId, userId, name, isTyping } = body;

    if (!conversationId || !userId) {
      return NextResponse.json({ error: 'Missing conversationId or userId' }, { status: 400 });
    }

    const key = `${conversationId}:${userId}`;
    const record: TyperRecord = {
      conversationId,
      userId,
      name: name || 'Someone',
      isTyping: Boolean(isTyping),
      updatedAt: Date.now(),
    };

    if (isTyping) {
      activeTypers.set(key, record);
    } else {
      activeTypers.delete(key);
    }

    // Notify real-time SSE stream listeners strictly with conversationId
    notifyTypingChange(record);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
