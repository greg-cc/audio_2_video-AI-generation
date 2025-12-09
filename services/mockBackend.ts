import { PipelineStep, StepType, LogEntry } from '../types';

// This service mocks the behavior of the Python script provided by the user
// allowing the UI to demonstrate how it handles the complex multi-step process.

export const generateMockLogs = (step: StepType): string[] => {
  const timestamp = new Date().toLocaleTimeString();
  switch (step) {
    case StepType.TRANSCRIPT:
      return [
        `[${timestamp}] INFO: Loading Whisper model...`,
        `[${timestamp}] INFO: Transcribing audio track...`,
        `[${timestamp}] DEBUG: Audio duration: 4m 32s`,
      ];
    case StepType.DIARIZATION:
      return [
        `[${timestamp}] INFO: Loading Pyannote pipeline...`,
        `[${timestamp}] INFO: Identifying speakers...`,
        `[${timestamp}] INFO: Found 2 unique speakers.`,
      ];
    case StepType.SUMMARIZE:
      return [
        `[${timestamp}] INFO: Connecting to Ollama (127.0.0.1:11434)...`,
        `[${timestamp}] INFO: Generating semantic embeddings...`,
        `[${timestamp}] INFO: Extracted 5 key topics.`,
      ];
    case StepType.GENERATE_ASSETS:
      return [
        `[${timestamp}] INFO: Queueing ComfyUI prompts...`,
        `[${timestamp}] INFO: Generating background_topic_0.mp4...`,
        `[${timestamp}] INFO: Generating background_topic_1.mp4...`,
        `[${timestamp}] INFO: VRAM Usage: 14.2GB / 24.0GB`,
      ];
    case StepType.ASSEMBLY:
      return [
        `[${timestamp}] INFO: Initializing MoviePy...`,
        `[${timestamp}] INFO: Concatenating 5 video clips...`,
        `[${timestamp}] INFO: Overlaying bullet points...`,
        `[${timestamp}] INFO: Writing final MP4 to disk...`,
      ];
    default:
      return [];
  }
};

export const INITIAL_STEPS: PipelineStep[] = [
  { id: StepType.TRANSCRIPT, status: 'pending', progress: 0 },
  { id: StepType.DIARIZATION, status: 'pending', progress: 0 },
  { id: StepType.SUMMARIZE, status: 'pending', progress: 0 },
  { id: StepType.GENERATE_ASSETS, status: 'pending', progress: 0 },
  { id: StepType.ASSEMBLY, status: 'pending', progress: 0 },
];
