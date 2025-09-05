import React from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  sessionType: 'focus' | 'short-break' | 'long-break';
  children?: React.ReactNode;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 300,
  strokeWidth = 8,
  sessionType,
  children
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const getStrokeColor = () => {
    switch (sessionType) {
      case 'focus':
        return 'hsl(var(--focus-primary))';
      case 'short-break':
        return 'hsl(var(--short-break-primary))';
      case 'long-break':
        return 'hsl(var(--long-break-primary))';
      default:
        return 'hsl(var(--focus-primary))';
    }
  };

  const getGradientId = () => `gradient-${sessionType}`;

  return (
    <div className="relative flex items-center justify-center group">
      <svg
        width={size}
        height={size}
        className={cn(
          "transform -rotate-90 transition-all duration-500 hover:scale-105",
          sessionType === 'focus' && "drop-shadow-lg hover:drop-shadow-2xl",
          sessionType === 'short-break' && "drop-shadow-lg hover:drop-shadow-2xl",
          sessionType === 'long-break' && "drop-shadow-lg hover:drop-shadow-2xl"
        )}
      >
        <defs>
          <linearGradient id={getGradientId()} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop 
              offset="0%" 
              stopColor={sessionType === 'focus' ? 'hsl(var(--focus-primary))' : 
                         sessionType === 'short-break' ? 'hsl(var(--short-break-primary))' : 
                         'hsl(var(--long-break-primary))'} 
            />
            <stop 
              offset="100%" 
              stopColor={sessionType === 'focus' ? 'hsl(var(--focus-secondary))' : 
                         sessionType === 'short-break' ? 'hsl(var(--short-break-secondary))' : 
                         'hsl(var(--long-break-secondary))'} 
            />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${getGradientId()})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out group-hover:brightness-110"
          filter="url(#glow)"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      
      {/* Content in the center */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};