import React, { useState, useEffect } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import GlassCard from '../shared/GlassCard';
import { getFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';
import { useAppStore } from '../../store/useAppStore';

interface Subject {
    id: string;
    name: string;
    credits: number;
    grade: string;
}

const GRADE_POINTS: Record<string, number> = {
    'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0
};

const CGPACalculator: React.FC = () => {
    const { user } = useAppStore();
    const storageKeySubjects = user ? `subjects_${user.id}` : 'subjects_guest';
    const storageKeyCgpa = user ? `last_cgpa_${user.id}` : 'last_cgpa_guest';

    const [subjects, setSubjects] = useState<Subject[]>(() => getFromLocalStorage(storageKeySubjects, [
        { id: '1', name: 'Core Engineering', credits: 4, grade: 'O' },
        { id: '2', name: 'Applied Mathematics', credits: 3, grade: 'A+' }
    ]));
    const [cgpa, setCgpa] = useState<number>(0);

    useEffect(() => {
        let totalCredits = 0;
        let totalGradePoints = 0;
        
        subjects.forEach(sub => {
            if (sub.credits > 0) {
                totalCredits += sub.credits;
                totalGradePoints += GRADE_POINTS[sub.grade] * sub.credits;
            }
        });

        const score = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
        setCgpa(score);
        saveToLocalStorage(storageKeySubjects, subjects);
        saveToLocalStorage(storageKeyCgpa, score);
    }, [subjects, storageKeySubjects, storageKeyCgpa]);

    const addSubject = () => {
        setSubjects([...subjects, { id: Date.now().toString(), name: `New Subject`, credits: 3, grade: 'A' }]);
    };

    const removeSubject = (id: string) => {
        if (subjects.length > 1) {
            setSubjects(subjects.filter(s => s.id !== id));
        }
    };

    const updateSubject = (id: string, field: keyof Subject, value: any) => {
        setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-reveal">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-text-primary tracking-tight uppercase italic">Academic Sync Engine</h2>
                    <p className="text-text-secondary text-sm">Real-time CGPA tracking with automated local storage sync.</p>
                </div>
                <div className="bg-brand/20 border border-brand/50 p-4 rounded-2xl shadow-[0_0_30px_rgba(56,189,248,0.2)] min-w-[160px] text-center">
                    <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-1">Cumulative GPA</p>
                    <p className="text-4xl font-black text-white leading-none">{cgpa.toFixed(2)}</p>
                </div>
            </div>

            <Card className="p-0 border-white/5 overflow-hidden glass shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="p-5 text-[10px] font-black text-text-secondary uppercase tracking-widest">Subject Identity</th>
                                <th className="p-5 text-[10px] font-black text-text-secondary uppercase tracking-widest">Credits</th>
                                <th className="p-5 text-[10px] font-black text-text-secondary uppercase tracking-widest">Target Grade</th>
                                <th className="p-5 text-[10px] font-black text-text-secondary uppercase tracking-widest text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {subjects.map((sub) => (
                                <tr key={sub.id} className="hover:bg-white/5 transition-all group">
                                    <td className="p-5">
                                        <input 
                                            type="text" 
                                            className="bg-transparent text-white font-bold outline-none w-full border-b border-transparent focus:border-brand/40 pb-1 transition-all"
                                            value={sub.name}
                                            onChange={(e) => updateSubject(sub.id, 'name', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-5">
                                        <input 
                                            type="number" 
                                            className="bg-accent/40 border border-white/5 rounded-xl p-2.5 text-white w-20 outline-none focus:ring-1 focus:ring-brand text-center font-black"
                                            value={sub.credits || ''}
                                            onChange={(e) => updateSubject(sub.id, 'credits', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                    <td className="p-5">
                                        <select 
                                            className="bg-accent/40 border border-white/5 rounded-xl p-2.5 text-white w-24 outline-none focus:ring-1 focus:ring-brand font-black cursor-pointer"
                                            value={sub.grade}
                                            onChange={(e) => updateSubject(sub.id, 'grade', e.target.value)}
                                        >
                                            {Object.keys(GRADE_POINTS).map(g => <option key={g} value={g} className="bg-secondary">{g}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-5 text-center">
                                        <button 
                                            onClick={() => removeSubject(sub.id)}
                                            className="text-red-400 hover:text-red-300 transition-all p-2 hover:bg-red-500/10 rounded-xl"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 bg-white/5 border-t border-white/10 flex justify-center">
                    <button 
                        onClick={addSubject}
                        className="flex items-center gap-3 text-brand text-[10px] font-black uppercase tracking-widest hover:text-white transition-all bg-brand/5 px-8 py-3.5 rounded-2xl border border-brand/20 hover:bg-brand shadow-lg"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        Add Subject Entry
                    </button>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="border-none bg-gradient-to-br from-brand/10 to-transparent">
                    <h4 className="text-[10px] font-black text-brand uppercase mb-2 tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></div>
                        Mastery Protocol
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                        Data synced to secure local storage. High-credit subjects weigh more heavily on your score. To increase your CGPA quickly, focus on getting 'O' grades in your 4-credit courses.
                    </p>
                </GlassCard>
                <GlassCard className="border-none bg-gradient-to-br from-purple-500/10 to-transparent">
                    <h4 className="text-[10px] font-black text-purple-400 uppercase mb-2 tracking-widest">Academic Tier</h4>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white italic tracking-tighter">
                            {cgpa >= 9 ? 'DISTINCTION' : cgpa >= 7.5 ? 'ELITE' : cgpa >= 6 ? 'STABLE' : 'ACTION REQUIRED'}
                        </span>
                    </div>
                    <p className="text-[10px] text-text-secondary mt-2 uppercase font-bold opacity-60">Status: {cgpa >= 7.5 ? 'Active Link Optimal' : 'Needs Optimization'}</p>
                </GlassCard>
            </div>
        </div>
    );
};

export default CGPACalculator;