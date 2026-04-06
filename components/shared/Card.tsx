import React from 'react';

// Fix: Update CardProps to extend React.HTMLAttributes<HTMLDivElement> and update the component
// to spread the rest of the props. This allows passing standard div attributes like `style`.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-secondary rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;