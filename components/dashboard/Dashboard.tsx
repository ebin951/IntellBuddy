import React, { useState, useEffect } from 'react';
import GlassCard from '../shared/GlassCard';
import type { UserStats } from '../../types';
import { getFromLocalStorage } from '../../utils/localStorage';
import { useAppStore } from '../../store/useAppStore';

const Dashboard: React.FC<{ userName: string }> = ({ userName }) => {
    const { user } = useAppStore();
    const [stats, setStats] = useState<UserStats>({
        xp: 0,
        level: 1,
        streak: 0,
        totalHours: 0,
        nextLevelXp: 1000,
        studyCycle: [
            { day: 'Mon', hours: 4 }, { day: 'Tue', hours: 6 }, { day: 'Wed', hours: 3 },
            { day: 'Thu', hours: 8 }, { day: 'Fri', hours: 5 }, { day: 'Sat', hours: 7 }, { day: 'Sun', hours: 4 },
        ]
    });

    const [currentCgpa, setCurrentCgpa] = useState(0);

    useEffect(() => {
        // Fetch CGPA from local storage, specific to user if available
        const savedCgpa = getFromLocalStorage(`last_cgpa_${user?.id}`, 0);
        setCurrentCgpa(savedCgpa);

        // Load user profile stats from local storage or use defaults
        if (user) {
            const userProfileStats = getFromLocalStorage(`user_stats_${user.id}`, {
                xp: user.xp,
                level: user.level,
                streak: user.streak,
                totalHours: user.totalHours,
                nextLevelXp: (user.level + 1) * 1000 // Example progression logic
            });
            setStats(prev => ({
                ...prev,
                ...userProfileStats
            }));
        }
    }, [user]);

    const xpPercentage = Math.min((stats.xp / stats.nextLevelXp) * 100, 100);
    const maxHours = Math.max(...stats.studyCycle.map(d => d.hours));

    return (
        <div className="space-y-8 animate-reveal">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Node Active <span className="text-brand">/ {userName}</span>
                    </h2>
                    <p className="text-text-secondary mt-1 text-[10px] font-black tracking-[0.2em] uppercase">System Status: <span className="text-green-400">Optimal Sync</span></p>
                </div>
                <div className="flex items-center gap-6 bg-white/5 backdrop-blur-xl rounded-[24px] p-5 border border-white/5 shadow-2xl">
                    <div className="text-center px-4">
                        <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-1">Rank</p>
                        <p className="text-2xl font-black text-brand italic">L-{stats.level}</p>
                    </div>
                    <div className="h-12 w-[1px] bg-white/10"></div>
                    <div className="text-center px-4">
                        <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-1">CGPA</p>
                        <p className="text-2xl font-black text-white italic">{currentCgpa.toFixed(2)}</p>
                    </div>
                    <div className="h-12 w-[1px] bg-white/10"></div>
                    <div className="text-center px-4">
                        <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-1">Streak</p>
                        <div className="flex items-center gap-2">
                            <p className="text-2xl font-black text-orange-400">{stats.streak}D</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GlassCard className="lg:col-span-2 border-brand/20 bg-secondary/40">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-[10px] font-black flex items-center gap-3 text-white uppercase tracking-[0.2em]">
                            <div className="w-2 h-2 rounded-full bg-brand shadow-[0_0_10px_#38bdf8]"></div>
                            Temporal Focus Metrics
                        </h3>
                        <p className="text-[9px] text-text-secondary font-black uppercase">Sync Frequency</p>
                    </div>
                    <div className="flex items-end justify-between h-44 gap-4 px-4">
                        {stats.studyCycle.map((data, i) => (
                            <div key={i} className="flex flex-col items-center flex-1 group">
                                <div 
                                    className="w-full bg-brand/10 border-t-2 border-brand/40 rounded-t-lg transition-all duration-700 ease-out group-hover:bg-brand/30 group-hover:border-brand relative"
                                    style={{ height: `${(data.hours / maxHours) * 100}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand text-primary text-[9px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                        {data.hours}H
                                    </div>
                                </div>
                                <span className="text-[9px] text-text-secondary mt-4 font-black uppercase tracking-widest">{data.day}</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                <div className="space-y-6">
                    <GlassCard className="border-none flex flex-col justify-between h-full bg-gradient-to-br from-brand/20 to-transparent relative overflow-hidden">
                        <div className="absolute top-[-20%] right-[-20%] w-[150px] h-[150px] bg-brand/10 blur-[60px] rounded-full"></div>
                        <div>
                            <p className="text-[10px] font-black text-text-secondary uppercase mb-1 tracking-widest">Level Progress</p>
                            <p className="text-3xl font-black text-white italic">{Math.round(xpPercentage)}%</p>
                        </div>
                        <div className="mt-8">
                            <div className="overflow-hidden h-3 rounded-full bg-white/5 border border-white/5 p-[2px]">
                                <div 
                                    style={{ width: `${xpPercentage}%` }} 
                                    className="shadow-[0_0_15px_#38bdf8] h-full rounded-full bg-brand transition-all duration-1000 ease-in-out"
                                ></div>
                            </div>
                            <p className="text-[9px] text-text-secondary mt-4 font-black uppercase tracking-widest text-right">{stats.xp} / {stats.nextLevelXp} XP REMAINING</p>
                        </div>
                    </GlassCard>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[
                    { label: 'COGNITIVE LOAD', val: '88%', sub: 'Optimized', color: 'text-green-400' },
                    { label: 'QUERIES RESOLVED', val: '42', sub: 'Last 7 Days', color: 'text-brand' },
                    { label: 'SYNC ACCURACY', val: '94.2%', sub: 'High Fidelity', color: 'text-purple-400' },
                    { label: 'TOTAL UPTIME', val: `${stats.totalHours}H`, sub: 'Total Study Time', color: 'text-orange-400' }
                 ].map((stat, i) => (
                    <GlassCard key={i} className="flex flex-col justify-center border-none p-6 bg-white/5 hover:bg-white/10 transition-all">
                        <p className="text-[9px] font-black text-text-secondary uppercase mb-3 tracking-widest">{stat.label}</p>
                        <p className={`text-3xl font-black italic ${stat.color}`}>{stat.val}</p>
                        <p className="text-[8px] text-text-secondary font-black uppercase mt-2 tracking-widest opacity-40">{stat.sub}</p>
                    </GlassCard>
                 ))}
            </div>
        </div>
    );
};

export default Dashboard;