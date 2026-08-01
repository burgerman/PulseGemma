import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DeterministicBanner } from './components/DeterministicBanner';
import { PatientIntakeForm } from './components/PatientIntakeForm';
import { LabReportInspector } from './components/LabReportInspector';
import { VisionInspector } from './components/VisionInspector';
import { GemmaDiagnosticCard } from './components/GemmaDiagnosticCard';
import { GroundTruthEvidenceViewer } from './components/GroundTruthEvidenceViewer';
import { WorkflowDebugger } from './components/WorkflowDebugger';
import { SettingsModal } from './components/SettingsModal';

import { PRESET_EMERGENCY_CASES, PresetEmergencyCase } from './services/mockDataService';
import { createInitialState } from './agent/state';
import { AgentOrchestrator } from './agent/Orchestrator';
import { TriageState } from './types/agent';
import { PatientVitals } from './types/clinical';

export function App() {
  const [selectedCase, setSelectedCase] = useState<PresetEmergencyCase>(PRESET_EMERGENCY_CASES[0]);
  const [selectedModel, setSelectedModel] = useState<string>('gemma4:vision');
  
  // Interactive Patient State Inputs
  const [rawTranscript, setRawTranscript] = useState<string>(selectedCase.rawTranscript);
  const [inputLanguage, setInputLanguage] = useState<string>(selectedCase.inputLanguage);
  const [vitals, setVitals] = useState<PatientVitals>(selectedCase.vitals);
  const [rawLabs, setRawLabs] = useState<Record<string, number>>(selectedCase.rawLabs);

  // Pipeline Orchestrator State
  const [triageState, setTriageState] = useState<TriageState>(() => 
    createInitialState(
      selectedCase.patientProfile,
      selectedCase.vitals,
      selectedCase.rawLabs,
      selectedCase.rawTranscript,
      selectedCase.inputLanguage,
      selectedCase.image
    )
  );

  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);
  const [activeEvidenceCitation, setActiveEvidenceCitation] = useState<string | null>(null);
  const [isDebuggerOpen, setIsDebuggerOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Switch Emergency Cases
  const handleSelectCase = (caseId: string) => {
    const matched = PRESET_EMERGENCY_CASES.find(c => c.id === caseId) || PRESET_EMERGENCY_CASES[0];
    setSelectedCase(matched);
    setRawTranscript(matched.rawTranscript);
    setInputLanguage(matched.inputLanguage);
    setVitals(matched.vitals);
    setRawLabs(matched.rawLabs);

    const newState = createInitialState(
      matched.patientProfile,
      matched.vitals,
      matched.rawLabs,
      matched.rawTranscript,
      matched.inputLanguage,
      matched.image
    );
    setTriageState(newState);
  };

  // Update Lab Value
  const handleUpdateLabValue = (testId: string, val: number) => {
    const updatedLabs = { ...rawLabs, [testId]: val };
    setRawLabs(updatedLabs);
  };

  // Run Triage Pipeline
  const handleRunTriage = async () => {
    setIsPipelineRunning(true);
    const stateInput = createInitialState(
      selectedCase.patientProfile,
      vitals,
      rawLabs,
      rawTranscript,
      inputLanguage,
      selectedCase.image
    );

    const orchestrator = new AgentOrchestrator(stateInput, selectedModel);
    orchestrator.subscribe((state) => setTriageState(state));
    await orchestrator.runPipeline();
    setIsPipelineRunning(false);
  };

  // Auto-run triage when case changes
  useEffect(() => {
    handleRunTriage();
  }, [selectedCase]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Header Bar */}
      <Header
        calculatedESI={triageState.node2_deterministicResults?.calculatedESI}
        selectedCaseId={selectedCase.id}
        selectedModel={selectedModel}
        isPipelineRunning={isPipelineRunning}
        onSelectCase={handleSelectCase}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDebugger={() => setIsDebuggerOpen(true)}
        onRunTriage={handleRunTriage}
      />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-4">
        
        {/* Deterministic Safety Banner */}
        <DeterministicBanner
          esiResult={triageState.node2_deterministicResults?.calculatedESI}
          labAlerts={triageState.node2_deterministicResults?.labAlerts || []}
          qSofaScore={triageState.node2_deterministicResults?.qSofaScore || 0}
        />

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column: Patient Inputs, Labs & Vision (Width 7/12) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Patient Profile & Voice Dictation Form */}
            <PatientIntakeForm
              patientProfile={selectedCase.patientProfile}
              vitals={vitals}
              rawTranscript={rawTranscript}
              inputLanguage={inputLanguage}
              onUpdateTranscript={setRawTranscript}
              onUpdateLanguage={setInputLanguage}
              onUpdateVitals={setVitals}
            />

            {/* Laboratory Biomarker Inspector */}
            <LabReportInspector
              labAlerts={triageState.node2_deterministicResults?.labAlerts || []}
              rawLabs={rawLabs}
              onUpdateLabValue={handleUpdateLabValue}
            />

            {/* Gemma Multimodal Vision Inspector */}
            <VisionInspector
              image={selectedCase.image}
              visionFindings={triageState.node3_visionResults?.visionFindings || []}
            />

          </div>

          {/* Right Column: Grounded AI Synthesis & Decision Support (Width 5/12) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Gemma Grounded Decision Card */}
            <GemmaDiagnosticCard
              intakeBrief={triageState.node5_gemmaSynthesis?.fiveSecondIntakeBrief || []}
              redFlags={triageState.node5_gemmaSynthesis?.keyRedFlags || []}
              differentials={triageState.node5_gemmaSynthesis?.differentials || []}
              recommendedOrders={triageState.node5_gemmaSynthesis?.recommendedOrders || []}
              dischargeNote={triageState.node5_gemmaSynthesis?.patientDischargeNote || ''}
              isGrounded={triageState.node6_validationState?.isGrounded ?? true}
              onOpenEvidence={(cid) => setActiveEvidenceCitation(cid)}
            />

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-3 text-center text-xs text-slate-500 font-mono">
        PulseGemma CDS Engine • Grounded Edge AI for Healthcare • 100% Offline Capable
      </footer>

      {/* Evidence Viewer Modal */}
      <GroundTruthEvidenceViewer
        citationId={activeEvidenceCitation}
        onClose={() => setActiveEvidenceCitation(null)}
      />

      {/* Trace Debugger Drawer */}
      <WorkflowDebugger
        isOpen={isDebuggerOpen}
        traceLog={triageState.traceLog}
        onClose={() => setIsDebuggerOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        onClose={() => setIsSettingsOpen(false)}
      />

    </div>
  );
}

export default App;
