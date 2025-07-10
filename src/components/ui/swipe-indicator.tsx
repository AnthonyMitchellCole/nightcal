import React, { useEffect, useState, useRef } from 'react';
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
  const [smoothProgress, setSmoothProgress] = useState(0);
  const animationRef = useRef<number>();

  // Smooth progress updates to prevent flickering
  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    animationRef.current = requestAnimationFrame(() => {
      setSmoothProgress(progress);
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [progress]);

  // Improved visibility logic
  useEffect(() => {
    if (isActive && smoothProgress > 0.05) { // Show at 5% progress for stability
      setIsVisible(true);
    } else if (!isActive || smoothProgress <= 0.02) {
      const timer = setTimeout(() => setIsVisible(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isActive, smoothProgress]);

  if (!isVisible || !direction) return null;

  const sideClass = direction === 'left' ? 'left-8' : 'right-8';
  const opacity = Math.min(0.4 + smoothProgress * 1.2, 1); // Use smooth progress
  const scale = 0.9 + Math.min(smoothProgress * 0.2, 0.2); // More stable scaling

  return (
    <div
      className={`fixed top-1/2 transform -translate-y-1/2 ${sideClass} z-50 transition-all duration-300 ease-out pointer-events-none`}
      style={{
        transform: `translateY(-50%) scale(${scale})`,
        opacity: opacity
      }}
    >
      <div 
        className={`flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ease-out border-2 ${
          willNavigate 
            ? 'bg-primary/90 text-primary-foreground shadow-lg border-primary-foreground/20' 
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
          className={`absolute ${direction === 'left' ? 'left-full ml-4' : 'right-full mr-4'} top-1/2 transform -translate-y-1/2 px-4 py-2 bg-bg/95 text-text text-sm font-medium rounded-lg backdrop-blur-lg border border-border/40 shadow-lg whitespace-nowrap transition-all duration-300 ease-out`}
          style={{ 
            opacity: willNavigate ? Math.min(0.4 + smoothProgress * 1.2, 1) : 0,
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