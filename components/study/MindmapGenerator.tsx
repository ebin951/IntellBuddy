
import React, { useState, useRef } from 'react';
import type { MindmapNode, MindmapResponse } from '../../types';
import { generateMindmap, generateVisualConcept } from '../../services/geminiService';
import Button from '../shared/Button';
import Card from '../shared/Card';
import Spinner from '../shared/Spinner';
import GlassCard from '../shared/GlassCard';

interface NodeProps {
  node: MindmapNode;
  level: number;
}

const Node: React.FC<NodeProps> = ({ node, level }) => {
  const [isCollapsed, setIsCollapsed] = useState(level > 1);
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const levelColors = [
    'bg-brand text-primary',
    'bg-sky-600 text-white',
    'bg-sky-700 text-white',
    'bg-sky-800 text-white',
    'bg-sky-900 text-white',
  ];

  const colorClass = levelColors[level % levelColors.length];

  return (
    <div className="relative pl-8">
      <div className="absolute left-4 top-0 w-0.5 h-full bg-white/10"></div>
      
      <div className="relative">
        <div className="absolute left-0 top-1/2 w-4 h-0.5 bg-white/10"></div>

        <div className="flex items-center space-x-2 mb-2 group">
            <button
              onClick={handleToggle}
              className={`${colorClass} rounded-lg px-3 py-1 text-sm font-semibold cursor-pointer select-none shadow-md hover:opacity-90 transition-all whitespace-nowrap border border-white/10`}
            >
              {hasChildren && (isCollapsed ? '+' : '−')} {node.name}
            </button>
            {node.description && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-brand border border-brand/20 whitespace-nowrap pointer-events-none z-50">
                    {node.description}
                </div>
            )}
        </div>

        {!isCollapsed && hasChildren && (
          <div className="animate-reveal">
            {node.children?.map((child, index) => (
              <Node key={index} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


const MindmapGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [mindmapData, setMindmapData] = useState<MindmapResponse | null>(null);
    const [visualConcept, setVisualConcept] = useState<string | null>(null);
    const [error, setError] = useState('');

    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const viewportRef = useRef<HTMLDivElement>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic.');
            return;
        }
        setIsLoading(true);
        setError('');
        setMindmapData(null);
        setVisualConcept(null);
        setScale(1);
        setPosition({ x: 0, y: 0 });
        try {
            const result = await generateMindmap(topic);
            if (result && result.root) {
                setMindmapData(result);
            } else {
                setError('Neural link failed. The topic might be too complex or the AI is busy. Please try a simpler topic or retry.');
            }
        } catch (e) {
            setError('Neural link error occurred.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVisualSynthesis = async () => {
        if (!topic.trim()) return;
        setIsImageLoading(true);
        try {
            const img = await generateVisualConcept(topic);
            setVisualConcept(img);
        } catch (e) {
            console.error(e);
        } finally {
            setIsImageLoading(false);
        }
    };

    const onMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const onMouseUp = () => setIsDragging(false);

    const onWheel = (e: React.WheelEvent) => {
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(Math.max(scale * delta, 0.4), 3);
        setScale(newScale);
    };

    const resetTransform = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const zoomIn = () => setScale(s => Math.min(s + 0.2, 3));
    const zoomOut = () => setScale(s => Math.max(s - 0.2, 0.4));

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-reveal">
            <div className="flex flex-col lg:flex-row gap-6">
                <Card className="flex-1">
                    <h2 className="text-2xl font-black text-text-primary mb-2 uppercase italic tracking-tighter">Diagram Architect</h2>
                    <p className="text-text-secondary mb-4 text-xs font-bold uppercase tracking-widest opacity-60">Hierarchical Mindmaps • Point-by-Point Analysis • Visual Synthesis</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            placeholder="e.g., 'Modern CPU Architecture' or 'Quantum Computing Basics'"
                            className="flex-grow bg-accent border border-white/10 rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-brand font-black"
                            disabled={isLoading}
                        />
                        <Button onClick={handleGenerate} isLoading={isLoading} className="px-8 py-3 text-xs font-black uppercase tracking-widest">Architect Map</Button>
                    </div>
                    {error && <p className="text-red-400 mt-2 text-[10px] font-black uppercase tracking-widest">{error}</p>}
                </Card>
                
                {mindmapData && (
                    <Card className="lg:w-72 bg-brand/5 border-brand/20 flex flex-col justify-center items-center p-6 gap-4">
                        <p className="text-[10px] font-black text-brand uppercase tracking-widest text-center">Neural Synthesis</p>
                        <Button 
                            onClick={handleVisualSynthesis} 
                            isLoading={isImageLoading} 
                            variant="secondary" 
                            className="w-full text-[10px] font-black uppercase border-brand/20 hover:bg-brand hover:text-primary"
                        >
                            Generate Visual
                        </Button>
                        <p className="text-[8px] text-text-secondary text-center leading-tight font-bold opacity-40 uppercase">Creates an AI-generated artistic visualization of your topic.</p>
                    </Card>
                )}
            </div>

            {isLoading && <div className="py-20 flex flex-col items-center"><Spinner size="lg" /><p className="mt-4 text-[10px] font-black text-brand uppercase tracking-[0.4em]">Parsing Hierarchies...</p></div>}

            {mindmapData && mindmapData.root && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Visual Canvas */}
                    <Card className="xl:col-span-2 p-0 h-[650px] overflow-hidden bg-secondary/40 border-white/5 group cursor-grab active:cursor-grabbing relative">
                        <div className="absolute top-4 left-4 z-10">
                            <h3 className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">Interactive Diagram</h3>
                        </div>
                        
                        <div 
                            ref={viewportRef}
                            className="w-full h-full relative"
                            onMouseDown={onMouseDown}
                            onMouseMove={onMouseMove}
                            onMouseUp={onMouseUp}
                            onMouseLeave={onMouseUp}
                            onWheel={onWheel}
                        >
                            <div 
                                className="absolute origin-top-left transition-transform duration-75 ease-out select-none"
                                style={{ 
                                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                    padding: '50px'
                                }}
                            >
                                <Node node={mindmapData.root} level={0} />
                            </div>

                            <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
                                <button onClick={zoomIn} className="w-10 h-10 bg-accent border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-brand hover:text-primary transition-all shadow-xl">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                </button>
                                <button onClick={zoomOut} className="w-10 h-10 bg-accent border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-brand hover:text-primary transition-all shadow-xl">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg>
                                </button>
                                <button onClick={resetTransform} className="w-10 h-10 bg-brand text-primary rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity shadow-xl">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                </button>
                            </div>

                            <div className="absolute bottom-6 left-6 pointer-events-none">
                                <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[9px] font-black text-text-secondary uppercase tracking-widest">
                                    ZOOM: {Math.round(scale * 100)}%
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Explanations & Visual Panel */}
                    <div className="flex flex-col gap-6 h-[650px]">
                        {visualConcept && (
                            <GlassCard className="p-0 border-brand/40 overflow-hidden shadow-2xl animate-reveal shrink-0">
                                <img src={visualConcept} alt="Visual Concept" className="w-full h-44 object-cover" />
                                <div className="p-3 bg-black/60 backdrop-blur-sm">
                                    <p className="text-[9px] font-black text-brand uppercase tracking-widest">Visual Synthesis Output</p>
                                </div>
                            </GlassCard>
                        )}
                        
                        <Card className="flex-1 overflow-y-auto space-y-6 bg-secondary/60">
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] border-b border-white/5 pb-4">Architectural Analysis</h3>
                            <div className="space-y-6">
                                {mindmapData.explanations && mindmapData.explanations.length > 0 ? (
                                    mindmapData.explanations.map((item, i) => (
                                        <div key={i} className="space-y-2 border-l-2 border-brand/20 pl-4 group hover:border-brand transition-all animate-reveal" style={{ animationDelay: `${i * 100}ms` }}>
                                            <h4 className="text-[10px] font-black text-brand uppercase tracking-widest group-hover:translate-x-1 transition-transform">{item.point}</h4>
                                            <p className="text-[11px] text-text-secondary leading-relaxed font-medium">{item.detail}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-text-secondary text-xs italic">No detailed analysis available.</p>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MindmapGenerator;
