import { create } from 'zustand';
import type { UserProfile, View } from '../types';
import { clearLocalStorage, getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

interface AppState {
  user: UserProfile | null;
  activeView: View;
  isGameActive: boolean;
  lastView: View;
  
  setUser: (user: UserProfile | null) => void;
  setActiveView: (view: View) => void;
  setGameActive: (active: boolean) => void;
  setLastView: (view: View) => void;
  logout: () => Promise<void>;
  startGame: () => void;
  endGame: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: getFromLocalStorage('current_user', null), // Load initial user state from local storage
  activeView: 'Dashboard',
  isGameActive: false,
  lastView: 'Dashboard',

  setUser: (user) => set({ user }),
  setActiveView: (view) => set({ activeView: view }),
  setGameActive: (active) => set({ isGameActive: active }),
  setLastView: (view) => set({ lastView: view }),
  
  logout: async () => {
    // Clear user data from local storage
    clearLocalStorage('current_user');
    // Optionally clear mock users if desired (for a clean slate)
    clearLocalStorage('mock_users'); 
    set({ user: null, activeView: 'Dashboard', isGameActive: false });
  },

  startGame: () => {
    const { activeView } = get();
    set({ lastView: activeView, isGameActive: true });
  },

  endGame: () => {
    const { lastView } = get();
    set({ isGameActive: false, activeView: lastView });
  }
}));