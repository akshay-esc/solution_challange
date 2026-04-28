export const kpiData = [
  { id: 1, label: "Active Shipments", value: "24,592", trend: "+12%", isUp: true, color: "#3b82f6", chartData: [{v: 20000}, {v: 21500}, {v: 21000}, {v: 23000}, {v: 23500}, {v: 24000}, {v: 24592}] },
  { id: 2, label: "High-Risk Routes", value: "1,204", trend: "+5%", isUp: false, color: "#ef4444", chartData: [{v: 1050}, {v: 1100}, {v: 1080}, {v: 1150}, {v: 1120}, {v: 1180}, {v: 1204}] },
  { id: 3, label: "On-Time Delivery", value: "94.2%", trend: "-1.1%", isUp: false, color: "#f97316", chartData: [{v: 96.5}, {v: 96.0}, {v: 95.8}, {v: 95.5}, {v: 94.8}, {v: 94.5}, {v: 94.2}] },
  { id: 4, label: "Est. Value at Risk", value: "$4.2B", trend: "+0.8%", isUp: false, color: "#8b5cf6", chartData: [{v: 3.8}, {v: 3.9}, {v: 3.85}, {v: 4.0}, {v: 4.1}, {v: 4.15}, {v: 4.2}] }
];

export const alertsData = [
  {
    id: 1,
    type: "critical",
    title: "Category 4 Typhoon Approaching",
    description: "Typhoon Mawar is projected to impact Port of Manila. Divert to Kaohsiung.",
    time: "10 mins ago",
    location: "South China Sea",
    shipmentId: "SHP-105"
  },
  {
    id: 2,
    type: "critical",
    title: "Severe Port Congestion",
    description: "Long Beach wait time is 8 days. Recommend diverting to Port of Oakland.",
    time: "2 hours ago",
    location: "Long Beach, CA",
    shipmentId: "SHP-102"
  },
  {
    id: 3,
    type: "info",
    title: "Suez Canal Transit Normal",
    description: "Clearance rates have returned to standard operational levels.",
    time: "5 hours ago",
    location: "Egypt",
    shipmentId: null
  }
];

export const shipmentsData = [
  { id: "SHP-101", lat: 31.2304, lng: 121.4737, status: "warning", origin: "Shanghai", dest: "Los Angeles", destLat: 34.0522, destLng: -118.2437, progress: 45 },
  { id: "SHP-102", lat: 30.7490, lng: -125.2437, status: "critical", origin: "Shenzhen", originLat: 22.5431, originLng: 114.0579, dest: "Long Beach", destLat: 33.7701, destLng: -118.1937, progress: 85, standbyDest: "Oakland", standbyLat: 37.8044, standbyLng: -122.2712 },
  { id: "SHP-103", lat: 1.3521, lng: 103.8198, status: "normal", origin: "Singapore", dest: "Rotterdam", destLat: 51.9225, destLng: 4.4791, progress: 20 },
  { id: "SHP-104", lat: 51.9225, lng: 4.4791, status: "normal", origin: "New York", dest: "Rotterdam", destLat: 51.9225, destLng: 4.4791, progress: 80 },
  { id: "SHP-105", lat: 18.5995, lng: 125.9842, status: "critical", origin: "Manila", originLat: 14.5995, originLng: 120.9842, dest: "Tokyo", destLat: 35.6762, destLng: 139.6503, progress: 10, standbyDest: "Kaohsiung", standbyLat: 22.6273, standbyLng: 120.3014 },
  { id: "SHP-106", lat: 25.0330, lng: 121.5654, status: "warning", origin: "Taipei", dest: "San Francisco", destLat: 37.7749, destLng: -122.4194, progress: 60 },
  { id: "SHP-107", lat: 29.9792, lng: 32.5321, status: "normal", origin: "Mumbai", dest: "London", destLat: 51.5074, destLng: -0.1278, progress: 50 },
  { id: "SHP-108", lat: 35.6762, lng: 139.6503, status: "normal", origin: "Tokyo", dest: "Sydney", destLat: -33.8688, destLng: 151.2093, progress: 30 },
  { id: "SHP-109", lat: -33.8688, lng: 151.2093, status: "warning", origin: "Sydney", dest: "Singapore", destLat: 1.3521, destLng: 103.8198, progress: 70 },
  { id: "SHP-110", lat: 40.7128, lng: -74.0060, status: "normal", origin: "Rotterdam", dest: "New York", destLat: 40.7128, destLng: -74.0060, progress: 90 },
];
