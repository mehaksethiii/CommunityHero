import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Loader2 } from 'lucide-react'
import type { GeoPoint } from '@/types'

// Fix default marker icons broken by webpack/vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface Props {
  value: GeoPoint | null
  onChange: (point: GeoPoint, address: string) => void
}

function ClickHandler({ onChange }: { onChange: (pt: GeoPoint, addr: string) => void }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng
      const address = await reverseGeocode(lat, lng)
      onChange({ lat, lng }, address)
    },
  })
  return null
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    )
    const data = await res.json()
    return data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  }
}

const defaultCenter: [number, number] = [28.6139, 77.209]

export default function LocationPicker({ value, onChange }: Props) {
  const [detecting, setDetecting] = useState(false)

  const detectLocation = () => {
    setDetecting(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords
        const address = await reverseGeocode(lat, lng)
        onChange({ lat, lng }, address)
        setDetecting(false)
      },
      () => setDetecting(false)
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">Click on the map or detect your location</p>
        <button
          type="button"
          onClick={detectLocation}
          className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium"
          disabled={detecting}
        >
          {detecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
          Detect Location
        </button>
      </div>

      <MapContainer
        center={value ? [value.lat, value.lng] : defaultCenter}
        zoom={value ? 16 : 12}
        style={{ height: '300px', width: '100%', borderRadius: '12px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onChange={onChange} />
        {value && <Marker position={[value.lat, value.lng]} />}
      </MapContainer>
    </div>
  )
}
