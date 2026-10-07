export type EmergencyType = 'accident' | 'fire' | 'medical' | 'crime' | 'disaster' | 'other';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type CaseStatus = 'Pending' | 'Assigned' | 'En Route' | 'Arrived' | 'Resolved' | 'Escalated';

export type ResponderCapability = 'Medical' | 'Safety/Traffic' | 'Fire/Rescue' | 'Disaster Response';

export interface LocationData {
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface Responder {
  id: string;
  name: string;
  type: 'medical' | 'police' | 'fire' | 'rescue';
  capability: ResponderCapability;
  distanceKm: number;
  etaMinutes: number;
  status: 'Available' | 'Assigned' | 'Offline';
  vehicleNumber: string;
  phone: string;
  locationName: string;
  coords: { lat: number; lng: number };
}

export interface CaseTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description?: string;
  actor?: string;
}

export interface EmergencyCase {
  id: string;
  emergencyType: EmergencyType;
  description: string;
  voiceTranscript?: string;
  imageUrl?: string;
  location: LocationData;
  peopleAffected: number;
  priority: PriorityLevel;
  priorityReason: string;
  aiSummary: string;
  recommendedResponse: string;
  recommendedResponderId?: string;
  confidence: 'High' | 'Medium';
  assignedResponder?: Responder;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  timeline: CaseTimelineEvent[];
  isDemo?: boolean;
}

export type Language = 'en' | 'ta' | 'hi';

export type UserRole = 'citizen' | 'responder';
