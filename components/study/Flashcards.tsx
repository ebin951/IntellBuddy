
import React, { useState } from 'react';
import type { Flashcard } from '../../types';
import { generateFlashcards } from '../../services/geminiService';
import Button from '../shared/Button';
import Card from '../shared/Card';
import Spinner from '../shared/Spinner';

const ArrowUturnLeftIcon = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
    </svg>
);

const Flashcards: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleGenerate = async () => {
        if (!inputText.trim()) {
            setError('Please paste your notes or enter some text.');
            return;
        }
        setIsLoading(true);
        setError('');
        setFlashcards([]);
        try {
            const result = await generateFlashcards(inputText);
            if (result && result.length > 0) {
                setFlashcards(result);
                setCurrentCardIndex(0);
                setIsFlipped(false);
            } else {
                setError('Could not generate flashcards from the provided text. Please try again with more content.');
            }
        } catch (e) {
            setError('An unexpected error occurred.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFlip = () => setIsFlipped(prev => !prev);
    
    const handleNext = () => {
        if (currentCardIndex < flashcards.length - 1) {
            setIsFlipped(false);
            setCurrentCardIndex(prev => prev + 1);
        }
    };
    
    const handlePrev = () => {
        if (currentCardIndex > 0) {
            setIsFlipped(false);
            setCurrentCardIndex(prev => prev - 1);
        }
    };

    const handleReset = () => {
        setInputText('');
        setFlashcards([]);
        setError('');
    };

    const renderGenerator = () => (
        <Card className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-text-primary mb-2">AI Flashcard Generator</h2>
            <p className="text-text-secondary mb-4">Paste your notes below, and the AI will create flashcards with key terms and definitions for you.</p>
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g., The mitochondria is the powerhouse of the cell. It generates most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy."
                className="w-full h-48 bg-accent border border-highlight rounded-lg p-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand resize-y"
                disabled={isLoading}
            />
            <div className="mt-4">
                <Button onClick={handleGenerate} isLoading={isLoading}>Generate Flashcards</Button>
            </div>
            {error && <p className="text-red-400 mt-2">{error}</p>}
        </Card>
    );

    const renderViewer = () => {
        const currentCard = flashcards[currentCardIndex];
        return (
            <div className="max-w-2xl mx-auto flex flex-col items-center">
                {/* Flashcard with 3D flip effect */}
                <div style={{ perspective: '1000px' }} className="w-full h-80 mb-6">
                    <div
                        className="relative w-full h-full cursor-pointer transition-transform duration-700"
                        style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                        onClick={handleFlip}
                    >
                        <div className="absolute w-full h-full rounded-xl shadow-lg bg-secondary p-8 flex items-center justify-center text-center" style={{ backfaceVisibility: 'hidden' }}>
                            <p className="text-2xl font-semibold text-text-primary">{currentCard.front}</p>
                        </div>
                        <div className="absolute w-full h-full rounded-xl shadow-lg bg-brand p-8 flex items-center justify-center text-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                            <p className="text-lg font-medium text-primary">{currentCard.back}</p>
                        </div>
                    </div>
                </div>

                {/* Progress and Navigation */}
                <p className="text-text-secondary mb-4 font-semibold">Card {currentCardIndex + 1} of {flashcards.length}</p>
                <div className="flex items-center gap-4 mb-6">
                    <Button onClick={handlePrev} disabled={currentCardIndex === 0} variant="secondary">Previous</Button>
                    <Button onClick={handleNext} disabled={currentCardIndex === flashcards.length - 1} variant="secondary">Next</Button>
                </div>

                <Button onClick={handleReset} variant="secondary" className="flex items-center gap-2">
                    <ArrowUturnLeftIcon />
                    Create New Deck
                </Button>
            </div>
        );
    };

    return (
        <div className="animate-slide-in-up">
            {isLoading ? <Spinner /> : (flashcards.length > 0 ? renderViewer() : renderGenerator())}
        </div>
    );
};

export default Flashcards;
