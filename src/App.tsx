import { useState, useEffect } from 'react';
import { Header, FeatureTabKey, ViewLayoutMode } from './components/Header';
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
  const [vlmApiKey, setVlmApiKey] = useState<string>('');
  const [activeFeatureTab, setActiveFeatureTab] = useState<FeatureTabKey>('TRIAGE_SYNTHESIS');
  const [layoutMode, setLayoutMode] = useState<ViewLayoutMode>('MODULAR_GRID');
  
  // Modular Module Visibility Map
  const [visibleModules, setVisibleModules] = useState<Record<FeatureTabKey, boolean>>({
    VOICE_DICTATION: true,
    DETERMINISTIC_LABS: true,
    MULTIMODAL_VISION: true,
    GROUNDED_RAG: true,
    TRIAGE_SYNTHESIS: true
  });

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

  // Toggle Module Visibility
  const handleToggleModuleVisibility = (key: FeatureTabKey) => {
    setVisibleModules(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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

  // Run Triage Pipeline (Hybrid Cloud VLM Node 3 + Local Gemma Node 5)
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

  // Quick Automated Demo Run Trigger for Specific Key Feature
  const handleQuickDemoRun = async (targetFeature?: FeatureTabKey) => {
    let demoCase = PRESET_EMERGENCY_CASES[0]; // Default: ACS STEMI
    if (targetFeature === 'VOICE_DICTATION') {
      demoCase = PRESET_EMERGENCY_CASES[0];
    } else if (targetFeature === 'DETERMINISTIC_LABS') {
      demoCase = PRESET_EMERGENCY_CASES[2];
    } else if (targetFeature === 'MULTIMODAL_VISION') {
      demoCase = PRESET_EMERGENCY_CASES[1];
    } else if (targetFeature === 'GROUNDED_RAG') {
      demoCase = PRESET_EMERGENCY_CASES[0];
    } else if (targetFeature === 'TRIAGE_SYNTHESIS') {
      demoCase = PRESET_EMERGENCY_CASES[0];
    }

    setSelectedCase(demoCase);
    setRawTranscript(demoCase.rawTranscript);
    setInputLanguage(demoCase.inputLanguage);
    setVitals(demoCase.vitals);
    setRawLabs(demoCase.rawLabs);
    setUploadedImage(demoCase.image);

    if (targetFeature) {
      setLayoutMode('SINGLE_FOCUS');
      setActiveFeatureTab(targetFeature);
    }

    setIsPipelineRunning(true);
    const stateInput = createInitialState(
      demoCase.patientProfile,
      demoCase.vitals,
      demoCase.rawLabs,
      demoCase.rawTranscript,
      demoCase.inputLanguage,
      demoCase.image
    );

    const orchestrator = new AgentOrchestrator(stateInput, selectedModel, vlmApiKey);
    orchestrator.subscribe((state) => setTriageState(state));
    await orchestrator.runPipeline();
    setIsPipelineRunning(false);
  };

  // Auto-run triage on initial launch
  useEffect(() => {
    handleRunTriage();
  }, [selectedCase]);

  const activeImage = uploadedImage || selectedCase.image;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white font-sans">
      
      {/* Header Bar with Quick Feature Demo Actions */}
      <Header
        calculatedESI={triageState.node2_deterministicResults?.calculatedESI}
        selectedCaseId={selectedCase.id}
        selectedModel={selectedModel}
        isPipelineRunning={isPipelineRunning}
        activeFeatureTab={activeFeatureTab}
        layoutMode={layoutMode}
        visibleModules={visibleModules}
        onSelectFeatureTab={setActiveFeatureTab}
        onChangeLayoutMode={setLayoutMode}
        onToggleModuleVisibility={handleToggleModuleVisibility}
        onSelectCase={handleSelectCase}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDebugger={() => setIsDebuggerOpen(true)}
        onRunTriage={handleRunTriage}
        onQuickDemoRun={handleQuickDemoRun}
      />

      {/* Main Workspace Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        
        {/* MODULAR GRID MODE: All Active Feature Modules Arranged in Grid Cards */}
        {layoutMode === 'MODULAR_GRID' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Intake, Range Checker & Vision (Width 7/12) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Module 1: Voice Dictation */}
              {visibleModules.VOICE_DICTATION && (
                <div className="relative">
                  <VoiceDictationTab
                    patientProfile={selectedCase.patientProfile}
                    rawTranscript={rawTranscript}
                    inputLanguage={inputLanguage}
                    normalizedSymptoms={triageState.node1_normalizedSymptoms}
                    onUpdateTranscript={setRawTranscript}
                    onUpdateLanguage={setInputLanguage}
                  />
                </div>
              )}

              {/* Module 2: Range Checker */}
              {visibleModules.DETERMINISTIC_LABS && (
                <div className="relative">
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
                </div>
              )}

              {/* Module 3: Multimodal Vision */}
              {visibleModules.MULTIMODAL_VISION && (
                <div className="relative">
                  <MultimodalVisionTab
                    image={activeImage}
                    visionFindings={triageState.node3_visionResults?.visionFindings || []}
                    onUploadImage={handleUploadImage}
                  />
                </div>
              )}

            </div>

            {/* Right Column: Master Triage Brief & Grounded RAG (Width 5/12) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Module 5: Master Triage Brief */}
              {visibleModules.TRIAGE_SYNTHESIS && (
                <div className="relative">
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
                </div>
              )}

              {/* Module 4: Grounded RAG */}
              {visibleModules.GROUNDED_RAG && (
                <div className="relative">
                  <GroundedRAGTab
                    retrievedGuidelines={triageState.node4_retrievedGuidelines || []}
                    onOpenEvidenceModal={(cid) => setActiveEvidenceCitation(cid)}
                  />
                </div>
              )}

            </div>

          </div>
        ) : (
          /* SINGLE FOCUS MODE: View 1 Isolated Feature Tab */
          <div>
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
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-3 text-center text-xs text-slate-500 font-mono">
        PulseGemma CDS Engine • Hybrid Cloud VLM + Local Gemma Synthesizer • 100% Offline Capable
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
        vlmApiKey={vlmApiKey}
        onSelectModel={setSelectedModel}
        onUpdateVlmApiKey={setVlmApiKey}
        onClose={() => setIsSettingsOpen(false)}
      />

    </div>
  );
}

export default App;
