
import React, { useEffect, useRef, useState } from 'react';
import { X, Mic, MicOff, Volume2, VolumeX, Activity, Loader2, PlayCircle } from 'lucide-react';
import { connectLiveAnalyst } from '../geminiService';
import { FinancialReport } from '../types';
import { decodeBase64, decodeAudioData, createPcmBlob } from '../audioUtils';

interface LiveAnalystProps {
  report: FinancialReport;
  onClose: () => void;
}

const LiveAnalyst: React.FC<LiveAnalystProps> = ({ report, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState('Initializing analyst connection...');

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const inputContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const startSession = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        outputNodeRef.current = audioContextRef.current.createGain();
        outputNodeRef.current.connect(audioContextRef.current.destination);

        inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const sessionPromise = connectLiveAnalyst(report, {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            setStatus('Analyst connected. You can speak now.');
            
            // Stream microphone
            const source = inputContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              if (isMuted) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputContextRef.current!.destination);
          },
          onmessage: async (message: any) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNodeRef.current!);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e: any) => {
            console.error('Live Analyst Error:', e);
            setStatus('Connection error. Please try again.');
          },
          onclose: () => {
            setIsActive(false);
            setStatus('Session closed.');
          }
        });

        sessionRef.current = await sessionPromise;
      } catch (err) {
        console.error('Failed to start Live Analyst:', err);
        setStatus('Failed to access microphone or connect.');
        setIsConnecting(false);
      }
    };

    startSession();

    return () => {
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextRef.current) audioContextRef.current.close();
      if (inputContextRef.current) inputContextRef.current.close();
    };
  }, [report]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-lg" onClick={onClose} />
      
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col p-8 animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-all">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center space-y-8 py-8">
          <div className="relative">
            <div className={`w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 relative z-10 ${isActive ? 'animate-pulse' : ''}`}>
              <Activity size={48} />
            </div>
            {isActive && (
              <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-blue-500 animate-[ping_2s_infinite] opacity-30"></div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">Live AI Analyst</h3>
            <p className="text-blue-500 font-bold uppercase tracking-widest text-[10px]">Real-time Financial Advisory</p>
          </div>

          <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
            {isConnecting ? (
              <div className="flex items-center justify-center gap-3 text-slate-400">
                <Loader2 size={20} className="animate-spin" />
                <span className="font-bold text-sm">{status}</span>
              </div>
            ) : (
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                {status}
              </p>
            )}
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`p-5 rounded-[2rem] transition-all shadow-lg active:scale-95 ${
                isMuted ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200'
              }`}
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <button 
              className="p-5 bg-blue-600 text-white rounded-[2rem] shadow-xl shadow-blue-500/20 active:scale-95"
              onClick={() => setIsMuted(false)}
            >
              <Volume2 size={24} />
            </button>
          </div>
        </div>

        <div className="mt-4 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Institutional-Grade Low Latency Interface</p>
        </div>
      </div>
    </div>
  );
};

export default LiveAnalyst;
