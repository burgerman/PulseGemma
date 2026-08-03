import { useState } from 'react';
import { Header, FeatureTabKey } from './components/Header';
import { PatientOverviewCard } from './components/PatientOverviewCard';
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
import { GEMMA_4_NLU_MODEL } from './services/ollamaService';
import { executeNode1_Normalizer } from './agent/nodes/node1_normalizer';
import { Volume2, Eye, TestTube2, BookOpen, Stethoscope } from 'lucide-react';

export function App() {
  const [selectedCase, setSelectedCase] = useState<PresetEmergencyCase>(PRESET_EMERGENCY_CASES[0]);
  const [selectedModel, setSelectedModel] = useState<string>(GEMMA_4_NLU_MODEL);
  const [vlmApiKey, setVlmApiKey] = useState<string>('');
  const [activeFeatureTab, setActiveFeatureTab] = useState<FeatureTabKey>('TRIAGE_SYNTHESIS');

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

  // Doctor explicit trigger for Voice Dictation NLU (Node 1)
  const handleProcessDictationOnly = async () => {
    setIsPipelineRunning(true);
    const res = await executeNode1_Normalizer(rawTranscript, inputLanguage, selectedModel);
    setTriageState(prev => ({
      ...prev,
      node1_normalizedSymptoms: res
    }));
    setIsPipelineRunning(false);
  };

  // Run Full Triage Pipeline
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

    const orchestrator = new AgentOrchestrator(stateInput, selectedModel, vlmApiKey);
    orchestrator.subscribe((state) => setTriageState(state));
    await orchestrator.runPipeline();
    setIsPipelineRunning(false);
  };



  const activeImage = uploadedImage || selectedCase.image;

  const TABS = [
    { key: 'TRIAGE_SYNTHESIS' as FeatureTabKey, label: 'Master Triage', icon: Stethoscope },
    { key: 'VOICE_DICTATION' as FeatureTabKey, label: 'Voice Dictation', icon: Volume2 },
    { key: 'MULTIMODAL_VISION' as FeatureTabKey, label: 'Medical Vision', icon: Eye },
    { key: 'DETERMINISTIC_LABS' as FeatureTabKey, label: 'Lab Rules', icon: TestTube2 },
    { key: 'GROUNDED_RAG' as FeatureTabKey, label: 'Guidelines RAG', icon: BookOpen }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Top Header */}
      <Header
        calculatedESI={triageState.node2_deterministicResults?.calculatedESI}
        selectedCaseId={selectedCase.id}
        selectedModel={selectedModel}
        isPipelineRunning={isPipelineRunning}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDebugger={() => setIsDebuggerOpen(true)}
        onRunTriage={handleRunTriage}
      />

      {/* Main Workspace (Clean 2-Column Dashboard) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Patient Context Sidebar (3/12 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <PatientOverviewCard
              patientProfile={selectedCase.patientProfile}
              vitals={vitals}
              esiResult={triageState.node2_deterministicResults?.calculatedESI}
              selectedCaseId={selectedCase.id}
              onSelectCase={handleSelectCase}
            />
          </div>

          {/* Right Column: Main Interactive Workspace (8/12 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Explicit Feature Tab Bar Navigation */}
            <div className="bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm flex items-center gap-1 overflow-x-auto scrollbar-none">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeFeatureTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFeatureTab(tab.key)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold font-sans transition shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Workspace View */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              {activeFeatureTab === 'VOICE_DICTATION' && (
                <VoiceDictationTab
                  patientProfile={selectedCase.patientProfile}
                  rawTranscript={rawTranscript}
                  inputLanguage={inputLanguage}
                  normalizedSymptoms={triageState.node1_normalizedSymptoms}
                  onUpdateTranscript={setRawTranscript}
                  onUpdateLanguage={setInputLanguage}
                  onProcessTranscript={handleProcessDictationOnly}
                />
              )}

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

              {activeFeatureTab === 'MULTIMODAL_VISION' && (
                <MultimodalVisionTab
                  image={activeImage}
                  visionFindings={triageState.node3_visionResults?.visionFindings || []}
                  onUploadImage={handleUploadImage}
                />
              )}

              {activeFeatureTab === 'GROUNDED_RAG' && (
                <GroundedRAGTab
                  retrievedGuidelines={triageState.node4_retrievedGuidelines || []}
                  onOpenEvidenceModal={(cid) => setActiveEvidenceCitation(cid)}
                />
              )}

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
            </div>

          </div>

        </div>

      </main>

      {/* Footer Status */}
      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-400 font-sans">
        PulseGemma CDS Engine • MedGemma 1.5 Edge Mode Enabled • 100% Offline Capable
      </footer>

      {/* Citation Modal */}
      {activeEvidenceCitation && (
        <GroundTruthEvidenceViewer
          citationId={activeEvidenceCitation}
          onClose={() => setActiveEvidenceCitation(null)}
        />
      )}

      {/* Telemetry Debugger Modal */}
      <WorkflowDebugger
        isOpen={isDebuggerOpen}
        onClose={() => setIsDebuggerOpen(false)}
        traceLog={triageState.traceLog}
      />

      {/* System Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        vlmApiKey={vlmApiKey}
        onUpdateVlmApiKey={setVlmApiKey}
      />

    </div>
  );
}

export default App;
