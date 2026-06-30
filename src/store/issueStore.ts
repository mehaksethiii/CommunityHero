import { create } from 'zustand'
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  increment,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Issue, IssueCategory, IssueStatus } from '@/types'
import toast from 'react-hot-toast'
import { checkAndAwardBadges } from '@/lib/badges'

// Compress image and return base64 data URL
async function compressImage(file: File, maxWidth: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.src = url
  })
}

interface IssueFilters {
  category: IssueCategory | 'all'
  status: IssueStatus | 'all'
  search: string
}

interface IssueState {
  issues: Issue[]
  loading: boolean
  filters: IssueFilters
  selectedIssue: Issue | null
  subscribeToIssues: () => () => void
  reportIssue: (
    data: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'verifications' | 'mediaUrls'> & { mediaUrls?: string[] },
    mediaFiles: File[]
  ) => Promise<string>
  upvoteIssue: (issueId: string, userId: string) => Promise<void>
  verifyIssue: (issueId: string, userId: string) => Promise<void>
  updateStatus: (issueId: string, status: IssueStatus) => Promise<void>
  setFilters: (filters: Partial<IssueFilters>) => void
  setSelectedIssue: (issue: Issue | null) => void
}

export const useIssueStore = create<IssueState>((set, get) => ({
  issues: [],
  loading: true,
  filters: { category: 'all', status: 'all', search: '' },
  selectedIssue: null,

  subscribeToIssues: () => {
    const q = query(collection(db, 'issues'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const issues: Issue[] = snap.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          ...data,
          createdAt: data['createdAt']?.toDate?.() ?? new Date(),
          updatedAt: data['updatedAt']?.toDate?.() ?? new Date(),
          resolvedAt: data['resolvedAt']?.toDate?.(),
        } as Issue
      })
      set({ issues, loading: false })
    })
    return unsub
  },

  reportIssue: async (data, mediaFiles) => {
    // Convert images to base64 and store in Firestore directly
    const mediaUrls: string[] = []
    for (const file of mediaFiles) {
      if (file.type.startsWith('image/')) {
        const compressed = await compressImage(file, 800)
        mediaUrls.push(compressed)
      }
    }

    const docRef = await addDoc(collection(db, 'issues'), {
      ...data,
      mediaUrls,
      upvotes: [],
      verifications: [],
      ward: data.ward ?? null,
      aiAnalysis: data.aiAnalysis ?? null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // increment user's issue count and points
    await updateDoc(doc(db, 'users', data.reportedBy), {
      issuesReported: increment(1),
      points: increment(10),
    })

    // check for new badges
    await checkAndAwardBadges(data.reportedBy)

    toast.success('Issue reported successfully!')
    return docRef.id
  },

  upvoteIssue: async (issueId, userId) => {
    const issue = get().issues.find((i) => i.id === issueId)
    if (!issue) return

    const hasVoted = issue.upvotes.includes(userId)
    await updateDoc(doc(db, 'issues', issueId), {
      upvotes: hasVoted ? arrayRemove(userId) : arrayUnion(userId),
    })
  },

  verifyIssue: async (issueId, userId) => {
    const issueRef = doc(db, 'issues', issueId)
    await updateDoc(issueRef, {
      verifications: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    })

    await updateDoc(doc(db, 'users', userId), {
      issuesVerified: increment(1),
      points: increment(5),
    })

    // check for new badges
    await checkAndAwardBadges(userId)

    // auto-promote to verified if 3+ verifications
    const issue = get().issues.find((i) => i.id === issueId)
    if (issue && issue.verifications.length >= 2) {
      await updateDoc(issueRef, { status: 'verified' })
    }
  },

  updateStatus: async (issueId, status) => {
    await updateDoc(doc(db, 'issues', issueId), {
      status,
      updatedAt: serverTimestamp(),
      ...(status === 'resolved' ? { resolvedAt: serverTimestamp() } : {}),
    })
    toast.success(`Issue marked as ${status}`)
  },

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  setSelectedIssue: (issue) => set({ selectedIssue: issue }),
}))
