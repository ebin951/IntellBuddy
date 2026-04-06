
import React, { useState } from 'react';
import type { StudyGuideContent } from '../../types';
import { generateStudyGuide } from '../../services/geminiService';
import Button from '../shared/Button';
import Card from '../shared/Card';
import Spinner from '../shared/Spinner';

const DocumentTextIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

const LightBulbIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m-8.468-6.387a6.01 6.01 0 0 1 1.5-.189m-1.5.189a6.01 6.01 0 0 0-1.5-.189m11.218 8.866a12.06 12.06 0 0 1-4.5 0m-8.468-6.387a6.01 6.01 0 0 1 1.5-.189m-1.5.189a6.01 6.01 0 0 0-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m8.468-6.387a6.01 6.01 0 0 1-1.5.189m1.5-.189a6.01 6.01 0 0 0 1.5.189m-3.75-7.478a12.06 12.06 0 0 1 4.5 0m-3.75-2.311a6.01 6.01 0 0 1-1.5.189m1.5-.189a6.01 6.01 0 0 0 1.5.189M12 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    </svg>
);

const BeakerIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.5 1.591L5.22 15.75M9.75 3.104a2.25 2.25 0 0 1 4.5 0v5.714a2.25 2.25 0 0 0 .5 1.591l3.53 4.341M9.75 3.104a2.25 2.25 0 0 0-4.5 0v5.714a2.25 2.25 0 0 1-.5 1.591L.22 15.75m14.06-12.646a2.25 2.25 0 0 1 4.5 0v5.714a2.25 2.25 0 0 0 .5 1.591l3.53 4.341M3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5v-1.5a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v1.5a1.5 1.5 0 0 0 1.5 1.5Z" />
    </svg>
);


const StudyGuideGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [guide, setGuide] = useState<StudyGuideContent | null>(null);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic.');
            return;
        }
        setIsLoading(true);
        setError('');
        setGuide(null);
        try {
            const result = await generateStudyGuide(topic);
            if (result) {
                setGuide(result);
            } else {
                setError('Failed to generate study guide. The AI may be busy. Please try again.');
            }
        } catch (e) {
            setError('An unexpected error occurred. Please check the console.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-slide-in-up">
            <Card className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-2">Study Guide Generator</h2>
                <p className="text-text-secondary mb-4">Enter a topic, subject, or concept, and let AI create a comprehensive study guide for you.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., 'Quantum Mechanics' or 'The French Revolution'"
                        className="flex-grow bg-accent border border-highlight rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand"
                        disabled={isLoading}
                    />
                    <Button onClick={handleGenerate} isLoading={isLoading}>Generate Guide</Button>
                </div>
                {error && <p className="text-red-400 mt-2">{error}</p>}
            </Card>

            {isLoading && <Spinner />}

            {guide && (
                <div className="space-y-6 animate-fade-in">
                    <Card>
                        <h3 className="flex items-center text-xl font-semibold text-brand mb-3">
                            <DocumentTextIcon className="w-6 h-6 mr-2" />
                            Summary
                        </h3>
                        <p className="text-text-secondary whitespace-pre-wrap">{guide.summary}</p>
                    </Card>
                    <Card>
                        <h3 className="flex items-center text-xl font-semibold text-brand mb-3">
                            <LightBulbIcon className="w-6 h-6 mr-2" />
                            Key Points
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-text-secondary">
                            {guide.keyPoints.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                    </Card>
                    <Card>
                        <h3 className="flex items-center text-xl font-semibold text-brand mb-3">
                            <BeakerIcon className="w-6 h-6 mr-2" />
                            Potential Exam Questions
                        </h3>
                        <ul className="list-decimal list-inside space-y-2 text-text-secondary">
                            {guide.examQuestions.map((question, index) => (
                                <li key={index}>{question}</li>
                            ))}
                        </ul>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default StudyGuideGenerator;
