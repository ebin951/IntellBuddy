import React, { useState, useRef, useEffect } from 'react';
import Card from '../shared/Card';
import { getFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';
import { UserProfile } from '../../types';

const UserIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);

const LockIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
);

const MailIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);

const PhoneIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
);

const BadgeIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
);

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
);

interface LoginProps {
    onLogin: (user: UserProfile) => void;
}

// Mock user storage
const mockUsers: Record<string, UserProfile> = getFromLocalStorage('mock_users', {});

const mockLoginUser = async (username: string, password: string): Promise<UserProfile | null> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const email = `${username.toLowerCase()}@example.com`;
    const user = Object.values(mockUsers).find(u => u.username === username && u.email === email);

    if (user && user.authSource === 'email' && password === 'password123') { // Simple mock password check
        return user;
    }
    throw new Error('Invalid username or password.');
};

const mockRegisterUser = async (
    username: string, 
    password: string, 
    fullName: string, 
    email: string, 
    phoneNumber: string
): Promise<UserProfile | null> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (mockUsers[username]) {
        throw new Error('Username already registered.');
    }

    const newUser: UserProfile = {
        id: `mock-${Date.now()}`,
        username,
        fullName,
        email,
        phoneNumber,
        joinedAt: new Date().toISOString(),
        xp: 0,
        level: 1,
        streak: 0,
        totalHours: 0,
        authSource: 'email'
    };
    mockUsers[username] = newUser;
    saveToLocalStorage('mock_users', mockUsers);
    return newUser;
};

