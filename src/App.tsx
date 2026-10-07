import React, { useState, useEffect } from 'react';
import { UserRole, Language, EmergencyCase, EmergencyType } from './types';
import { getStoredCases, getActiveCitizenCaseId, setActiveCitizenCaseId, resetDemoData, saveCase } from './utils/storage';
import { processCaseWithAI } from './utils/aiEngine';
import { Header } from './components/Header';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { DemoControlPanel } from './components/DemoControlPanel';
import { CitizenHome } from './components/citizen/CitizenHome';
import { ReportFlow } from './components/citizen/ReportFlow';
import { AiProcessingModal } from './components/citizen/AiProcessingModal';
import { CitizenStatusView } from './components/citizen/CitizenStatusView';
import { ResponderDashboard } from './components/responder/ResponderDashboard';

export const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('citizen');
  const [lang, setLang] = useState<Language>('en');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [isLargeText, setIsLargeText] = useState<boolean>(false);

  const [cases, setCases] = useState<EmergencyCase[]>([]);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);

  // Citizen views: 'home' | 'report' | 'ai_processing' | 'status'
  const [citizenView, setCitizenView] = useState<'home' | 'report' | 'ai_processing' | 'status'>('home');
  const [initialReportType, setInitialReportType] = useState<EmergencyType>('accident');
  const [newlyCreatedCase, setNewlyCreatedCase] = useState<EmergencyCase | null>(null);

  // Responder selected case modal
  const [selectedResponderCase, setSelectedResponderCase] = useState<EmergencyCase | null>(null);

  const refreshData = () => {
    const loadedCases = getStoredCases();
    setCases(loadedCases);
    const activeId = getActiveCitizenCaseId();
    setActiveCaseId(activeId);
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener('resq_cases_updated', handleUpdate);
    return () => window.removeEventListener('resq_cases_updated', handleUpdate);
  }, []);

  // Find active case for citizen
  const activeCitizenCase = cases.find(c => c.id === activeCaseId) || (cases.length > 0 ? cases[0] : null);

  const handleStartReport = (type?: EmergencyType) => {
    if (type) setInitialReportType(type);
    setCitizenView('report');
  };

  const handleReportSubmit = (data: {
    emergencyType: EmergencyType;
    description: string;
    peopleAffected: number;
    location: any;
    imageUrl?: string;
  }) => {
    // Run AI processing engine
    const processed = processCaseWithAI(data);
    saveCase(processed);
    setNewlyCreatedCase(processed);
    setActiveCaseId(processed.id);
    setActiveCitizenCaseId(processed.id);
    refreshData();
    setCitizenView('ai_processing');
  };

  const handleAiModalComplete = () => {
    setCitizenView('status');
  };

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white ${
      highContrast ? 'high-contrast' : ''
    } ${isLargeText ? 'text-lg' : ''}`}>
      
      {/* Header Navigation */}
      <Header
        role={role}
        setRole={setRole}
        lang={lang}
        setLang={setLang}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        isLargeText={isLargeText}
        setIsLargeText={setIsLargeText}
        activeCaseCount={cases.filter(c => c.status !== 'Resolved').length}
      />

      {/* Prototype Safety Disclaimer */}
      <DisclaimerBanner lang={lang} />

      {/* Global Interactive Demo Control Panel */}
      <DemoControlPanel
        onRefreshCases={refreshData}
        onSelectCase={(c) => {
          if (role === 'responder') setSelectedResponderCase(c);
          else {
            setActiveCaseId(c.id);
            setCitizenView('status');
          }
        }}
      />

      {/* Main Content Router */}
      <main className="flex-1 pb-12">
        {role === 'citizen' ? (
          <div>
            {citizenView === 'home' && (
              <CitizenHome
                lang={lang}
                onStartReport={handleStartReport}
                activeCase={activeCitizenCase}
                onViewCaseStatus={(caseId) => {
                  setActiveCaseId(caseId);
                  setCitizenView('status');
                }}
              />
            )}

            {citizenView === 'report' && (
              <ReportFlow
                lang={lang}
                initialType={initialReportType}
                onBack={() => setCitizenView('home')}
                onSubmit={handleReportSubmit}
              />
            )}

            {citizenView === 'ai_processing' && newlyCreatedCase && (
              <AiProcessingModal
                lang={lang}
                createdCase={newlyCreatedCase}
                onComplete={handleAiModalComplete}
              />
            )}

            {citizenView === 'status' && (
              <CitizenStatusView
                lang={lang}
                caseItem={activeCitizenCase || cases[0]}
                onBackToHome={() => setCitizenView('home')}
              />
            )}
          </div>
        ) : (
          <ResponderDashboard
            cases={cases}
            onRefreshCases={refreshData}
            selectedCase={selectedResponderCase}
            setSelectedCase={setSelectedResponderCase}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-center text-xs space-y-1">
        <p className="font-bold text-slate-300">
          ResQ AI — Emergency Case Intelligence & Response Platform
        </p>
        <p className="text-slate-500">
          College / Hackathon Prototype Presentation • Built with React, Vite & Tailwind CSS
        </p>
      </footer>

    </div>
  );
};
