import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useIssueStore } from '@/store/issueStore'
import { CategoryBadge, StatusBadge } from '@/components/common/CategoryBadge'

// Fix default marker icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Colored markers by status
function createColorIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

const statusColor: Record<string, string> = {
  open: '#ef4444',
  verified: '#3b82f6',
  in_progress: '#f59e0b',
  resolved: '#22c55e',
}

// Auto-fly to user's location on load
function LocateMe() {
  const map = useMap()
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        try {
          map.flyTo([coords.latitude, coords.longitude], 13)
        } catch {
          // map may have unmounted
        }
      },
      () => {}
    )
  }, [map])
  return null
}

export default function MapPage() {
  const { issues, subscribeToIssues } = useIssueStore()

  useEffect(() => {
    const unsub = subscribeToIssues()
    return unsub
  }, [subscribeToIssues])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Issue Map</h1>
        <div className="flex gap-3 text-xs text-gray-600">
          {Object.entries(statusColor).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
              <span className="capitalize">{status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      <MapContainer
        center={[28.6139, 77.209]}
        zoom={12}
        style={{ height: 'calc(100vh - 160px)', width: '100%', borderRadius: '12px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocateMe />
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.location.lat, issue.location.lng]}
            icon={createColorIcon(statusColor[issue.status] ?? '#6b7280')}
          >
            <Popup>
              <div className="min-w-[180px] space-y-1">
                <div className="flex gap-1 flex-wrap">
                  <CategoryBadge category={issue.category} />
                  <StatusBadge status={issue.status} />
                </div>
                <p className="font-semibold text-sm text-gray-900">{issue.title}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{issue.description}</p>
                {issue.mediaUrls[0] && (
                  <img src={issue.mediaUrls[0]} className="rounded w-full h-24 object-cover mt-1" />
                )}
                <p className="text-xs text-gray-400">
                  👍 {issue.upvotes.length} · ✓ {issue.verifications.length}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
