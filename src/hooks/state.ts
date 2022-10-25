import { HeaderFooterState } from '../types/state'
import create from 'zustand'

export const useHeaderFooter = create<HeaderFooterState>()((set) => ({
  visible: true,
  show: () => set({ visible: true }),
  hide: () => set({ visible: false }),
  toggle: () => set((s) => ({ visible: !s.visible })),
}))
