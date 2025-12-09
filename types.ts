export enum PipelineStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum StepType {
  UPLOAD = 'Upload Media',
  TRANSCRIPT = 'Whisper Transcription',
  DIARIZATION = 'Speaker Diarization',
  SUMMARIZE = 'Ollama Summarization',
  GENERATE_ASSETS = 'ComfyUI Generation',
  ASSEMBLY = 'FFmpeg Assembly',
}

export interface PipelineStep {
  id: StepType;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number; // 0 to 100
  details?: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
}

export interface AppConfig {
  videoBackend: 'local' | 'wavespeed';
  ollamaModel: string;
  comfyHost: string;
  whisperModel: string;
}
