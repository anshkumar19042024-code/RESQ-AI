import { EmergencyCase, Responder } from '../types';

const STORAGE_KEY_CASES = 'resq_ai_emergency_cases';
const STORAGE_KEY_RESPONDERS = 'resq_ai_responders';
const STORAGE_KEY_ACTIVE_CASE_ID = 'resq_ai_citizen_active_case_id';

export const INITIAL_DEMO_RESPONDERS: Responder[] = [
  {
    id: 'RESP-101',
    name: 'Ambulance A (ALS Unit)',
    type: 'medical',
    capability: 'Medical',
    distanceKm: 2.1,
    etaMinutes: 6,
    status: 'Available',
    vehicleNumber: 'TN-37-AX-1008',
    phone: '+91 98450 11008',
    locationName: 'Avinashi Road Station',
    coords: { lat: 11.0168, lng: 76.9558 }
  },
  {
    id: 'RESP-102',
    name: 'Ambulance B (Cardiac Unit)',
    type: 'medical',
    capability: 'Medical',
    distanceKm: 3.8,
    etaMinutes: 10,
    status: 'Available',
    vehicleNumber: 'TN-37-BX-1009',
    phone: '+91 98450 11009',
    locationName: 'Gandhipuram Medical Base',
    coords: { lat: 11.0183, lng: 76.9654 }
  },
  {
    id: 'RESP-201',
    name: 'Police Patrol Unit A',
    type: 'police',
    capability: 'Safety/Traffic',
    distanceKm: 2.5,
    etaMinutes: 7,
    status: 'Available',
    vehicleNumber: 'TN-37-G-0100',
    phone: '+91 98450 22100',
    locationName: 'Race Course Outpost',
    coords: { lat: 11.0012, lng: 76.9711 }
  },
  {
    id: 'RESP-301',
    name: 'Fire Tender Squad 1',
    type: 'fire',
    capability: 'Fire/Rescue',
    distanceKm: 4.2,
    etaMinutes: 11,
    status: 'Available',
    vehicleNumber: 'TN-37-F-0999',
    phone: '+91 98450 33101',
    locationName: 'RS Puram Fire Station',
    coords: { lat: 11.0110, lng: 76.9500 }
  },
  {
    id: 'RESP-401',
    name: 'SDRF Disaster Response Unit',
    type: 'rescue',
    capability: 'Disaster Response',
    distanceKm: 5.0,
    etaMinutes: 14,
    status: 'Available',
    vehicleNumber: 'TN-37-R-5500',
    phone: '+91 98450 44500',
    locationName: 'HQ Control Base',
    coords: { lat: 11.0250, lng: 76.9800 }
  }
];

