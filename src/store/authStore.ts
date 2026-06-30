import { create } from 'zustand'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, googleProvider, db } from '@/lib/firebase'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  loading: boolean
  init: () => void
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  init: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const ref = doc(db, 'users', firebaseUser.uid)
        const snap = await getDoc(ref)

        if (!snap.exists()) {
          const newUser: Omit<User, 'uid'> = {
            email: firebaseUser.email ?? '',
            displayName: firebaseUser.displayName ?? 'Anonymous',
            photoURL: firebaseUser.photoURL ?? undefined,
            points: 0,
            badges: [],
            issuesReported: 0,
            issuesVerified: 0,
            createdAt: new Date(),
          }
          await setDoc(ref, { ...newUser, createdAt: serverTimestamp() })
          set({ user: { uid: firebaseUser.uid, ...newUser }, loading: false })
        } else {
          const data = snap.data()
          set({
            user: {
              uid: firebaseUser.uid,
              ...data,
              createdAt: data.createdAt?.toDate?.() ?? new Date(),
            } as User,
            loading: false,
          })
        }
      } else {
        set({ user: null, loading: false })
      }
    })
  },

  loginWithGoogle: async () => {
    await signInWithPopup(auth, googleProvider)
  },

  logout: async () => {
    await signOut(auth)
    set({ user: null })
  },
}))
