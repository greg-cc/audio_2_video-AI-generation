import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal, Trash2 } from 'lucide-react';

interface TerminalLogProps {
  logs: LogEntry[];
  onClear: () => void;
}

const TerminalLog: React.FC<TerminalLogProps> = ({ logs, onClear }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2 text-slate-400">
          <Terminal size={16} />
          <span className="text-xs font-mono font-medium uppercase tracking-wider">System Output</span>
        </div>
        <button 
          onClick={onClear}
          className="text-slate-500 hover:text-red-400 transition-colors"
          title="Clear Logs"
        >
          <Trash2 size={14} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1">
        {logs.length === 0 && (
          <div className="text-slate-600 italic">Waiting for process to start...</div>
        )}
        {logs.map((log, index) => (
          <div key={index} className="flex gap-2">
            <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
            <span className={`
              ${log.level === 'ERROR' ? 'text-red-400 font-bold' : ''}
              ${log.level === 'WARN' ? 'text-amber-400' : ''}
              ${log.level === 'DEBUG' ? 'text-slate-500' : ''}
              ${log.level === 'INFO' ? 'text-emerald-400' : ''}
            `}>
              {log.level}
            </span>
            <span className="text-slate-300 break-all">{log.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default TerminalLog;