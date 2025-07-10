import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SwipeIndicatorProps {
  isActive: boolean;
  direction: 'left' | 'right' | null;
  progress: number;
  willNavigate: boolean;
  nextPageName?: string;
}

export const SwipeIndicator: React.FC<SwipeIndicatorProps> = ({
  isActive,
  direction,
  progress,
  willNavigate,
  nextPageName
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive && progress > 0.02) { // Show much earlier - at 2% progress
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 100); // Faster hide
      return () => clearTimeout(timer);
    }
  }, [isActive, progress]);

  if (!isVisible || !direction) return null;

  const sideClass = direction === 'left' ? 'left-8' : 'right-8'; // Move further from edge
  const opacity = Math.min(0.3 + progress * 1.4, 1); // Start at 30% opacity, reach 100% faster
  const scale = 0.9 + Math.min(progress * 0.3, 0.3); // More subtle scaling

  return (
    <div
      className={`fixed top-1/2 transform -translate-y-1/2 ${sideClass} z-50 transition-all duration-150 pointer-events-none`}
      style={{
        transform: `translateY(-50%) scale(${scale})`,
        opacity: opacity
      }}
    >
      <div 
        className={`flex items-center justify-center w-20 h-20 rounded-full transition-all duration-150 border-2 ${
          willNavigate 
            ? 'bg-primary/90 text-primary-foreground shadow-lg border-primary-foreground/20 animate-pulse' 
            : 'bg-bg/95 text-text border-border/40'
        } backdrop-blur-lg shadow-xl`}
      >
        {direction === 'left' ? (
          <ChevronRight className="w-10 h-10" strokeWidth={2.5} />
        ) : (
          <ChevronLeft className="w-10 h-10" strokeWidth={2.5} />
        )}
      </div>
      
      {nextPageName && (
        <div 
          className={`absolute ${direction === 'left' ? 'left-full ml-4' : 'right-full mr-4'} top-1/2 transform -translate-y-1/2 px-4 py-2 bg-bg/95 text-text text-sm font-medium rounded-lg backdrop-blur-lg border border-border/40 shadow-lg whitespace-nowrap transition-all duration-150`}
          style={{ 
            opacity: willNavigate ? Math.min(0.4 + progress * 1.2, 1) : 0,
            transform: `translateY(-50%) scale(${willNavigate ? scale : 0.8})`
          }}
        >
          <div className="text-xs text-text-muted mb-1">
            {direction === 'left' ? 'Next →' : '← Previous'}
          </div>
          {nextPageName}
        </div>
      )}
    </div>
  );
};