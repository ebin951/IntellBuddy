
import React, { useState, useEffect, useRef } from 'react';
import { connectLiveMentor, encode, decode, decodeAudioData } from '../../services/geminiService';
import GlassCard from '../shared/GlassCard';
import Button from '../shared/Button';

const MicrophoneIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
    </svg>
);

const LiveMentor: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [status, setStatus] = useState('Standby');
    
    const sessionRef = useRef<any>(null);
    const inputContextRef = useRef<AudioContext | null>(null);
    const outputContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);
    const isStoppingRef = useRef(false);

    useEffect(() => {
        return () => {
            stopSession();
        };
    }, []);

    const startSession = async () => {
        try {
            isStoppingRef.current = false;
            setStatus('Initializing...');
            const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            await inputCtx.resume();
            await outputCtx.resume();
            
            inputContextRef.current = inputCtx;
            outputContextRef.current = outputCtx;

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const sessionPromise = connectLiveMentor('AI Mentor', {
                onopen: () => {
                    setStatus('Active');
                    setIsActive(true);
                    
                    const source = inputCtx.createMediaStreamSource(stream);
                    const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
                    scriptProcessor.onaudioprocess = (e) => {
                        if (isStoppingRef.current) return;
                        const inputData = e.inputBuffer.getChannelData(0);
                        const l = inputData.length;
                        const int16 = new Int16Array(l);
                        for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
                        const pcmBlob = {
                            data: encode(new Uint8Array(int16.buffer)),
                            mimeType: 'audio/pcm;rate=16000',
                        };
                        sessionPromise.then((session) => {
                            if (session && !isStoppingRef.current) {
                                session.sendRealtimeInput({ media: pcmBlob });
                            }
                        });
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputCtx.destination);
                },
                onmessage: async (message: any) => {
                    if (isStoppingRef.current) return;
                    const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                    if (audioData && outputContextRef.current?.state === 'running') {
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputContextRef.current.currentTime);
                        try {
                            const buffer = await decodeAudioData(decode(audioData), outputContextRef.current, 24000, 1);
                            const source = outputContextRef.current.createBufferSource();
                            source.buffer = buffer;
                            source.connect(outputContextRef.current.destination);
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += buffer.duration;
                            sourcesRef.current.add(source);
                            source.onended = () => sourcesRef.current.delete(source);
                        } catch (err) {
                            console.error("Decode Error", err);
                        }
                    }
                    if (message.serverContent?.interrupted) {
                        sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
                        sourcesRef.current.clear();
                        nextStartTimeRef.current = 0;
                    }
                },
                onclose: () => {
                    if (!isStoppingRef.current) stopSession();
                },
                onerror: () => setStatus('Connection Error')
            });

            sessionRef.current = await sessionPromise;
        } catch (err) {
            console.error(err);
            setStatus('Hardware Error');
        }
    };

    const stopSession = async () => {
        if (isStoppingRef.current) return;
        isStoppingRef.current = true;
        
        setIsActive(false);
        setStatus('Standby');
        
        try { sessionRef.current?.close(); } catch(e) {}
        sessionRef.current = null;

        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;

        sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
        sourcesRef.current.clear();

        if (inputContextRef.current && inputContextRef.current.state !== 'closed') {
            try { await inputContextRef.current.close(); } catch(e) {}
        }
        inputContextRef.current = null;

        if (outputContextRef.current && outputContextRef.current.state !== 'closed') {
            try { await outputContextRef.current.close(); } catch(e) {}
        }
        outputContextRef.current = null;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-reveal">
            <GlassCard className="text-center py-12">
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        {isActive && (
                            <>
                                <div className="absolute inset-0 bg-brand/20 rounded-full animate-ping"></div>
                                <div className="absolute inset-[-20px] bg-brand/10 rounded-full animate-pulse-slow"></div>
                            </>
                        )}
                        <div className={`h-24 w-24 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${isActive ? 'bg-brand text-primary border-brand shadow-[0_0_50px_rgba(56,189,248,0.5)] scale-110' : 'bg-white/5 text-brand border-white/10'}`}>
                            {isActive ? <MicrophoneIcon className="w-10 h-10" /> : <MicrophoneIcon className="w-10 h-10 opacity-50" />}
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl font-black text-text-primary tracking-tight uppercase italic">Live Sync: AI Mentor</h2>
                <p className="text-text-secondary mt-2 mb-8">Natural, low-latency voice interaction for deep concept mastery.</p>
                
                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-red-400'}`}></div>
                        <span className="text-xs font-mono uppercase tracking-widest text-text-secondary">{status}</span>
                    </div>

                    {!isActive ? (
                        <Button onClick={startSession} className="px-10 py-4 shadow-2xl hover:scale-105 transition-transform font-black">
                            INITIALIZE LINK
                        </Button>
                    ) : (
                        <Button onClick={stopSession} variant="secondary" className="px-10 py-4 border border-white/10 hover:bg-red-500/10 hover:text-red-400 transition-all font-black">
                            TERMINATE LINK
                        </Button>
                    )}
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard>
                    <h3 className="font-bold text-text-primary mb-2 flex items-center gap-2 uppercase text-xs tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>
                        Voice Commands
                    </h3>
                    <ul className="text-[11px] text-text-secondary space-y-2 list-none uppercase font-bold opacity-60">
                        <li>• "Break down Quantum Physics in simple terms"</li>
                        <li>• "Quiz me on the last topic we discussed"</li>
                        <li>• "Plan my session for Linear Algebra"</li>
                    </ul>
                </GlassCard>
                <GlassCard>
                    <h3 className="font-bold text-text-primary mb-2 flex items-center gap-2 uppercase text-xs tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                        Real-time Metrics
                    </h3>
                    <div className="flex items-end gap-1 h-12">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className={`flex-1 bg-brand/40 rounded-t-sm transition-all ${isActive ? 'animate-pulse' : 'h-1'}`} style={{ height: isActive ? `${Math.random() * 100}%` : '2px' }}></div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default LiveMentor;
