import React, { useState } from 'react';
import type { QuizQuestion } from '../../types';
import { generateQuiz } from '../../services/geminiService';
import Button from '../shared/Button';
import Card from '../shared/Card';
import Spinner from '../shared/Spinner';

const AutoQuiz: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [error, setError] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic.');
            return;
        }
        setIsLoading(true);
        setError('');
        setQuestions([]);
        setQuizFinished(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        
        try {
            const result = await generateQuiz(topic);
            if (result && result.length > 0) {
                setQuestions(result);
            } else {
                setError('Failed to generate a quiz. Please try a different topic.');
            }
        } catch (e) {
            setError('An unexpected error occurred.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAnswerSelect = (option: string) => {
        if (showFeedback) return;
        setSelectedAnswer(option);
    };

    const handleNextQuestion = () => {
        if (!selectedAnswer) return;

        setShowFeedback(true);
        const isCorrect = selectedAnswer === questions[currentQuestionIndex].answer;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            setShowFeedback(false);
            setSelectedAnswer(null);
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setQuizFinished(true);
            }
        }, 1500);
    };

    const resetQuiz = () => {
        setTopic('');
        setQuestions([]);
        setQuizFinished(false);
    }
    
    const getOptionClasses = (option: string) => {
        if (!showFeedback) {
            return selectedAnswer === option ? 'bg-brand text-primary' : 'bg-accent hover:bg-highlight';
        }
        const correctAnswer = questions[currentQuestionIndex].answer;
        if (option === correctAnswer) return 'bg-green-500 text-white';
        if (option === selectedAnswer && option !== correctAnswer) return 'bg-red-500 text-white';
        return 'bg-accent';
    };

    if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

    if (quizFinished) {
        return (
            <div className="max-w-2xl mx-auto text-center animate-fade-in">
                <Card>
                    <h2 className="text-3xl font-bold text-brand mb-4">Quiz Complete!</h2>
                    <p className="text-xl text-text-secondary mb-6">You scored</p>
                    <p className="text-6xl font-bold text-text-primary mb-8">{score} / {questions.length}</p>
                    <Button onClick={resetQuiz}>Take Another Quiz</Button>
                </Card>
            </div>
        );
    }

    if (questions.length > 0) {
        const currentQuestion = questions[currentQuestionIndex];
        // Fix: Define isCorrect in the render scope to be accessible in the JSX.
        const isCorrect = selectedAnswer === currentQuestion.answer;
        return (
            <div className="max-w-2xl mx-auto animate-fade-in">
                <Card>
                    <div className="mb-6">
                        <p className="text-sm text-brand font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</p>
                        <h2 className="text-2xl font-semibold text-text-primary mt-1">{currentQuestion.question}</h2>
                    </div>
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(option)}
                                className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${getOptionClasses(option)}`}
                                disabled={showFeedback}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    <Button onClick={handleNextQuestion} disabled={!selectedAnswer || showFeedback} className="mt-6 w-full">
                        {showFeedback ? (isCorrect ? 'Correct!' : 'Incorrect!') : 'Submit'}
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto animate-slide-in-up">
            <Card>
                <h2 className="text-2xl font-bold text-text-primary mb-2">Auto Quiz Generator</h2>
                <p className="text-text-secondary mb-4">Test your knowledge. Enter a topic to generate a quiz.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., 'Cell Biology' or 'World War II'"
                        className="flex-grow bg-accent border border-highlight rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                    <Button onClick={handleGenerate}>Start Quiz</Button>
                </div>
                {error && <p className="text-red-400 mt-2">{error}</p>}
            </Card>
        </div>
    );
};

export default AutoQuiz;