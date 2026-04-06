
import React, { useState, useRef } from 'react';
import { analyzeResume } from '../../services/geminiService';
import type { ResumeAnalysis } from '../../types';
import Button from '../shared/Button';
import Card from '../shared/Card';
import Spinner from '../shared/Spinner';
import GlassCard from '../shared/GlassCard';

const ResumeAnalyzer: React.FC = () => {
    const [resumeText, setResumeText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [manualEntry, setManualEntry] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setError(null);
        setFileName(file.name);
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            if (!text || text.trim().length < 50) {
                setError("Could not extract enough text from this file. Please ensure it's a valid text file or use 'Manual Entry'.");
                return;
            }
            setResumeText(text);
        };
        reader.onerror = () => setError("File reading failed. Please try again or use Manual Entry.");
        reader.readAsText(file);
    };

    const handleAnalyze = async () => {
        if (!resumeText.trim()) {
            setError("Please provide your resume content first.");
            return;
        }
        
        setIsAnalyzing(true);
        setError(null);
        setAnalysis(null);
        
        try {
            const result = await analyzeResume(resumeText);
            if (result) {
                setAnalysis(result);
            } else {
                setError("AI was unable to parse this content. Try a more detailed text version.");
            }
        } catch (err) {
            console.error("Resume analysis failed", err);
            setError("Network or AI link failure. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const triggerFileInput = () => {
        setManualEntry(false);
        fileInputRef.current?.click();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-reveal">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-text-primary tracking-tight uppercase italic">AI Resume Scanner</h2>
                    <p className="text-text-secondary">Instant ATS optimization and industry alignment.</p>
                </div>
                <button 
                    onClick={() => setManualEntry(!manualEntry)}
                    className="text-[10px] font-black text-brand uppercase tracking-widest border border-brand/20 px-4 py-2 rounded-xl hover:bg-brand/10 transition-all"
                >
                    {manualEntry ? "Switch to Upload" : "Manual Paste Mode"}
                </button>
            </div>

            <GlassCard className="border-brand/40">
                <h3 className="font-bold text-brand mb-4 uppercase tracking-widest text-sm">Target Profile Data</h3>
                
                {manualEntry ? (
                    <textarea 
                        className="w-full bg-accent/40 border border-white/10 rounded-2xl p-6 text-text-primary text-sm min-h-[200px] outline-none focus:ring-1 focus:ring-brand mb-6 font-mono"
                        placeholder="Paste your full resume text here for deep analysis..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                    />
                ) : (
                    <div 
                        onClick={triggerFileInput}
                        className="w-full border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 hover:border-brand/50 transition-all cursor-pointer group mb-6"
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="hidden" 
                            accept=".txt,.doc,.docx,.pdf"
                        />
                        <svg className="w-12 h-12 text-text-secondary group-hover:text-brand transition-colors mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-text-primary font-bold">{fileName || "Drop your document here"}</p>
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-2">Supports Text-Based PDF, DOCX, TXT</p>
                    </div>
                )}

                <Button 
                    onClick={handleAnalyze} 
                    isLoading={isAnalyzing} 
                    className="w-full py-4 text-lg font-black tracking-widest uppercase italic"
                    disabled={!resumeText.trim() && !fileName}
                >
                    Initialize Neural Scan
                </Button>

                {error && (
                    <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-bold">
                        {error}
                    </div>
                )}
            </GlassCard>

            {isAnalyzing && (
                <div className="flex flex-col items-center py-10 opacity-60">
                    <Spinner size="lg" />
                    <p className="mt-4 text-[10px] font-black text-brand uppercase tracking-[0.4em]">Simulating ATS Review...</p>
                </div>
            )}

            {analysis && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
                    <Card className="lg:col-span-1 flex flex-col items-center justify-center p-10 bg-gradient-to-br from-brand/20 to-transparent border-brand/30">
                        <p className="text-[10px] font-black text-text-secondary uppercase mb-2 tracking-widest">ATS Match Score</p>
                        <div className="relative flex items-center justify-center">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                <circle
                                    cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                                    strokeDasharray={364.4}
                                    strokeDashoffset={364.4 - (364.4 * analysis.score) / 100}
                                    className="text-brand shadow-[0_0_15px_#38bdf8]"
                                />
                            </svg>
                            <span className="absolute text-3xl font-black text-white">{analysis.score}%</span>
                        </div>
                    </Card>

                    <Card className="lg:col-span-2 space-y-6">
                        <div>
                            <h4 className="text-xs font-black text-brand uppercase mb-4 tracking-widest">Mastery Protocol Improvements</h4>
                            <ul className="space-y-4">
                                {analysis.improvements.map((item, i) => (
                                    <li key={i} className="text-sm text-text-secondary leading-relaxed border-l-2 border-brand pl-4 animate-reveal" style={{ animationDelay: `${i * 100}ms` }}>
                                        <span className="text-white font-black block mb-1 text-[10px] tracking-tighter uppercase italic">PHASE {i + 1}</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Card>

                    <Card className="lg:col-span-3">
                        <h4 className="text-xs font-black text-white uppercase mb-4 tracking-widest">Detected Industry Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                             {analysis.keywords.map((kw, i) => (
                                 <span key={i} className="px-3 py-1 bg-brand/10 border border-brand/20 text-brand text-[9px] font-black rounded-lg">{kw.toUpperCase()}</span>
                             ))}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ResumeAnalyzer;
