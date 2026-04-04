import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', highlight = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-100 transition-all hover:shadow-md ${
        highlight ? 'border-red-400 bg-red-50 flash-highlight' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
