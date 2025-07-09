import { useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from './use-mobile';

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export const useSwipeNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const touchStart = useRef<TouchPoint | null>(null);
  const touchEnd = useRef<TouchPoint | null>(null);

  // Define the main navigation routes in order
  const routes = ['/', '/full-log', '/all-foods', '/settings'];
  
  const getCurrentRouteIndex = useCallback(() => {
    return routes.indexOf(location.pathname);
  }, [location.pathname]);

  const navigateToRoute = useCallback((direction: 'left' | 'right') => {
    const currentIndex = getCurrentRouteIndex();
    if (currentIndex === -1) return; // Not on a swipeable route

    let nextIndex;
    if (direction === 'right') {
      // Swipe right = go to previous page
      nextIndex = currentIndex > 0 ? currentIndex - 1 : routes.length - 1;
    } else {
      // Swipe left = go to next page  
      nextIndex = currentIndex < routes.length - 1 ? currentIndex + 1 : 0;
    }

    navigate(routes[nextIndex]);
  }, [getCurrentRouteIndex, navigate]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isMobile) return;
    
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    touchEnd.current = null;
  }, [isMobile]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isMobile || !touchStart.current) return;
    
    const touch = e.touches[0];
    touchEnd.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }, [isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (!isMobile || !touchStart.current || !touchEnd.current) return;

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const deltaTime = touchEnd.current.time - touchStart.current.time;

    // Only process horizontal swipes
    if (Math.abs(deltaX) < Math.abs(deltaY)) return;
    
    // Minimum swipe distance and maximum time for a valid swipe
    const minSwipeDistance = 50;
    const maxSwipeTime = 500;
    
    if (Math.abs(deltaX) > minSwipeDistance && deltaTime < maxSwipeTime) {
      if (deltaX > 0) {
        navigateToRoute('right'); // Swipe right
      } else {
        navigateToRoute('left'); // Swipe left
      }
    }

    touchStart.current = null;
    touchEnd.current = null;
  }, [isMobile, navigateToRoute]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isSwipeEnabled: isMobile && getCurrentRouteIndex() !== -1
  };
};