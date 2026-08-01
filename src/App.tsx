import { useState, useEffect } from 'react';
import { Header, FeatureTabKey } from './components/Header';
import { VoiceDictationTab } from './components/tabs/VoiceDictationTab';
import { DeterministicLabTab } from './components/tabs/DeterministicLabTab';
import { MultimodalVisionTab } from './components/tabs/MultimodalVisionTab';
import { GroundedRAGTab } from './components/tabs/GroundedRAGTab';
import { MasterTriageSynthesisTab } from './components/tabs/MasterTriageSynthesisTab';

import { GroundTruthEvidenceViewer } from './components/GroundTruthEvidenceViewer';
import { WorkflowDebugger } from './components/WorkflowDebugger';
import { SettingsModal } from './components/SettingsModal';

import { PRESET_EMERGENCY_CASES, PresetEmergencyCase } from './services/mockDataService';
import { createInitialState } from './agent/state';
import { AgentOrchestrator } from './agent/Orchestrator';
import { TriageState } from './types/agent';
import { PatientVitals, MedicalImagePayload } from './types/clinical';

export function App() {
  const [selectedCase, setSelectedCase] = useState<PresetEmergencyCase>(PRESET_EMERGENCY_CASES[0]);
  const [selectedModel, setSelectedModel] = useState<string>('gemma4:vision');
  const [activeFeatureTab, setActiveFeatureTab] = useState<FeatureTabKey>('VOICE_DICTATION');
  
  // Interactive Patient State Inputs
  const [rawTranscript, setRawTranscript] = useState<string>(selectedCase.rawTranscript);
  const [inputLanguage, setInputLanguage] = useState<string>(selectedCase.inputLanguage);
  const [vitals, setVitals] = useState<PatientVitals>(selectedCase.vitals);
  const [rawLabs, setRawLabs] = useState<Record<string, number>>(selectedCase.rawLabs);
  const [uploadedImage, setUploadedImage] = useState<MedicalImagePayload | undefined>(selectedCase.image);

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
    setUploadedImage(matched.image);

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

  // Upload Custom Medical Image
  const handleUploadImage = (img: MedicalImagePayload) => {
    setUploadedImage(img);
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
      uploadedImage || selectedCase.image
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

  const activeImage = uploadedImage || selectedCase.image;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white font-sans">
      
      {/* Header with Independent Feature Tabs */}
      <Header
        calculatedESI={triageState.node2_deterministicResults?.calculatedESI}
        selectedCaseId={selectedCase.id}
        selectedModel={selectedModel}
        isPipelineRunning={isPipelineRunning}
        activeFeatureTab={activeFeatureTab}
        onSelectFeatureTab={setActiveFeatureTab}
        onSelectCase={handleSelectCase}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDebugger={() => setIsDebuggerOpen(true)}
        onRunTriage={handleRunTriage}
      />

      {/* Main Single-Responsibility Feature Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        
        {/* Tab 1: Hands-Free Voice Dictation & Multilingual NLU */}
        {activeFeatureTab === 'VOICE_DICTATION' && (
          <VoiceDictationTab
            patientProfile={selectedCase.patientProfile}
            rawTranscript={rawTranscript}
            inputLanguage={inputLanguage}
            normalizedSymptoms={triageState.node1_normalizedSymptoms}
            onUpdateTranscript={setRawTranscript}
            onUpdateLanguage={setInputLanguage}
          />
        )}

        {/* Tab 2: Deterministic Range Checker & Safety Engine */}
        {activeFeatureTab === 'DETERMINISTIC_LABS' && (
          <DeterministicLabTab
            vitals={vitals}
            labAlerts={triageState.node2_deterministicResults?.labAlerts || []}
            esiResult={triageState.node2_deterministicResults?.calculatedESI}
            qSofaScore={triageState.node2_deterministicResults?.qSofaScore || 0}
            wellsScore={triageState.node2_deterministicResults?.wellsScore || 0}
            drugAlerts={triageState.node2_deterministicResults?.drugInteractionAlerts || []}
            onUpdateVitals={setVitals}
            onUpdateLabValue={handleUpdateLabValue}
          />
        )}

        {/* Tab 3: Multimodal Vision Scanner */}
        {activeFeatureTab === 'MULTIMODAL_VISION' && (
          <MultimodalVisionTab
            image={activeImage}
            visionFindings={triageState.node3_visionResults?.visionFindings || []}
            onUploadImage={handleUploadImage}
          />
        )}

        {/* Tab 4: Grounded CPG RAG & Evidence Engine */}
        {activeFeatureTab === 'GROUNDED_RAG' && (
          <GroundedRAGTab
            retrievedGuidelines={triageState.node4_retrievedGuidelines || []}
            onOpenEvidenceModal={(cid) => setActiveEvidenceCitation(cid)}
          />
        )}

        {/* Tab 5: Master Triage Brief & EHR Export */}
        {activeFeatureTab === 'TRIAGE_SYNTHESIS' && (
          <MasterTriageSynthesisTab
            intakeBrief={triageState.node5_gemmaSynthesis?.fiveSecondIntakeBrief || []}
            redFlags={triageState.node5_gemmaSynthesis?.keyRedFlags || []}
            differentials={triageState.node5_gemmaSynthesis?.differentials || []}
            recommendedOrders={triageState.node5_gemmaSynthesis?.recommendedOrders || []}
            dischargeNote={triageState.node5_gemmaSynthesis?.patientDischargeNote || ''}
            isGrounded={triageState.node6_validationState?.isGrounded ?? true}
            esiResult={triageState.node2_deterministicResults?.calculatedESI}
            onOpenEvidence={(cid) => setActiveEvidenceCitation(cid)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-3 text-center text-xs text-slate-500 font-mono">
        PulseGemma CDS Engine • Component-Oriented Single Responsibility Architecture • 100% Offline Capable
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
