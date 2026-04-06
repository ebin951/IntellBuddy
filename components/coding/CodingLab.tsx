
import React, { useState } from 'react';
import Button from '../shared/Button';
import { simulateCodeExecution, debugCode, reviewCode } from '../../services/geminiService';
import type { CodeReviewResult } from '../../types';
import Spinner from '../shared/Spinner';

const LANGUAGES = ['Python', 'JavaScript', 'C++', 'Java', 'HTML/CSS'];

const CodingLab: React.FC = () => {
    const [code, setCode] = useState('print("Hello, IntellBuddy!")');
    const [errorMsg, setErrorMsg] = useState('');
    const [language, setLanguage] = useState('Python');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isDebugging, setIsDebugging] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);
    const [reviewResult, setReviewResult] = useState<CodeReviewResult | null>(null);
    const [activeTab, setActiveTab] = useState<'terminal' | 'review'>('terminal');

    const handleRunCode = async () => {
        setIsRunning(true);
        setActiveTab('terminal');
        setOutput(""); // Clear for new run
        const result = await simulateCodeExecution(code, language);
        setOutput(result);
        setIsRunning(false);
    };

    const handleReviewCode = async () => {
        setIsReviewing(true);
        setActiveTab('review');
        const result = await reviewCode(code, language);
        if (result) {
            setReviewResult(result);
        } else {
            alert("AI Reviewer: Could not process code for review.");
        }
        setIsReviewing(false);
    };
    
    const handleDebug = async () => {
        if (!code.trim() || !errorMsg.trim()) {
            alert("Please paste the error message to trigger the AI Fixer.");
            return;
        }
        setIsDebugging(true);
        const result = await debugCode(code, errorMsg);
        if (result && result.length > 5) {
            setCode(result);
            setErrorMsg('');
            setOutput("> Code fixed and applied to editor.");
            setActiveTab('terminal');
        } else {
            alert("AI Fixer: Could not determine a stable fix for this error.");
        }
        setIsDebugging(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-10rem)] animate-slide-up">
            <div className="flex flex-col bg-secondary rounded-xl shadow-lg border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-accent bg-black/20">
                    <div className="flex gap-2 overflow-x-auto">
                        {LANGUAGES.map(lang => (
                            <button 
                                key={lang} 
                                onClick={() => setLanguage(lang)}
                                className={`px-3 py-1 text-[10px] rounded-full transition-all flex-shrink-0 ${language === lang ? 'bg-brand text-primary font-bold shadow-[0_0_10px_#38bdf8]' : 'text-text-secondary hover:bg-white/5'}`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleReviewCode} isLoading={isReviewing} variant="secondary" className="px-4 py-2 text-[10px] font-black tracking-widest bg-brand/5 border-brand/20 text-brand hover:bg-brand hover:text-primary">
                            REVIEW
                        </Button>
                        <Button onClick={handleRunCode} isLoading={isRunning} className="px-5 py-2 text-[10px] font-black tracking-widest">
                            RUN
                        </Button>
                    </div>
                </div>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-grow w-full p-6 bg-transparent text-text-primary font-mono text-sm resize-none focus:outline-none"
                    placeholder="Write your code here..."
                    spellCheck={false}
                />
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex-1 flex flex-col bg-slate-950 rounded-xl shadow-lg border border-white/5 overflow-hidden">
                    <div className="flex border-b border-white/5 bg-white/5">
                        <button 
                            onClick={() => setActiveTab('terminal')}
                            className={`px-4 py-3 font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'terminal' ? 'bg-brand/10 text-brand border-b-2 border-brand' : 'text-text-secondary hover:text-white'}`}
                        >
                            OUTPUT
                        </button>
                        <button 
                            onClick={() => setActiveTab('review')}
                            className={`px-4 py-3 font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'review' ? 'bg-brand/10 text-brand border-b-2 border-brand' : 'text-text-secondary hover:text-white'}`}
                        >
                            AI REVIEW {reviewResult && <span className="ml-1 bg-brand text-primary px-1 rounded">{reviewResult.score}</span>}
                        </button>
                    </div>

                    <div className="flex-grow p-5 overflow-y-auto">
                        {activeTab === 'terminal' ? (
                            <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap selection:bg-green-400 selection:text-black">
                                {isRunning ? <Spinner size="sm" /> : output || "Ready."}
                            </pre>
                        ) : (
                            <div className="space-y-4 animate-reveal">
                                {isReviewing ? (
                                    <div className="flex flex-col items-center justify-center h-full py-10 opacity-60">
                                        <Spinner size="md" />
                                        <p className="mt-4 text-[10px] font-black text-brand uppercase tracking-widest">Architecting Review...</p>
                                    </div>
                                ) : reviewResult ? (
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-xs font-black text-white uppercase mb-2 tracking-widest">EXECUTIVE SUMMARY</h4>
                                            <p className="text-xs text-text-secondary leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{reviewResult.summary}</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {reviewResult.categories.map((cat, i) => (
                                                <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl group hover:border-brand/30 transition-all">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-[10px] font-black text-brand uppercase tracking-widest">{cat.name}</span>
                                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                                                            cat.severity === 'high' ? 'bg-red-500/20 text-red-400' : 
                                                            cat.severity === 'medium' ? 'bg-orange-500/20 text-orange-400' : 
                                                            'bg-green-500/20 text-green-400'
                                                        }`}>
                                                            {cat.severity} PRIORITY
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-text-secondary leading-relaxed">{cat.feedback}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full py-10 opacity-30">
                                        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-[10px] font-black uppercase tracking-widest">No review generated</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex-shrink-0 flex flex-col bg-secondary rounded-xl shadow-lg border border-white/5 p-5 gap-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-black text-text-primary text-[10px] uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            Quick AI Fixer
                        </h3>
                    </div>
                    <textarea
                        value={errorMsg}
                        onChange={(e) => setErrorMsg(e.target.value)}
                        className="w-full p-3 bg-accent border border-white/10 rounded-lg text-text-secondary font-mono text-xs resize-none focus:outline-none focus:ring-1 focus:ring-red-500/50"
                        placeholder="Paste terminal error here to auto-fix code..."
                        rows={3}
                    />
                    <Button onClick={handleDebug} isLoading={isDebugging} className="w-full text-xs py-3 font-black bg-brand/10 text-brand border border-brand/20 hover:bg-brand hover:text-primary transition-all">
                        ANALYZE & APPLY FIX
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CodingLab;
