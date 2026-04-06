
import React, { useState, useEffect } from 'react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import GlassCard from '../shared/GlassCard';
import Spinner from '../shared/Spinner';
import { generateEnglishChallenge } from '../../services/geminiService';

const EnglishTrainer: React.FC = () => {
    const [challenge, setChallenge] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [selected, setSelected] = useState<string | null>(null);

    const loadNewChallenge = async () => {
        setIsLoading(true);
        setFeedback('');
        setSelected(null);
        const res = await generateEnglishChallenge();
        setChallenge(res);
        setIsLoading(false);
    };

    useEffect(() => { loadNewChallenge(); }, []);

    const handleAnswer = (opt: string) => {
        setSelected(opt);
        if (opt === challenge.answer) {
            setFeedback("Excellent! Your fluency is improving.");
        } else {
            setFeedback(`Not quite. Hint: ${challenge.hint}`);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-reveal">
            <div className="text-center">
                <h2 className="text-3xl font-black text-text-primary tracking-tight">ENGLISH FLUENCY LAB</h2>
                <p className="text-text-secondary">Duolingo-style training for real-world speaking proficiency.</p>
            </div>

            {isLoading ? <Spinner /> : challenge ? (
                <GlassCard className="border-brand/30 p-10 text-center">
                    <p className="text-xs font-black text-brand uppercase tracking-widest mb-6">Complete the Phrase</p>
                    <h3 className="text-2xl font-bold text-text-primary mb-12 leading-relaxed">"{challenge.phrase}"</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {challenge.options.map((opt: string) => (
                            <button 
                                key={opt}
                                onClick={() => handleAnswer(opt)}
                                className={`p-5 rounded-2xl text-lg font-bold transition-all border-2 ${
                                    selected === opt 
                                    ? opt === challenge.answer ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400'
                                    : 'bg-white/5 border-white/5 hover:border-brand hover:bg-white/10'
                                }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>

                    {feedback && (
                        <div className={`p-4 rounded-xl font-bold mb-8 animate-fade-in ${selected === challenge.answer ? 'text-green-400 bg-green-500/10' : 'text-orange-400 bg-orange-500/10'}`}>
                            {feedback}
                        </div>
                    )}

                    <Button onClick={loadNewChallenge} className="w-full py-4 text-lg">Next Challenge</Button>
                </GlassCard>
            ) : null}
        </div>
    );
};

export default EnglishTrainer;