export const INITIAL_DEMO_CASES: EmergencyCase[] = [
  {
    id: 'CASE-1042',
    emergencyType: 'accident',
    description: 'Two-wheeler and vehicle collision near college gate. Two individuals injured on road.',
    location: { address: 'Avinashi Road, near PSG College, Coimbatore', latitude: 11.0251, longitude: 76.9972 },
    peopleAffected: 2,
    priority: 'HIGH',
    priorityReason: 'High priority because report mentions a collision and 2 injured casualties.',
    aiSummary: 'Road accident reported on Avinashi Road near college involving 2 affected individuals requiring urgent trauma support.',
    recommendedResponse: 'Dispatch Advanced Life Support Ambulance + Traffic Police Unit.',
    recommendedResponderId: 'RESP-101',
    confidence: 'High',
    assignedResponder: INITIAL_DEMO_RESPONDERS[0],
    status: 'Assigned',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60000).toISOString(),
    timeline: [
      { id: 't1', timestamp: '11:20 AM', title: 'Report Submitted', actor: 'Citizen' },
      { id: 't2', timestamp: '11:20 AM', title: 'AI Case Intelligence Created', description: 'Priority rated HIGH. Medical + Traffic support flagged.', actor: 'ResQ AI' },
      { id: 't3', timestamp: '11:23 AM', title: 'Responder Assigned', description: 'Assigned to Ambulance A (ALS Unit)', actor: 'Control Center' }
    ],
    isDemo: true
  },
  {
    id: 'CASE-1041',
    emergencyType: 'medical',
    description: 'Elderly person collapsed with acute chest pain and difficulty breathing.',
    location: { address: 'Cross Cut Road, Gandhipuram, Coimbatore', latitude: 11.0183, longitude: 76.9654 },
    peopleAffected: 1,
    priority: 'CRITICAL',
    priorityReason: 'Critical priority due to cardiac symptoms (acute chest pain and unconsciousness).',
    aiSummary: 'Critical cardiac medical emergency reported in commercial zone. 1 patient unconscious.',
    recommendedResponse: 'Dispatch ALS Cardiac Ambulance with immediate resuscitation kit.',
    recommendedResponderId: 'RESP-102',
    confidence: 'High',
    assignedResponder: INITIAL_DEMO_RESPONDERS[1],
    status: 'En Route',
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    timeline: [
      { id: 't1', timestamp: '11:05 AM', title: 'Report Submitted', actor: 'Citizen' },
      { id: 't2', timestamp: '11:05 AM', title: 'AI Case Intelligence Created', description: 'Priority rated CRITICAL (Cardiac risk).', actor: 'ResQ AI' },
      { id: 't3', timestamp: '11:07 AM', title: 'Responder Assigned', description: 'Assigned to Ambulance B (Cardiac Unit)', actor: 'Control Center' },
      { id: 't4', timestamp: '11:10 AM', title: 'Responder En Route', description: 'Ambulance B en route with sirens active. ETA 5 min.', actor: 'Ambulance B' }
    ],
    isDemo: true
  },
  {
    id: 'CASE-1040',
    emergencyType: 'fire',
    description: 'Dense smoke and fire outbreak on 2nd floor of commercial building. Multiple people trapped inside.',
    location: { address: 'DB Road, RS Puram, Coimbatore', latitude: 11.0110, longitude: 76.9500 },
    peopleAffected: 5,
    priority: 'HIGH',
    priorityReason: 'High priority due to active fire hazard and 5 trapped occupants.',
    aiSummary: 'Commercial structure fire reported at RS Puram with active smoke propagation. 5 occupants affected.',
    recommendedResponse: 'Dispatch Fire Tender Truck + Rescue Team + Backup Medical.',
    recommendedResponderId: 'RESP-301',
    confidence: 'High',
    status: 'Pending',
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
    timeline: [
      { id: 't1', timestamp: '11:35 AM', title: 'Report Submitted', actor: 'Citizen' },
      { id: 't2', timestamp: '11:35 AM', title: 'AI Case Intelligence Created', description: 'Priority rated HIGH (Structure Fire). Awaiting responder dispatch.', actor: 'ResQ AI' }
    ],
    isDemo: true
  },
  {
    id: 'CASE-1039',
    emergencyType: 'crime',
    description: 'Attempted purse snatching and harassment near bus stop.',
    location: { address: 'Singanallur Bus Stand, Coimbatore', latitude: 11.0020, longitude: 77.0210 },
    peopleAffected: 1,
    priority: 'MEDIUM',
    priorityReason: 'Medium priority public safety report with no immediate major physical injury.',
    aiSummary: 'Safety incident reported at transit hub. Suspect fled area. Victim safe.',
    recommendedResponse: 'Dispatch Police Patrol Unit for area sweep & citizen assistance.',
    recommendedResponderId: 'RESP-201',
    confidence: 'High',
    assignedResponder: INITIAL_DEMO_RESPONDERS[2],
    status: 'Resolved',
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60000).toISOString(),
    timeline: [
      { id: 't1', timestamp: '09:45 AM', title: 'Report Submitted', actor: 'Citizen' },
      { id: 't2', timestamp: '09:45 AM', title: 'AI Case Intelligence Created', actor: 'ResQ AI' },
      { id: 't3', timestamp: '09:48 AM', title: 'Responder Assigned', actor: 'Control Center' },
      { id: 't4', timestamp: '09:55 AM', title: 'Responder En Route', actor: 'Police Patrol Unit A' },
      { id: 't5', timestamp: '10:05 AM', title: 'Responder Arrived', actor: 'Police Patrol Unit A' },
      { id: 't6', timestamp: '10:30 AM', title: 'Case Resolved', description: 'Statement recorded. Suspect description broadcast.', actor: 'Police Patrol Unit A' }
    ],
    isDemo: true
  }
];

