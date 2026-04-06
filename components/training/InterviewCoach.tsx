
import React, { useState, useEffect, useRef } from 'react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { connectInterviewCoach, encode, decode, decodeAudioData } from '../../services/geminiService';
import GlassCard from '../shared/GlassCard';

const InterviewCoach: React.FC = () => {
    const [role, setRole] = useState('Software Engineer');
    const [isStarted, setIsStarted] = useState(false);
    const [status, setStatus] = useState('Standby');
    const [micVolume, setMicVolume] = useState(0);
    
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
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
            setStatus('Connecting to your friend...');
            
            // Re-initialize AudioContexts for a clean session
            const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            await inputCtx.resume();
            await outputCtx.resume();
            
            inputContextRef.current = inputCtx;
            outputContextRef.current = outputCtx;

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Visualizer setup
            const source = inputCtx.createMediaStreamSource(stream);
            const analyzer = inputCtx.createAnalyser();
            analyzer.fftSize = 256;
            source.connect(analyzer);
            const dataArray = new Uint8Array(analyzer.frequencyBinCount);
            
            const updateVolume = () => {
                if (isStoppingRef.current) return;
                analyzer.getByteFrequencyData(dataArray);
                const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
                setMicVolume(avg);
                requestAnimationFrame(updateVolume);
            };
            updateVolume();

            sessionPromiseRef.current = connectInterviewCoach(role, {
                onopen: () => {
                    setStatus('Live - Start Talking');
                    setIsStarted(true);
                    
                    const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
                    scriptProcessor.onaudioprocess = (e) => {
                        if (isStoppingRef.current) return;
                        const inputData = e.inputBuffer.getChannelData(0);
                        const int16 = new Int16Array(inputData.length);
                        for (let i = 0; i < inputData.length; i++) {
                            int16[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
                        }
                        
                        const pcmBlob = {
                            data: encode(new Uint8Array(int16.buffer)),
                            mimeType: 'audio/pcm;rate=16000',
                        };
                        
                        sessionPromiseRef.current?.then((session) => {
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
                            const sourceNode = outputContextRef.current.createBufferSource();
                            sourceNode.buffer = buffer;
                            sourceNode.connect(outputContextRef.current.destination);
                            sourceNode.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += buffer.duration;
                            sourcesRef.current.add(sourceNode);
                            sourceNode.onended = () => sourcesRef.current.delete(sourceNode);
                        } catch (err) { console.error("Audio error", err); }
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
                onerror: (err: any) => {
                    console.error("Live Error", err);
                    setStatus('Sync Error');
                }
            });

        } catch (err) {
            console.error(err);
            setStatus('Hardware Error');
        }
    };

    const stopSession = async () => {
        if (isStoppingRef.current) return;
        isStoppingRef.current = true;
        setIsStarted(false);
        setStatus('Standby');

        // Close session
        sessionPromiseRef.current?.then(s => s?.close());
        sessionPromiseRef.current = null;
        
        // Stop media stream
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;

        // Stop all audio sources
        sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
        sourcesRef.current.clear();
        
        // Safely close audio contexts
        if (inputContextRef.current && inputContextRef.current.state !== 'closed') {
            try { await inputContextRef.current.close(); } catch(e) {}
        }
        inputContextRef.current = null;

        if (outputContextRef.current && outputContextRef.current.state !== 'closed') {
            try { await outputContextRef.current.close(); } catch(e) {}
        }
        outputContextRef.current = null;
    };

    if (!isStarted) {
        return (
            <div className="max-w-2xl mx-auto space-y-8 animate-reveal py-10">
                <Card className="text-center p-12 border-brand/20 bg-secondary/80 shadow-2xl">
                    <div className="bg-brand/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-brand/30">
                        <svg className="w-12 h-12 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-black text-text-primary tracking-tighter mb-4 uppercase italic">Voice Friend</h2>
                    <p className="text-text-secondary mb-10 text-lg">Your AI friend helps you prep. If you're wrong, they'll say <span className="text-brand font-black">"this is not that"</span> and guide you back.</p>
                    <div className="space-y-6 max-w-sm mx-auto">
                        <div className="text-left">
                            <label className="text-[10px] font-black text-brand uppercase tracking-widest ml-1 mb-2 block">Target Job Position</label>
                            <input 
                                className="w-full bg-accent p-4 rounded-xl text-text-primary border border-white/10 font-black outline-none focus:ring-1 focus:ring-brand"
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                placeholder="e.g. Data Scientist"
                            />
                        </div>
                        <Button onClick={startSession} className="w-full py-4 text-lg font-black tracking-widest uppercase">Establish Audio Link</Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-10rem)] animate-reveal">
            <GlassCard className="text-center py-20 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <div className="w-[600px] h-[600px] bg-brand rounded-full blur-[140px] animate-pulse"></div>
                </div>

                <div className="mb-12 relative flex items-center justify-center">
                    <div 
                        className="absolute rounded-full bg-brand/10 transition-all duration-75" 
                        style={{ width: `${180 + micVolume * 1.5}px`, height: `${180 + micVolume * 1.5}px` }}
                    ></div>
                    <div className="h-44 w-44 rounded-full bg-brand flex items-center justify-center border-4 border-brand/50 shadow-[0_0_80px_rgba(56,189,248,0.5)] z-10 relative">
                         <svg className="w-20 h-20 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"/></svg>
                    </div>
                </div>

                <h3 className="text-3xl font-black text-text-primary mb-2 uppercase tracking-tighter italic">Mock Session Active</h3>
                <p className="text-text-secondary mb-12 text-sm font-mono tracking-widest">ENCRYPTED STREAM • {role.toUpperCase()}</p>
                
                <div className="flex items-center gap-3 bg-white/5 px-8 py-4 rounded-full border border-white/10 mb-12 backdrop-blur-md">
                    <div className="h-3 w-3 rounded-full bg-green-400 shadow-[0_0_12px_#4ade80] animate-pulse"></div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white">{status}</span>
                </div>

                <Button onClick={stopSession} variant="secondary" className="px-16 py-4 border border-white/10 hover:bg-red-500/10 hover:text-red-400 transition-all font-black text-xs uppercase tracking-widest">
                    Terminate Link
                </Button>
            </GlassCard>
        </div>
    );
};

export default InterviewCoach;
