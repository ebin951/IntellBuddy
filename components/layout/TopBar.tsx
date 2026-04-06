import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '../shared/GlassCard';
import Button from '../shared/Button';
import { useAppStore } from '../../store/useAppStore';

interface TopBarProps {
  setSidebarOpen: (open: boolean) => void;
  onToggleNotifications: () => void;
}

const ClockIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const MenuIcon = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
);

const TopBar: React.FC<TopBarProps> = ({ setSidebarOpen, onToggleNotifications }) => {
  const { activeView, startGame } = useAppStore();
  const [showAlarmSetter, setShowAlarmSetter] = useState(false);
  const [reminderTime, setReminderTime] = useState('');
  // Use 'any' for timer ID to handle both NodeJS.Timeout and number (browser) types gracefully
  const [alarms, setAlarms] = useState<{ id: any; time: string; timer: any }[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  // Robust synthetic alarm sound using Web Audio API
  const playSyntheticAlarm = () => {
    try {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        ctx.resume().then(() => {
            const playBeep = (freq: number, startTime: number, duration: number) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'square';
                osc.frequency.setValueAtTime(freq, startTime);
                osc.frequency.exponentialRampToValueAtTime(freq / 2, startTime + duration);
                
                gain.gain.setValueAtTime(0.2, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.start(startTime);
                osc.stop(startTime + duration);
            };

            // Play a sequence of 3 beeps
            const now = ctx.currentTime;
            playBeep(880, now, 0.4);
            playBeep(880, now + 0.5, 0.4);
            playBeep(1320, now + 1.0, 0.6);
        });
    } catch (e) {
        console.error("Audio trigger failed", e);
    }
  };

  const handleSetReminder = () => {
    if (!reminderTime) return;
    
    // Resume/Start AudioContext on user gesture to satisfy browser policies
    if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    audioCtxRef.current.resume();

    const now = new Date();
    const [hours, minutes] = reminderTime.split(':').map(Number);
    const alarmDate = new Date();
    alarmDate.setHours(hours, minutes, 0, 0);

    // If time has passed today, set for tomorrow
    if (alarmDate <= now) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }

    const diff = alarmDate.getTime() - now.getTime();
    
    const timerId = setTimeout(() => {
        // Audio + Notification fallback
        playSyntheticAlarm();
        
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("A Student Assistant", {
                body: `Study Reminder: It's ${reminderTime}! Time to sync.`,
                icon: "/vite.svg"
            });
        }
        
        alert(`🚨 NEURAL LINK REMINDER: It is ${reminderTime}! Your session is starting now.`);
        
        setAlarms(prev => prev.filter(a => a.id !== timerId));
    }, diff);

    setAlarms(prev => [...prev, { id: timerId, time: reminderTime, timer: timerId }]);
  };

  const removeAlarm = (id: any) => {
    const alarm = alarms.find(a => a.id === id);
    if (alarm) {
      clearTimeout(alarm.timer);
      setAlarms(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <header className="flex items-center justify-between h-20 px-6 bg-secondary border-b border-white/5 flex-shrink-0 relative">
      <div className="flex items-center">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4 text-text-secondary">
          <MenuIcon />
        </button>
        <h1 className="text-xl font-black text-white tracking-tighter uppercase italic">{activeView}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
            onClick={() => setShowAlarmSetter(!showAlarmSetter)}
            className={`relative transition-all p-2 rounded-xl border ${alarms.length > 0 ? 'bg-brand/20 border-brand/50 text-brand animate-pulse' : 'text-text-secondary hover:text-brand bg-white/5 border-white/5'}`}
            title="Study Alarm"
        >
            <ClockIcon className="w-5 h-5" />
            {alarms.length > 0 && <span className="absolute -top-1 -right-1 bg-brand text-primary text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.5)]">{alarms.length}</span>}
        </button>
        <button
            onClick={startGame}
            className="text-text-secondary hover:text-brand transition-colors p-2 bg-white/5 rounded-xl border border-white/5"
            title="Bingo Brain"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </button>
        <button 
            onClick={onToggleNotifications}
            className="relative text-text-secondary hover:text-brand p-2 bg-white/5 rounded-xl border border-white/5"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        </button>
      </div>

      {showAlarmSetter && (
          <div className="absolute top-24 right-6 w-72 z-[100] animate-reveal">
              <GlassCard className="border-brand/30 shadow-2xl">
                  <h4 className="text-[10px] font-black text-brand uppercase mb-4 tracking-widest">Neural Link Timers</h4>
                  
                  {alarms.length > 0 && (
                    <div className="mb-4 space-y-1.5 max-h-32 overflow-y-auto">
                      {alarms.map(alarm => (
                        <div key={alarm.id} className="flex justify-between items-center bg-white/5 p-2.5 rounded-xl border border-white/5 text-[9px]">
                          <span className="text-white font-bold tracking-wider">SYNC @ {alarm.time}</span>
                          <button onClick={() => removeAlarm(alarm.id)} className="text-red-400 font-bold hover:text-red-300 uppercase">Void</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-[8px] text-text-secondary font-black uppercase mb-2 tracking-tighter text-center">Program New Link</p>
                    <input 
                      type="time" 
                      className="w-full bg-primary border border-white/10 rounded-xl p-3 text-white text-xs mb-4 focus:ring-1 focus:ring-brand outline-none"
                      value={reminderTime}
                      onChange={e => setReminderTime(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSetReminder} className="flex-1 text-[10px] py-2 font-black uppercase tracking-widest">Deploy</Button>
                      <Button onClick={() => setShowAlarmSetter(false)} variant="secondary" className="flex-1 text-[10px] py-2 font-black uppercase tracking-widest">Abort</Button>
                    </div>
                  </div>
              </GlassCard>
          </div>
      )}
    </header>
  );
};

export default TopBar;