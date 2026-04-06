
import React, { useState } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import GlassCard from '../shared/GlassCard';
import { generateAISchedule } from '../../services/geminiService';
import Spinner from '../shared/Spinner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIMES = ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM', '7 PM'];

const Planner: React.FC = () => {
    const [schedule, setSchedule] = useState<any>({});
    const [subjectInput, setSubjectInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleAutoPlan = async () => {
        const subjects = subjectInput.split(',').map(s => s.trim()).filter(Boolean);
        if (subjects.length === 0) return;
        setIsGenerating(true);
        const newSchedule = await generateAISchedule(subjects);
        setSchedule(newSchedule);
        setIsGenerating(false);
    };

    const renderEvent = (event: any) => {
        if (!event) return null;
        if (typeof event === 'string' || typeof event === 'number') return event;
        if (typeof event === 'object') {
            // Try to extract a meaningful string property or stringify
            return event.subject || event.title || event.name || event.value || JSON.stringify(event);
        }
        return String(event);
    };

    return (
        <div className="animate-slide-up space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-text-primary tracking-tight">AI STUDY PLANNER</h2>
                    <p className="text-text-secondary">Orchestrate your subjects into an optimized routine.</p>
                </div>
            </div>

            <GlassCard className="border-brand/40">
                <h3 className="font-bold text-brand mb-4 uppercase tracking-widest text-sm">Upload Your Subjects</h3>
                <div className="flex flex-col md:flex-row gap-4">
                    <input 
                        type="text" 
                        placeholder="Math, Physics, Bio, Python... (comma separated)"
                        className="flex-grow bg-accent border border-white/10 rounded-xl p-4 text-text-primary"
                        value={subjectInput}
                        onChange={e => setSubjectInput(e.target.value)}
                    />
                    <Button onClick={handleAutoPlan} isLoading={isGenerating} className="px-10">Generate Strategy</Button>
                </div>
            </GlassCard>

            <Card className="p-0 overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-black/40">
                                <th className="p-4 border border-white/5 text-left text-xs font-bold text-text-secondary uppercase">Time</th>
                                {DAYS.map(day => (
                                    <th key={day} className="p-4 border border-white/5 text-center text-xs font-bold text-text-secondary uppercase">
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TIMES.map(time => (
                                <tr key={time}>
                                    <td className="p-4 border border-white/5 bg-black/20 font-bold text-xs text-brand text-center">{time}</td>
                                    {DAYS.map(day => {
                                        const event = schedule[day]?.[time];
                                        return (
                                            <td key={`${day}-${time}`} className="p-2 border border-white/5 min-h-[100px] h-[100px] align-top bg-secondary/50 group hover:bg-white/5 transition-colors">
                                                {event && (
                                                    <div className="bg-brand text-primary rounded-lg p-3 text-xs font-black h-full flex items-center justify-center text-center shadow-lg transform group-hover:scale-[1.05] transition-transform">
                                                        {renderEvent(event)}
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Planner;
