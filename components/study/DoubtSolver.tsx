
import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../../types';
import { getChatbotResponseStream, searchWeb } from '../../services/geminiService';
import Button from '../shared/Button';

const PaperAirplaneIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
);

const GlobeAltIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S12 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21.812 12c0 1.007-.15 1.98-.422 2.918A8.958 8.958 0 0 1 18.716 14.25M7.843 4.582A11.943 11.943 0 0 0 2.188 12c0 1.007.15 1.98.422 2.918" />
    </svg>
);

const DoubtSolver: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [useWebSearch, setUseWebSearch] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages([{
            sender: 'ai',
            text: "Hello! I'm your Student Assistant. I've been optimized for speed—ask me anything, and I'll help you instantly."
        }]);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            if (useWebSearch) {
                const { text, sources } = await searchWeb(userMsg);
                setMessages(prev => [...prev, { sender: 'ai', text, sources }]);
                setIsLoading(false);
            } else {
                // Initialize an empty AI message to stream into
                setMessages(prev => [...prev, { sender: 'ai', text: "" }]);
                
                await getChatbotResponseStream(userMsg, (fullText) => {
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1].text = fullText;
                        return newMessages;
                    });
                });
                setIsLoading(false);
            }
        } catch (err) {
            setMessages(prev => [...prev, { sender: 'ai', text: "Service link interrupted. Please try again." }]);
            setIsLoading(false);
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] max-w-3xl mx-auto bg-secondary rounded-xl shadow-2xl animate-slide-up">
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-black/20">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand animate-pulse"></div>
                    <h2 className="text-sm font-black text-text-primary uppercase tracking-widest italic">Hyper-Mentor v3.1</h2>
                </div>
                <button 
                    onClick={() => setUseWebSearch(!useWebSearch)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border text-[10px] font-black uppercase tracking-widest ${useWebSearch ? 'bg-brand text-primary border-brand' : 'text-text-secondary border-white/10 hover:border-brand/40'}`}
                >
                    <GlobeAltIcon className="w-4 h-4" />
                    Web Link {useWebSearch ? 'ON' : 'OFF'}
                </button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center flex-shrink-0 font-black text-primary text-xs shadow-[0_0_10px_rgba(56,189,248,0.4)]">AI</div>}
                        <div className={`max-w-[85%] p-4 rounded-2xl flex flex-col ${msg.sender === 'user' ? 'bg-brand text-primary font-bold rounded-tr-none shadow-lg' : 'bg-accent text-text-secondary rounded-tl-none'}`}>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text || (index === messages.length - 1 && isLoading ? "Analyzing..." : "")}</p>
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                                    {msg.sources.map((source, i) => (
                                        <a key={i} href={source.uri} target="_blank" rel="noreferrer" className="text-[10px] bg-black/30 px-2 py-1 rounded hover:text-brand transition-colors truncate max-w-[150px]">
                                            {source.title}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/5 bg-secondary rounded-b-xl">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Establish query link..."
                        className="flex-grow bg-accent border border-white/10 rounded-xl px-5 py-4 text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-brand font-black"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading} className="p-4 bg-brand rounded-xl text-primary shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:scale-105 active:scale-95 transition-all">
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoubtSolver;
