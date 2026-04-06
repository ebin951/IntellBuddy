import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverGlow?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverGlow = true, ...props }) => {
  return (
    <div 
      className={`glass rounded-2xl p-6 transition-all duration-500 overflow-hidden relative group ${hoverGlow ? 'glass-hover' : ''} ${className}`} 
      {...props}
    >
      {/* Dynamic Background Glow Effect */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand/5 blur-[100px] pointer-events-none group-hover:bg-brand/10 transition-colors duration-500"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/5 blur-[100px] pointer-events-none group-hover:bg-purple-500/10 transition-colors duration-500"></div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;