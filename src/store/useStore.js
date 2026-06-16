import { create } from 'zustand';

export const useGameStore = create((set) => ({
  currentUser: null,
  currentLevel: 1,
  streak: 0,
  failedQuestions: [],
  savedTestIndex: 0,
  xp: 0,
  inventory: { eraser: 0, shield: 0 },
  view: 'loading',
  
  setCurrentUser: (user) => set({ currentUser: user }),
  setCurrentLevel: (level) => set((state) => ({ currentLevel: typeof level === 'function' ? level(state.currentLevel) : level })),
  setStreak: (s) => set((state) => ({ streak: typeof s === 'function' ? s(state.streak) : s })),
  setFailedQuestions: (f) => set((state) => ({ failedQuestions: typeof f === 'function' ? f(state.failedQuestions) : f })),
  setSavedTestIndex: (idx) => set((state) => ({ savedTestIndex: typeof idx === 'function' ? idx(state.savedTestIndex) : idx })),
  setXp: (xp) => set((state) => ({ xp: typeof xp === 'function' ? xp(state.xp) : xp })),
  earnXp: (amount) => set((state) => ({ xp: state.xp + amount })),
  setInventory: (inv) => set((state) => ({ inventory: typeof inv === 'function' ? inv(state.inventory) : inv })),
  setView: (v) => set((state) => ({ view: typeof v === 'function' ? v(state.view) : v })),
  
  hydrateProfile: (data) => set(data),
}));
