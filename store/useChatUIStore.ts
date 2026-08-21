import { create } from 'zustand';

interface ManageGroupModalState {
  isOpen: boolean;
  mode: 'add_members' | 'rename';
}

interface ChatUIState {
  activeConversationId: string | null;
  isDetailsOpen: boolean;
  activeNavTab: 'messages' | 'contacts' | 'settings';
  mobileView: 'list' | 'chat';

  // Modals
  isNewChatOpen: boolean;
  isNewGroupOpen: boolean;
  manageGroupModal: ManageGroupModalState;

  // Actions
  setActiveConversationId: (id: string | null) => void;
  toggleDetails: () => void;
  setDetailsOpen: (open: boolean) => void;
  setActiveNavTab: (tab: 'messages' | 'contacts' | 'settings') => void;
  setMobileView: (view: 'list' | 'chat') => void;

  openNewChat: () => void;
  closeNewChat: () => void;
  openNewGroup: () => void;
  closeNewGroup: () => void;
  openManageGroup: (mode: 'add_members' | 'rename') => void;
  closeManageGroup: () => void;
}

export const useChatUIStore = create<ChatUIState>((set) => ({
  activeConversationId: null,
  isDetailsOpen: true,
  activeNavTab: 'messages',
  mobileView: 'list',

  isNewChatOpen: false,
  isNewGroupOpen: false,
  manageGroupModal: {
    isOpen: false,
    mode: 'add_members',
  },

  setActiveConversationId: (id) =>
    set({
      activeConversationId: id,
      mobileView: id ? 'chat' : 'list',
    }),

  toggleDetails: () =>
    set((state) => ({ isDetailsOpen: !state.isDetailsOpen })),

  setDetailsOpen: (open) =>
    set({ isDetailsOpen: open }),

  setActiveNavTab: (tab) =>
    set({ activeNavTab: tab }),

  setMobileView: (view) =>
    set({ mobileView: view }),

  openNewChat: () =>
    set({ isNewChatOpen: true }),

  closeNewChat: () =>
    set({ isNewChatOpen: false }),

  openNewGroup: () =>
    set({ isNewGroupOpen: true }),

  closeNewGroup: () =>
    set({ isNewGroupOpen: false }),

  openManageGroup: (mode) =>
    set({
      manageGroupModal: {
        isOpen: true,
        mode,
      },
    }),

  closeManageGroup: () =>
    set({
      manageGroupModal: {
        isOpen: false,
        mode: 'add_members',
      },
    }),
}));
