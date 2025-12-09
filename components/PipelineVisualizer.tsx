import React from 'react';
import { PipelineStep, StepType } from '../types';
import { CheckCircle2, Circle, Loader2, XCircle, Mic, Users, BrainCircuit, Clapperboard, Film } from 'lucide-react';

interface PipelineVisualizerProps {
  steps: PipelineStep[];
}

const getIcon = (type: StepType) => {
  switch (type) {
    case StepType.TRANSCRIPT: return <Mic size={18} />;
    case StepType.DIARIZATION: return <Users size={18} />;
    case StepType.SUMMARIZE: return <BrainCircuit size={18} />;
    case StepType.GENERATE_ASSETS: return <Clapperboard size={18} />;
    case StepType.ASSEMBLY: return <Film size={18} />;
    default: return <Circle size={18} />;
  }
};

const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({ steps }) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isActive = step.status === 'running';
        const isCompleted = step.status === 'completed';
        const isError = step.status === 'error';
        const isPending = step.status === 'pending';

        return (
          <div 
            key={step.id} 
            className={`
              relative flex items-center p-3 rounded-lg border transition-all duration-300
              ${isActive ? 'bg-slate-800 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : ''}
              ${isCompleted ? 'bg-slate-900/50 border-emerald-500/30' : ''}
              ${isError ? 'bg-red-950/20 border-red-500/50' : ''}
              ${isPending ? 'bg-slate-900/30 border-slate-800 text-slate-500' : ''}
            `}
          >
            {/* Connector Line */}
            {index !== steps.length - 1 && (
              <div className={`
                absolute left-[23px] top-[40px] w-[2px] h-[20px] 
                ${isCompleted ? 'bg-emerald-500/30' : 'bg-slate-800'}
              `} />
            )}

            {/* Icon Status */}
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center mr-4 shrink-0
              ${isActive ? 'text-blue-400 bg-blue-400/10' : ''}
              ${isCompleted ? 'text-emerald-400 bg-emerald-400/10' : ''}
              ${isError ? 'text-red-400 bg-red-400/10' : ''}
              ${isPending ? 'bg-slate-800' : ''}
            `}>
              {isActive ? <Loader2 className="animate-spin" size={18} /> : 
               isCompleted ? <CheckCircle2 size={18} /> :
               isError ? <XCircle size={18} /> :
               getIcon(step.id)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h4 className={`text-sm font-medium ${isPending ? 'text-slate-500' : 'text-slate-200'}`}>
                  {step.id}
                </h4>
                {step.progress > 0 && (
                  <span className="text-xs font-mono text-slate-400">{Math.round(step.progress)}%</span>
                )}
              </div>
              
              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ease-out ${
                    isError ? 'bg-red-500' : 
                    isCompleted ? 'bg-emerald-500' : 
                    'bg-blue-500'
                  }`}
                  style={{ width: `${step.progress}%` }}
                />
              </div>
              
              {step.details && (
                <p className="mt-1.5 text-xs text-slate-400 font-mono truncate animate-pulse">
                  {step.details}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PipelineVisualizer;