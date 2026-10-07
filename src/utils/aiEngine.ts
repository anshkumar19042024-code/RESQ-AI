import { EmergencyCase, EmergencyType, PriorityLevel, LocationData, Responder } from '../types';

export interface AIProcessingInput {
  emergencyType: EmergencyType;
  description: string;
  peopleAffected: number;
  location: LocationData;
  imageUrl?: string;
}

export function processCaseWithAI(input: AIProcessingInput): EmergencyCase {
  const text = (input.description || '').toLowerCase();
  const peopleCount = Number(input.peopleAffected) || 1;
  const type = input.emergencyType;

  // Keyword scoring
  const criticalKeywords = ['unconscious', 'bleeding', 'trapped', 'explosion', 'cardiac', 'head injury', 'fatal', 'died', 'shooting', 'weapon', 'severe', 'massive fire'];
  const highKeywords = ['crash', 'accident', 'injured', 'broken', 'burn', 'flames', 'smoke', 'attack', 'robbery', 'disaster', 'submerged', 'help fast'];
  const mediumKeywords = ['pain', 'minor injury', 'property damage', 'theft', 'leak', 'flooding', 'scared'];

  let criticalHits = criticalKeywords.filter(kw => text.includes(kw));
  let highHits = highKeywords.filter(kw => text.includes(kw));
  let mediumHits = mediumKeywords.filter(kw => text.includes(kw));

  let priority: PriorityLevel = 'MEDIUM';
  let priorityReasonParts: string[] = [];

  // Determine Priority
  if (type === 'fire' || type === 'disaster') {
    priority = 'HIGH';
    priorityReasonParts.push(`Hazardous event type (${type.toUpperCase()})`);
  }

  if (criticalHits.length > 0 || (peopleCount >= 4 && (type === 'accident' || type === 'medical' || type === 'fire'))) {
    priority = 'CRITICAL';
    if (criticalHits.length > 0) {
      priorityReasonParts.push(`Detected critical keywords: "${criticalHits.slice(0, 2).join(', ')}"`);
    }
    if (peopleCount >= 4) {
      priorityReasonParts.push(`Multiple casualties reported (${peopleCount} people)`);
    }
  } else if (highHits.length > 0 || peopleCount >= 2 || type === 'accident' || type === 'medical') {
    priority = 'HIGH';
    if (highHits.length > 0) {
      priorityReasonParts.push(`Detected high severity markers: "${highHits.slice(0, 2).join(', ')}"`);
    }
    if (peopleCount >= 2) {
      priorityReasonParts.push(`${peopleCount} people affected`);
    }
  } else if (mediumHits.length > 0 || type === 'crime' || type === 'other') {
    if (priority === 'MEDIUM') {
      priorityReasonParts.push(`Standard priority report with ${peopleCount} person affected`);
    }
  } else {
    priority = 'LOW';
    priorityReasonParts.push('Low immediate physical risk detected from description');
  }

  const priorityReason = priorityReasonParts.length > 0
    ? priorityReasonParts.join(' • ')
    : `${priority} priority calculated based on emergency category and single casualty impact.`;

  // Dynamic AI Summary
  let typeLabel = type === 'accident' ? 'Road Accident' :
                  type === 'fire' ? 'Fire Outbreak' :
                  type === 'medical' ? 'Medical Emergency' :
                  type === 'crime' ? 'Safety/Crime Incident' :
                  type === 'disaster' ? 'Natural Disaster' : 'Emergency Incident';

  let cleanDesc = input.description.trim() ? `"${input.description.trim()}"` : 'No verbal description provided.';
  const aiSummary = `${typeLabel} reported at ${input.location.address || 'Unknown Location'}. ${peopleCount} person(s) affected. AI context: ${cleanDesc}`;

  // Recommended Response
  let recommendedResponse = '';
  let recommendedResponderId = 'RESP-101'; // Default Ambulance A

  switch (type) {
    case 'accident':
      recommendedResponse = 'Dispatch Advanced Life Support Ambulance + Traffic Police Unit for site containment.';
      recommendedResponderId = 'RESP-101';
      break;
    case 'medical':
      recommendedResponse = 'Dispatch ALS Cardiac/Trauma Ambulance with paramedic crew.';
      recommendedResponderId = 'RESP-101';
      break;
    case 'fire':
      recommendedResponse = 'Dispatch Fire Tender Truck + Emergency Rescue Squad + Medical Support.';
      recommendedResponderId = 'RESP-301';
      break;
    case 'crime':
      recommendedResponse = 'Dispatch Rapid Action Patrol Police Unit + Tactical Support.';
      recommendedResponderId = 'RESP-201';
      break;
    case 'disaster':
      recommendedResponse = 'Deploy State Disaster Response Force (SDRF) + Rescue Ambulance.';
      recommendedResponderId = 'RESP-401';
      break;
    default:
      recommendedResponse = 'Dispatch First Response Unit & Control Room Verification.';
      recommendedResponderId = 'RESP-101';
      break;
  }

  const caseId = `CASE-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  return {
    id: caseId,
    emergencyType: type,
    description: input.description,
    imageUrl: input.imageUrl,
    location: input.location,
    peopleAffected: peopleCount,
    priority,
    priorityReason,
    aiSummary,
    recommendedResponse,
    recommendedResponderId,
    confidence: 'High',
    status: 'Pending',
    createdAt: now,
    updatedAt: now,
    timeline: [
      {
        id: `tl-1-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Report Submitted',
        description: `Emergency report received from citizen at ${input.location.address}.`,
        actor: 'Citizen'
      },
      {
        id: `tl-2-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'AI Case Intelligence Generated',
        description: `Priority assigned as ${priority}. Recommendation: ${recommendedResponse}`,
        actor: 'ResQ AI Engine'
      }
    ],
    isDemo: false
  };
}

export function recommendBestResponder(caseItem: EmergencyCase, availableResponders: Responder[]): Responder | undefined {
  if (!availableResponders || availableResponders.length === 0) return undefined;

  // Filter available ones
  const activeAvailable = availableResponders.filter(r => r.status === 'Available');
  const pool = activeAvailable.length > 0 ? activeAvailable : availableResponders;

  // Match by type requirement
  let targetType: 'medical' | 'police' | 'fire' | 'rescue' = 'medical';
  if (caseItem.emergencyType === 'fire') targetType = 'fire';
  else if (caseItem.emergencyType === 'crime') targetType = 'police';
  else if (caseItem.emergencyType === 'disaster') targetType = 'rescue';
  else targetType = 'medical';

  // Find exact type match first
  const typeMatches = pool.filter(r => r.type === targetType);
  if (typeMatches.length > 0) {
    // Return closest distance
    return typeMatches.sort((a, b) => a.distanceKm - b.distanceKm)[0];
  }

  // Fallback to closest available responder
  return pool.sort((a, b) => a.distanceKm - b.distanceKm)[0];
}
