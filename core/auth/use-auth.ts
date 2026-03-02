import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState, HardcodedUser } from './types'

const HARDCODED_USERS: HardcodedUser[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@easyskytrip.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@easyskytrip.com',
    password: 'manager123',
    role: 'manager',
  },
]

type AuthStateWithHydration = AuthState & {
  _hasHydrated: boolean
  setHasHydrated: (value: boolean) => void
}

export const useAuth = create<AuthStateWithHydration>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setHasHydrated: (value: boolean) => set({ _hasHydrated: value }),

      login: async (email: string, password: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const foundUser = HARDCODED_USERS.find(
              (u) => u.email === email && u.password === password
            )

            if (!foundUser) {
              reject(new Error('Invalid credentials'))
              return
            }

            const { password: _, ...userWithoutPassword } = foundUser

            set({
              user: userWithoutPassword,
              isAuthenticated: true,
            })

            resolve()
          }, 800)
        })
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true)
        }
      },
    }
  )
)
