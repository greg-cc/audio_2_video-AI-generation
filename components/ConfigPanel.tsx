import React from 'react';
import { AppConfig } from '../types';
import { Settings, Server, Cpu, Key } from 'lucide-react';

interface ConfigPanelProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  disabled: boolean;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig, disabled }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4 text-slate-200">
        <Settings size={18} />
        <h3 className="font-semibold">Pipeline Configuration</h3>
      </div>

      <div className="space-y-4">
        {/* Backend Selection */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Video Backend</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setConfig({ ...config, videoBackend: 'local' })}
              disabled={disabled}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm border transition-all
                ${config.videoBackend === 'local' 
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-100' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'}`}
            >
              <Cpu size={14} /> Local (ComfyUI)
            </button>
            <button
              onClick={() => setConfig({ ...config, videoBackend: 'wavespeed' })}
              disabled={disabled}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm border transition-all
                ${config.videoBackend === 'wavespeed' 
                  ? 'bg-purple-600/20 border-purple-500/50 text-purple-100' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'}`}
            >
              <Server size={14} /> WaveSpeed Cloud
            </button>
          </div>
        </div>

        {/* Ollama Model */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Ollama Model</label>
          <div className="relative">
            <input 
              type="text"
              value={config.ollamaModel}
              onChange={(e) => setConfig({ ...config, ollamaModel: e.target.value })}
              disabled={disabled}
              className="w-full bg-slate-950 border border-slate-700 rounded-md py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
              placeholder="llama3"
            />
            <div className="absolute right-3 top-2.5 text-slate-600">
              <BrainCircuitIcon size={14} />
            </div>
          </div>
        </div>

        {/* Whisper Model */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Whisper Model</label>
          <select 
            value={config.whisperModel}
            onChange={(e) => setConfig({ ...config, whisperModel: e.target.value })}
            disabled={disabled}
            className="w-full bg-slate-950 border border-slate-700 rounded-md py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
          >
            <option value="tiny">Tiny (Fastest)</option>
            <option value="base">Base</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large (Slowest)</option>
          </select>
        </div>

        {/* API Key (Conditional) */}
        {config.videoBackend === 'wavespeed' && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
             <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">WaveSpeed API Key</label>
             <div className="relative">
               <input 
                 type="password"
                 disabled={disabled}
                 className="w-full bg-slate-950 border border-slate-700 rounded-md py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                 placeholder="ws-..."
               />
               <Key size={14} className="absolute right-3 top-2.5 text-slate-600" />
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple icon wrapper
const BrainCircuitIcon = ({size}: {size:number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.97-3.284"/><path d="M17.97 14.716A4 4 0 0 1 18 18"/></svg>
)

export default ConfigPanel;