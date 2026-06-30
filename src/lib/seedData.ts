import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

const sampleIssues = [
  {
    title: 'Large pothole on Rajpur Road',
    description: 'A massive pothole near the Clock Tower junction has been causing accidents. Multiple vehicles have been damaged. Needs immediate repair.',
    category: 'pothole',
    status: 'open',
    priority: 'critical',
    location: { lat: 30.3165, lng: 78.0322 },
    address: 'Rajpur Road, near Clock Tower, Dehradun, Uttarakhand',
    mediaUrls: ['https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Pothole_on_road.jpg/640px-Pothole_on_road.jpg'],
    reportedBy: 'sample_user_1',
    reporterName: 'Aarav Sharma',
    upvotes: ['u1', 'u2', 'u3', 'u4'],
    verifications: ['u1', 'u2', 'u3'],
    ward: 'Ward 12',
    aiAnalysis: {
      detectedCategory: 'pothole',
      confidence: 0.96,
      description: 'Large pothole detected on road surface. High risk of vehicle damage and accidents.',
      suggestedPriority: 'critical',
      tags: ['road', 'pothole', 'accident-risk', 'urgent'],
    },
  },
  {
    title: 'Broken streetlight near ISBT',
    description: 'Three consecutive streetlights near ISBT Dehradun have been non-functional for 2 weeks. The area is very dark at night creating safety concerns.',
    category: 'streetlight',
    status: 'verified',
    priority: 'high',
    location: { lat: 30.3255, lng: 78.0458 },
    address: 'ISBT Road, Dehradun, Uttarakhand',
    mediaUrls: ['https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Streetlight_at_night.jpg/640px-Streetlight_at_night.jpg'],
    reportedBy: 'sample_user_2',
    reporterName: 'Priya Negi',
    upvotes: ['u1', 'u3'],
    verifications: ['u1', 'u2', 'u3', 'u4'],
    ward: 'Ward 7',
    aiAnalysis: {
      detectedCategory: 'streetlight',
      confidence: 0.91,
      description: 'Non-functional streetlight detected. Area likely unsafe at night.',
      suggestedPriority: 'high',
      tags: ['streetlight', 'safety', 'night', 'ISBT'],
    },
  },
  {
    title: 'Water pipe burst on Chakrata Road',
    description: 'A major water pipe has burst and water is flooding the road. It has been leaking for 3 days. Significant water wastage and road damage.',
    category: 'water_leakage',
    status: 'in_progress',
    priority: 'high',
    location: { lat: 30.3120, lng: 78.0240 },
    address: 'Chakrata Road, Dehradun, Uttarakhand',
    mediaUrls: ['https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Water_pipe_burst.jpg/640px-Water_pipe_burst.jpg'],
    reportedBy: 'sample_user_3',
    reporterName: 'Rohan Dobhal',
    upvotes: ['u1', 'u2', 'u5'],
    verifications: ['u1', 'u2'],
    ward: 'Ward 3',
    aiAnalysis: {
      detectedCategory: 'water_leakage',
      confidence: 0.88,
      description: 'Burst water pipe causing road flooding and water wastage.',
      suggestedPriority: 'high',
      tags: ['water', 'pipe-burst', 'flooding', 'urgent'],
    },
  },
  {
    title: 'Garbage dump blocking footpath in Paltan Bazaar',
    description: 'Uncollected garbage has piled up for over a week on the main footpath in Paltan Bazaar. Foul smell and health hazard for residents and shopkeepers.',
    category: 'waste',
    status: 'open',
    priority: 'medium',
    location: { lat: 30.3245, lng: 78.0425 },
    address: 'Paltan Bazaar, Dehradun, Uttarakhand',
    mediaUrls: ['https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Garbage_on_street.jpg/640px-Garbage_on_street.jpg'],
    reportedBy: 'sample_user_4',
    reporterName: 'Sunita Rawat',
    upvotes: ['u2', 'u4'],
    verifications: ['u3'],
    ward: 'Ward 5',
    aiAnalysis: {
      detectedCategory: 'waste',
      confidence: 0.93,
      description: 'Large garbage accumulation blocking pedestrian path. Health and hygiene risk.',
      suggestedPriority: 'medium',
      tags: ['garbage', 'waste', 'health-hazard', 'footpath'],
    },
  },
  {
    title: 'Road cave-in near Survey Chowk',
    description: 'A portion of the road has caved in near Survey Chowk after recent rains. The depression is about 2 feet deep and very dangerous for two-wheelers.',
    category: 'road_damage',
    status: 'resolved',
    priority: 'critical',
    location: { lat: 30.3198, lng: 78.0356 },
    address: 'Survey Chowk, Dehradun, Uttarakhand',
    mediaUrls: [],
    reportedBy: 'sample_user_5',
    reporterName: 'Vikram Bisht',
    upvotes: ['u1', 'u2', 'u3', 'u4', 'u5'],
    verifications: ['u1', 'u2', 'u3'],
    ward: 'Ward 9',
    aiAnalysis: {
      detectedCategory: 'road_damage',
      confidence: 0.87,
      description: 'Severe road cave-in detected. Immediate closure and repair required.',
      suggestedPriority: 'critical',
      tags: ['road', 'cave-in', 'rain-damage', 'critical'],
    },
  },
]

export async function seedSampleIssues() {
  try {
    for (const issue of sampleIssues) {
      await addDoc(collection(db, 'issues'), {
        ...issue,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
    console.log('✅ Sample issues seeded successfully!')
    return true
  } catch (err) {
    console.error('Seed failed:', err)
    return false
  }
}
