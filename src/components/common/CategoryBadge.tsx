import clsx from 'clsx'
import type { IssueCategory, IssueStatus } from '@/types'

const categoryColors: Record<IssueCategory, string> = {
  pothole: 'bg-orange-100 text-orange-700',
  water_leakage: 'bg-blue-100 text-blue-700',
  streetlight: 'bg-yellow-100 text-yellow-700',
  waste: 'bg-red-100 text-red-700',
  road_damage: 'bg-stone-100 text-stone-700',
  tree_hazard: 'bg-green-100 text-green-700',
  other: 'bg-gray-100 text-gray-600',
}

const categoryLabels: Record<IssueCategory, string> = {
  pothole: 'Pothole',
  water_leakage: 'Water Leakage',
  streetlight: 'Streetlight',
  waste: 'Waste',
  road_damage: 'Road Damage',
  tree_hazard: 'Tree Hazard',
  other: 'Other',
}

const statusColors: Record<IssueStatus, string> = {
  open: 'bg-red-100 text-red-700',
  verified: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
}

export function CategoryBadge({ category }: { category: IssueCategory }) {
  return (
    <span className={clsx('badge', categoryColors[category])}>
      {categoryLabels[category]}
    </span>
  )
}

export function StatusBadge({ status }: { status: IssueStatus }) {
  return (
    <span className={clsx('badge capitalize', statusColors[status])}>
      {status.replace('_', ' ')}
    </span>
  )
}