const mockGoogleAuth = async (): Promise<UserProfile | null> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockGoogleUser: UserProfile = {
        id: `mock-google-${Date.now()}`,
        username: 'GoogleUser',
        fullName: 'Google User',
        email: 'google@example.com',
        phoneNumber: '',
        joinedAt: new Date().toISOString(),
        xp: 0,
        level: 1,
        streak: 0,
        totalHours: 0,
        authSource: 'google'
    };
    // Ensure mockGoogleUser is also added to mockUsers for consistency
    mockUsers['GoogleUser'] = mockGoogleUser; 
    saveToLocalStorage('mock_users', mockUsers);
    return mockGoogleUser;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    
    // Using useRef for focus management
    const usernameInputRef = useRef<HTMLInputElement>(null);
    
    const [formData, setFormData] = useState({ 
        username: '', 
        password: '',
        fullName: '',
        email: '',
        phoneNumber: ''
    });
    const [error, setError] = useState('');

    // Auto-focus username field on mount or mode switch
    useEffect(() => {
        if (usernameInputRef.current) {
            usernameInputRef.current.focus();
        }
    }, [mode]);

    const getFriendlyErrorMessage = (err: any) => {
        let msg = '';
        if (typeof err === 'string') {
            msg = err;
        } else if (err?.message && typeof err.message === 'string') {
            msg = err.message;
        } else if (err && typeof err === 'object') {
            try {
                msg = JSON.stringify(err);
            } catch (e) {
                msg = 'An error occurred';
            }
        }
        
        if (!msg) msg = 'An unexpected error occurred.';

        if (msg.includes('Invalid username or password')) return 'Invalid username or password.';
        if (msg.includes('Username already registered')) return 'Username already exists.';
        if (msg.includes('Password should be at least')) return 'Password is too short (min 6 chars).';
        if (msg.includes('Username must be at least')) return msg;
        
        return msg;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const { username, password, fullName, email, phoneNumber } = formData;

        try {
            if (!username.trim()) throw new Error("Username is required.");
            if (!password.trim()) throw new Error("Password is required.");

            let user: UserProfile | null = null;
            if (mode === 'register') {
                if (!fullName.trim()) throw new Error("Full Name is required.");
                if (!email.trim()) throw new Error("Email is required.");
                if (!phoneNumber.trim()) throw new Error("Phone Number is required.");

                user = await mockRegisterUser(
                    username.trim(), 
                    password.trim(), 
                    fullName.trim(), 
                    email.trim(), 
                    phoneNumber.trim()
                );
            } else {
                user = await mockLoginUser(username.trim(), password.trim());
            }

            if (user) onLogin(user);
            else setError("Authentication failed. Please try again.");
            
        } catch (err: any) {
            setError(getFriendlyErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setIsGoogleLoading(true);
        try {
            const user = await mockGoogleAuth();
            if (user) onLogin(user);
        } catch (err: any) {
            setError(getFriendlyErrorMessage(err));
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-primary relative overflow-hidden">
            {/* Ambient Background Blur */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand/10 blur-[180px] rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/5 blur-[180px] rounded-full"></div>

            <div className="w-full max-w-[440px] z-10 animate-reveal">
                <Card className="glass p-8 sm:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl bg-secondary/80 backdrop-blur-2xl">
                    <div className="text-center mb-8">
                        <div className="bg-brand inline-block p-4 rounded-2xl shadow-[0_0_30px_rgba(56,189,248,0.3)] mb-6 transform hover:rotate-6 transition-transform">
                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none italic">
                            {mode === 'login' ? 'Welcome Back' : 'Create Organizer'}
                        </h2>
                        <p className="text-brand text-sm font-black uppercase tracking-widest mt-2">A Student Assistant</p>
                    </div>

                    <div className="space-y-4 mb-6">
                        <button 
                            onClick={handleGoogleSignIn}
                            disabled={isGoogleLoading || isLoading}
                            className="w-full flex items-center justify-center gap-4 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group disabled:opacity-50"
                        >
                            {isGoogleLoading ? (
                                <div className="h-5 w-5 border-2 border-brand/30 border-t-brand rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <GoogleIcon />
                                    <span className="text-xs font-black text-white uppercase tracking-widest">
                                        {mode === 'login' ? 'Sign in' : 'Sign up'} with Google
                                    </span>
                                </>
                            )}
                        </button>
                        <div className="flex items-center gap-4 py-2">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                            <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.4em] opacity-40">OR CREDENTIALS</span>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <>
                                <div className="space-y-1 animate-slide-up">
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50"><BadgeIcon /></div>
                                        <input 
                                            type="text"
                                            placeholder="John Doe"
                                            required
                                            className="w-full bg-accent/30 border border-white/10 rounded-2xl px-12 py-3.5 text-white text-sm outline-none focus:ring-2 focus:ring-brand/50 transition-all placeholder:text-white/20"
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1 animate-slide-up" style={{ animationDelay: '50ms' }}>
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Email</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50"><MailIcon /></div>
                                        <input 
                                            type="email"
                                            placeholder="john@example.com"
                                            required
                                            className="w-full bg-accent/30 border border-white/10 rounded-2xl px-12 py-3.5 text-white text-sm outline-none focus:ring-2 focus:ring-brand/50 transition-all placeholder:text-white/20"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1 animate-slide-up" style={{ animationDelay: '100ms' }}>
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50"><PhoneIcon /></div>
                                        <input 
                                            type="tel"
                                            placeholder="+1 234 567 8900"
                                            required
                                            className="w-full bg-accent/30 border border-white/10 rounded-2xl px-12 py-3.5 text-white text-sm outline-none focus:ring-2 focus:ring-brand/50 transition-all placeholder:text-white/20"
                                            value={formData.phoneNumber}
                                            onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Username</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50"><UserIcon /></div>
                                <input 
                                    ref={usernameInputRef}
                                    type="text"
                                    placeholder="jdoe24"
                                    required
                                    className="w-full bg-accent/30 border border-white/10 rounded-2xl px-12 py-3.5 text-white text-sm outline-none focus:ring-2 focus:ring-brand/50 transition-all placeholder:text-white/20"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50"><LockIcon /></div>
                                <input 
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-accent/30 border border-white/10 rounded-2xl px-12 py-3.5 text-white text-sm outline-none focus:ring-2 focus:ring-brand/50 transition-all placeholder:text-white/20"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading || isGoogleLoading}
                            className="w-full py-4 bg-brand text-primary rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_0_25px_rgba(56,189,248,0.2)] hover:scale-[1.02] active:scale-95 transition-all mt-4"
                        >
                            {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Register Organizer'}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                            <p className="text-red-400 text-[10px] font-black uppercase text-center tracking-widest leading-relaxed">
                                {typeof error === 'string' ? error : 'An error occurred'}
                            </p>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <button 
                            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                            className="text-[10px] text-text-secondary font-black uppercase tracking-[0.2em] hover:text-brand transition-colors"
                        >
                            {mode === 'login' ? (
                                <>Don't have an account? <span className="text-brand">Register</span></>
                            ) : (
                                <>Already registered? <span className="text-brand">Sign In</span></>
                            )}
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;