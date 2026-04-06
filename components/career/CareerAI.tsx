
import React, { useState } from 'react';
import type { CareerRecommendation } from '../../types';
import { getCareerRecommendations } from '../../services/geminiService';
import Button from '../shared/Button';
import Card from '../shared/Card';
import Spinner from '../shared/Spinner';

const EDUCATION_LEVELS = ["12th Grade Completed", "Undergraduate Completed", "Postgraduate Completed"];

const LightBulbIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m-8.468-6.387a6.01 6.01 0 0 1 1.5-.189m-1.5.189a6.01 6.01 0 0 0-1.5-.189m11.218 8.866a12.06 12.06 0 0 1-4.5 0m-8.468-6.387a6.01 6.01 0 0 1 1.5-.189m-1.5.189a6.01 6.01 0 0 0 1.5.189m3.75 7.478a12.06 12.06 0 0 1 4.5 0m8.468-6.387a6.01 6.01 0 0 1-1.5.189m1.5-.189a6.01 6.01 0 0 0 1.5.189M12 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    </svg>
);

const AcademicCapIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
);

const CareerAI: React.FC = () => {
    const [level, setLevel] = useState(EDUCATION_LEVELS[0]);
    const [interests, setInterests] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!interests.trim()) {
            setError('Please describe your interests.');
            return;
        }
        setIsLoading(true);
        setError('');
        setRecommendations([]);

        try {
            const result = await getCareerRecommendations(level, interests);
            if (result && result.length > 0) {
                setRecommendations(result);
            } else {
                setError('Could not generate recommendations. The AI might be busy or the topic too specific. Please try again.');
            }
        } catch (e) {
            setError('An unexpected error occurred. Please check the console.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-slide-in-up space-y-8">
            <Card>
                <h2 className="text-2xl font-bold text-text-primary mb-2">AI Career Coach</h2>
                <p className="text-text-secondary mb-6">Get personalized career and course recommendations based on your interests.</p>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">1. Select your current education level:</label>
                        <div className="flex flex-wrap gap-2">
                            {EDUCATION_LEVELS.map(l => (
                                <button
                                    key={l}
                                    onClick={() => setLevel(l)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${level === l ? 'bg-brand text-primary' : 'bg-accent hover:bg-highlight'}`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="interests" className="block text-sm font-medium text-text-secondary mb-2">2. Describe your interests and skills:</label>
                        <textarea
                            id="interests"
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                            placeholder="e.g., 'I love solving complex math problems, I'm passionate about technology and AI, and I enjoy creative writing.'"
                            className="w-full h-32 bg-accent border border-highlight rounded-lg p-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand resize-y"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div>
                        <Button onClick={handleSubmit} isLoading={isLoading}>Get Recommendations</Button>
                    </div>
                    {error && <p className="text-red-400 mt-2">{error}</p>}
                </div>
            </Card>

            {isLoading && <Spinner />}

            {recommendations.length > 0 && (
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-text-primary">Your Recommended Career Paths</h3>
                    {recommendations.map((rec, index) => (
                        <Card key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms`}}>
                            <h4 className="text-xl font-bold text-brand mb-3">{rec.careerPath}</h4>
                            <p className="text-text-secondary mb-4">{rec.description}</p>
                            
                            <div className="space-y-4">
                                <div>
                                    <h5 className="flex items-center text-md font-semibold text-text-primary mb-2">
                                        <AcademicCapIcon className="w-5 h-5 mr-2 text-brand" />
                                        Recommended Courses
                                    </h5>
                                    <ul className="list-disc list-inside space-y-1 text-text-secondary pl-2">
                                        {rec.recommendedCourses.map((course, i) => <li key={i}>{course}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="flex items-center text-md font-semibold text-text-primary mb-2">
                                        <LightBulbIcon className="w-5 h-5 mr-2 text-brand" />
                                        Why It's a Good Fit
                                    </h5>
                                    <p className="text-text-secondary">{rec.whyItFits}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CareerAI;
