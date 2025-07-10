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
    if (isActive && progress > 0.1) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isActive, progress]);

  if (!isVisible || !direction) return null;

  const sideClass = direction === 'left' ? 'left-4' : 'right-4';
  const iconOpacity = Math.min(progress * 2, 1);
  const bgOpacity = Math.min(progress * 1.5, 0.8);

  return (
    <div
      className={`fixed top-1/2 transform -translate-y-1/2 ${sideClass} z-50 transition-all duration-200 pointer-events-none`}
      style={{
        transform: `translateY(-50%) scale(${0.8 + progress * 0.2})`,
        opacity: iconOpacity
      }}
    >
      <div 
        className={`flex items-center justify-center w-16 h-16 rounded-full transition-all duration-200 ${
          willNavigate 
            ? 'bg-primary text-primary-foreground shadow-glow' 
            : 'bg-bg-light/80 text-text-muted'
        } backdrop-blur-md border border-glass`}
        style={{
          backgroundColor: willNavigate 
            ? `hsl(var(--primary) / ${bgOpacity})` 
            : `hsl(var(--bg-light) / ${bgOpacity * 0.8})`
        }}
      >
        {direction === 'left' ? (
          <ChevronRight className="w-8 h-8" />
        ) : (
          <ChevronLeft className="w-8 h-8" />
        )}
      </div>
      
      {nextPageName && willNavigate && (
        <div 
          className={`absolute top-full mt-2 px-3 py-1 bg-bg-light/90 text-text text-sm rounded-md backdrop-blur-md border border-glass whitespace-nowrap transition-all duration-200 ${
            direction === 'left' ? 'left-1/2 transform -translate-x-1/2' : 'right-1/2 transform translate-x-1/2'
          }`}
          style={{ opacity: Math.min(progress * 2, 1) }}
        >
          {nextPageName}
        </div>
      )}
    </div>
  );
};