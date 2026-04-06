
import React, { useState } from 'react';
import type { QuizQuestion } from '../../types';
import { generateAptitudeQuestions } from '../../services/geminiService';
import Button from '../shared/Button';
import Card from '../shared/Card';
import Spinner from '../shared/Spinner';
import GlassCard from '../shared/GlassCard';

const CHAPTERS = ["Number Systems", "Time & Work", "Profit & Loss", "Speed & Distance", "Logic & Venn Diagrams"];
const LEVELS = ["Basic", "Intermediate", "Advanced"];

const AptitudeTrainer: React.FC = () => {
    const [chapter, setChapter] = useState(CHAPTERS[0]);
    const [level, setLevel] = useState(LEVELS[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);

    const handleStart = async () => {
        setIsLoading(true);
        const res = await generateAptitudeQuestions(chapter, level);
        if (res) {
            setQuestions(res);
            setCurrentIdx(0);
            setScore(0);
            setSelected(null);
            setShowExplanation(false);
        }
        setIsLoading(false);
    };

    const handleAnswer = (opt: string) => {
        if (showExplanation) return;
        setSelected(opt);
        setShowExplanation(true);
        if (opt === questions[currentIdx].answer) setScore(s => s + 1);
    };

    const next = () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(c => c + 1);
            setSelected(null);
            setShowExplanation(false);
        } else {
            setQuestions([]);
        }
    };

    if (isLoading) return <Spinner />;

    if (questions.length === 0) {
        return (
            <div className="max-w-3xl mx-auto space-y-6 animate-reveal">
                <GlassCard className="border-brand/40">
                    <h2 className="text-3xl font-black text-brand mb-4">CHAPTER-WISE APTITUDE TRAINING</h2>
                    <p className="text-text-secondary mb-8">Train your brain from core fundamentals to advanced competitive levels.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Select Chapter</label>
                            <select 
                                className="w-full bg-accent p-4 rounded-xl text-text-primary border border-white/10"
                                value={chapter}
                                onChange={e => setChapter(e.target.value)}
                            >
                                {CHAPTERS.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Target Difficulty</label>
                            <div className="flex gap-2">
                                {LEVELS.map(l => (
                                    <button 
                                        key={l}
                                        onClick={() => setLevel(l)}
                                        className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold transition-all border ${level === l ? 'bg-brand text-primary border-brand' : 'bg-white/5 text-text-secondary border-white/10'}`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Button onClick={handleStart} className="w-full py-4 text-lg">Initialize Training Session</Button>
                </GlassCard>
            </div>
        );
    }

    const q = questions[currentIdx];
    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-reveal">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-text-secondary">
                <span>{chapter} ({level}) : {currentIdx + 1} / {questions.length}</span>
                <span className="text-brand">Score: {score}</span>
            </div>
            <Card className="bg-slate-900 border-white/5">
                <h3 className="text-xl font-bold text-text-primary mb-6">{q.question}</h3>
                <div className="space-y-3">
                    {q.options.map(opt => (
                        <button
                            key={opt}
                            onClick={() => handleAnswer(opt)}
                            disabled={showExplanation}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${
                                showExplanation 
                                ? opt === q.answer ? 'bg-green-500/20 border-green-500 text-green-400 font-bold' : opt === selected ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-transparent opacity-50'
                                : 'bg-white/5 border-white/5 hover:border-brand hover:bg-white/10'
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
                {showExplanation && (
                    <div className="mt-6 p-6 rounded-xl bg-brand/10 border border-brand/20 text-sm animate-fade-in">
                        <p className="font-bold text-brand mb-2 uppercase tracking-widest">Mastery Insight:</p>
                        <p className="text-text-secondary leading-relaxed">{q.explanation}</p>
                        <Button onClick={next} className="mt-6 w-full">Next Challenge</Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AptitudeTrainer;