function notifyCaseUpdate() {
  window.dispatchEvent(new Event('resq_cases_updated'));
}

export function getStoredCases(): EmergencyCase[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CASES);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(INITIAL_DEMO_CASES));
      return INITIAL_DEMO_CASES;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to parse stored cases', err);
    return INITIAL_DEMO_CASES;
  }
}

export function saveCase(newCase: EmergencyCase): EmergencyCase[] {
  const cases = getStoredCases();
  const existingIdx = cases.findIndex(c => c.id === newCase.id);
  let updated: EmergencyCase[];
  if (existingIdx >= 0) {
    updated = [...cases];
    updated[existingIdx] = newCase;
  } else {
    updated = [newCase, ...cases];
  }
  localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(updated));
  setActiveCitizenCaseId(newCase.id);
  notifyCaseUpdate();
  return updated;
}

export function updateCaseStatus(caseId: string, status: EmergencyCase['status'], assignedResponder?: Responder, note?: string): EmergencyCase | null {
  const cases = getStoredCases();
  const target = cases.find(c => c.id === caseId);
  if (!target) return null;

  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let timelineTitle = `Status updated to ${status}`;
  let actor = 'Responder Control Center';

  if (status === 'Assigned') {
    timelineTitle = 'Responder Assigned';
    actor = assignedResponder ? assignedResponder.name : 'Control Center';
  } else if (status === 'En Route') {
    timelineTitle = 'Responder En Route';
    actor = target.assignedResponder ? target.assignedResponder.name : 'Responder';
  } else if (status === 'Arrived') {
    timelineTitle = 'Responder Arrived on Scene';
    actor = target.assignedResponder ? target.assignedResponder.name : 'Responder';
  } else if (status === 'Resolved') {
    timelineTitle = 'Emergency Case Resolved';
    actor = 'Control Center / Responder';
  } else if (status === 'Escalated') {
    timelineTitle = '⚠️ Emergency Escalated';
    actor = 'System Escalation Engine';
  }

  const updatedTimeline = [
    ...target.timeline,
    {
      id: `tl-${Date.now()}`,
      timestamp: nowTime,
      title: timelineTitle,
      description: note || `Case transition: ${target.status} ➔ ${status}`,
      actor
    }
  ];

  const updatedCase: EmergencyCase = {
    ...target,
    status,
    assignedResponder: assignedResponder || target.assignedResponder,
    updatedAt: new Date().toISOString(),
    timeline: updatedTimeline
  };

  saveCase(updatedCase);
  return updatedCase;
}

export function resetDemoData(): EmergencyCase[] {
  localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(INITIAL_DEMO_CASES));
  localStorage.setItem(STORAGE_KEY_ACTIVE_CASE_ID, 'CASE-1042');
  notifyCaseUpdate();
  return INITIAL_DEMO_CASES;
}

export function getActiveCitizenCaseId(): string | null {
  return localStorage.getItem(STORAGE_KEY_ACTIVE_CASE_ID) || 'CASE-1042';
}

export function setActiveCitizenCaseId(id: string) {
  localStorage.setItem(STORAGE_KEY_ACTIVE_CASE_ID, id);
}

export function getStoredResponders(): Responder[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_RESPONDERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_RESPONDERS, JSON.stringify(INITIAL_DEMO_RESPONDERS));
      return INITIAL_DEMO_RESPONDERS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_DEMO_RESPONDERS;
  }
}
