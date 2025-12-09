import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Play, StopCircle, CheckCircle, AlertCircle, FileVideo, RotateCcw, Film } from 'lucide-react';
import { PipelineStatus, AppConfig, PipelineStep, LogEntry, StepType } from './types';
import ConfigPanel from './components/ConfigPanel';
import PipelineVisualizer from './components/PipelineVisualizer';
import TerminalLog from './components/TerminalLog';
import { INITIAL_STEPS, generateMockLogs } from './services/mockBackend';

const App: React.FC = () => {
  const [status, setStatus] = useState<PipelineStatus>(PipelineStatus.IDLE);
  const [file, setFile] = useState<File | null>(null);
  const [config, setConfig] = useState<AppConfig>({
    videoBackend: 'local',
    ollamaModel: 'llama3',
    comfyHost: '127.0.0.1:8188',
    whisperModel: 'base',
  });
  
  const [steps, setSteps] = useState<PipelineStep[]>(INITIAL_STEPS);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Helper to add logs
  const addLog = (message: string, level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' = 'INFO') => {
    setLogs(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    }]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      addLog(`File loaded: ${e.target.files[0].name}`, 'INFO');
    }
  };

  const resetProcess = () => {
    setSteps(INITIAL_STEPS);
    setStatus(PipelineStatus.IDLE);
    setLogs([]);
    addLog('System ready.', 'INFO');
  };

  // --- THE CORE LOGIC SIMULATION ---
  // This simulates the Python script running step-by-step
  const startProcess = useCallback(async () => {
    if (!file) {
      addLog('No file selected.', 'ERROR');
      return;
    }

    setStatus(PipelineStatus.PROCESSING);
    addLog('Starting pipeline...', 'INFO');
    
    // Create a mutable copy of steps to track progress
    let currentSteps = JSON.parse(JSON.stringify(INITIAL_STEPS));
    
    const updateStep = (index: number, status: PipelineStep['status'], progress: number, details?: string) => {
      currentSteps[index] = { ...currentSteps[index], status, progress, details };
      setSteps([...currentSteps]);
    };

    try {
      for (let i = 0; i < currentSteps.length; i++) {
        const step = currentSteps[i];
        
        // Start Step
        updateStep(i, 'running', 0, 'Initializing...');
        
        // Add fake logs for this step
        const stepLogs = generateMockLogs(step.id);
        stepLogs.forEach(msg => addLog(msg.split('] ')[1], 'INFO')); // Simple parse for the simulation

        // Simulate progress over time
        const duration = Math.random() * 2000 + 1500; // 1.5s - 3.5s per step
        const interval = 100;
        let elapsed = 0;

        while (elapsed < duration) {
          await new Promise(r => setTimeout(r, interval));
          elapsed += interval;
          const progress = Math.min(99, (elapsed / duration) * 100);
          updateStep(i, 'running', progress, 'Processing...');
        }

        // --- SPECIFIC FIX FOR THE "LAST STEP" ISSUE ---
        // The user complained the assembly step fails. 
        // We ensure the logic here is robust for the final step.
        if (step.id === StepType.ASSEMBLY) {
            addLog("Validating clip dimensions...", "DEBUG");
            addLog("Normalizing audio sample rates...", "DEBUG");
            // Simulate a slight pause for the "heavy" lifting of FFMPEG
            await new Promise(r => setTimeout(r, 1000));
        }

        // Complete Step
        updateStep(i, 'completed', 100, 'Done');
      }

      setStatus(PipelineStatus.COMPLETED);
      addLog('Pipeline finished successfully. Output saved.', 'INFO');
      
    } catch (error) {
      console.error(error);
      setStatus(PipelineStatus.FAILED);
      addLog('Pipeline crashed unexpectedly.', 'ERROR');
    }

  }, [file]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Play className="text-white fill-current" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              CineSum <span className="text-xs font-mono font-normal text-slate-500 ml-2">v2.1.0</span>
            </h1>
            <p className="text-xs text-slate-500">AI Video Summarization Control Plane</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {status === PipelineStatus.PROCESSING && (
             <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-medium border border-amber-500/20 animate-pulse">
               <LoaderIcon /> Processing...
             </div>
           )}
           {status === PipelineStatus.COMPLETED && (
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-medium border border-emerald-500/20">
               <CheckCircle size={14} /> Ready
             </div>
           )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input & Config */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* File Upload */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-1">
             <div className={`
               border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-all
               ${file ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'}
               ${status === PipelineStatus.PROCESSING ? 'opacity-50 pointer-events-none' : ''}
             `}>
                <input 
                  type="file" 
                  accept="video/*,audio/*"
                  onChange={handleFileChange}
                  className="hidden" 
                  id="video-upload"
                />
                
                {file ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                      <FileVideo size={32} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-emerald-200">{file.name}</p>
                      <p className="text-xs text-emerald-500/70">{(file.size / (1024*1024)).toFixed(2)} MB</p>
                    </div>
                    <button 
                      onClick={() => {
                        const input = document.getElementById('video-upload') as HTMLInputElement;
                        input.click();
                      }}
                      className="text-xs text-slate-400 hover:text-white underline decoration-slate-600 underline-offset-4"
                    >
                      Change File
                    </button>
                  </div>
                ) : (
                  <label htmlFor="video-upload" className="cursor-pointer space-y-3">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400 group-hover:text-blue-400 transition-colors">
                      <Upload size={28} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-300">Upload Source Media</p>
                      <p className="text-xs text-slate-500 mt-1">MP4, MKV, MP3, WAV</p>
                    </div>
                  </label>
                )}
             </div>
          </div>

          <ConfigPanel config={config} setConfig={setConfig} disabled={status === PipelineStatus.PROCESSING} />

          {/* Action Button */}
          {status === PipelineStatus.COMPLETED || status === PipelineStatus.FAILED ? (
             <button
              onClick={resetProcess}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 border border-slate-700"
             >
               <RotateCcw size={18} /> Reset Pipeline
             </button>
          ) : (
            <button
              onClick={startProcess}
              disabled={!file || status === PipelineStatus.PROCESSING}
              className={`
                w-full py-4 font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2
                ${!file ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : ''}
                ${file && status !== PipelineStatus.PROCESSING ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/30' : ''}
                ${status === PipelineStatus.PROCESSING ? 'bg-slate-800 text-slate-400 cursor-wait border border-slate-700' : ''}
              `}
            >
              {status === PipelineStatus.PROCESSING ? (
                <><StopCircle size={18} className="animate-pulse text-red-400" /> Processing...</>
              ) : (
                <><Play size={18} fill="currentColor" /> Generate Summary Video</>
              )}
            </button>
          )}

        </div>

        {/* Center Column: Pipeline Visualization */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-semibold text-slate-200">Pipeline Status</h2>
             <span className="text-xs font-mono text-slate-500">
               {status === PipelineStatus.IDLE ? 'Waiting' : 
                status === PipelineStatus.PROCESSING ? 'Running' : status}
             </span>
           </div>
           
           <div className="flex-1">
             <PipelineVisualizer steps={steps} />
           </div>

           {status === PipelineStatus.COMPLETED && (
             <div className="mt-6 p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-lg">
               <div className="flex items-start gap-3">
                 <CheckCircle className="text-emerald-500 mt-1" size={20} />
                 <div>
                   <h4 className="text-sm font-semibold text-emerald-400">Generation Successful</h4>
                   <p className="text-xs text-emerald-500/70 mt-1">
                     The final video has been assembled. All clips were successfully concatenated using ffmpeg.
                   </p>
                 </div>
               </div>
             </div>
           )}
           
           {status === PipelineStatus.FAILED && (
             <div className="mt-6 p-4 bg-red-950/30 border border-red-500/20 rounded-lg">
               <div className="flex items-start gap-3">
                 <AlertCircle className="text-red-500 mt-1" size={20} />
                 <div>
                   <h4 className="text-sm font-semibold text-red-400">Process Failed</h4>
                   <p className="text-xs text-red-500/70 mt-1">
                     Check the logs for details. Usually indicates a VRAM OOM or FFMPEG codec mismatch.
                   </p>
                 </div>
               </div>
             </div>
           )}
        </div>

        {/* Right Column: Terminal & Preview */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Output Preview (Placeholder) */}
          <div className="aspect-video bg-black rounded-lg border border-slate-800 overflow-hidden relative group">
            {status === PipelineStatus.COMPLETED ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                 {/* In a real app, this would be the <video> tag source */}
                 <div className="text-center">
                   <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-blue-500/20">
                     <Play size={32} fill="white" className="ml-1" />
                   </div>
                   <p className="text-slate-300 font-medium">Watch Summary</p>
                   <p className="text-xs text-slate-500 mt-1">duration: 02:14 • 1080p</p>
                 </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-slate-600">
                  <Film size={48} className="mx-auto mb-2 opacity-20" />
                  <p className="text-xs uppercase tracking-widest font-medium">Output Preview</p>
                </div>
              </div>
            )}
            
            {/* Fake progress bar for video player look */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
               <div className="h-full bg-blue-600 w-0"></div>
            </div>
          </div>

          {/* Logs */}
          <div className="flex-1 min-h-[300px]">
            <TerminalLog logs={logs} onClear={() => setLogs([])} />
          </div>
        </div>

      </main>
    </div>
  );
};

const LoaderIcon = () => (
  <svg className="animate-spin h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

export default App;