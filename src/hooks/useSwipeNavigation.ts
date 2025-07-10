import { useCallback, useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from './use-mobile';
import { NAVIGATION_CONFIG, useNavigationState } from './useNavigationState';

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

interface SwipeState {
  isActive: boolean;
  direction: 'left' | 'right' | null;
  progress: number;
  willNavigate: boolean;
}

export const useSwipeNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { getAdjacentRoute, getCurrentRouteIndex } = useNavigationState();
  const touchStart = useRef<TouchPoint | null>(null);
  const touchEnd = useRef<TouchPoint | null>(null);
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isActive: false,
    direction: null,
    progress: 0,
    willNavigate: false
  });

  const getRouteInfo = useCallback((direction: 'left' | 'right') => {
    return getAdjacentRoute(direction);
  }, [getAdjacentRoute]);

  const navigateToRoute = useCallback((direction: 'left' | 'right') => {
    const routeInfo = getRouteInfo(direction);
    if (routeInfo) {
      navigate(routeInfo.route);
    }
  }, [getRouteInfo, navigate]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isMobile) return;
    
    // Check if touch started on a scrollable carousel container
    const target = e.target as Element;
    const scrollableParent = target.closest('.overflow-x-auto, .snap-x-mandatory, [data-embla-carousel]');
    if (scrollableParent) return;
    
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    touchEnd.current = null;

    setSwipeState({
      isActive: false,
      direction: null,
      progress: 0,
      willNavigate: false
    });
  }, [isMobile]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isMobile || !touchStart.current) return;
    
    // Check if we're interacting with a carousel
    const target = e.target as Element;
    const scrollableParent = target.closest('.overflow-x-auto, .snap-x-mandatory, [data-embla-carousel]');
    if (scrollableParent) return;
    
    const touch = e.touches[0];
    touchEnd.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;

    // Only process horizontal swipes
    if (Math.abs(deltaX) < Math.abs(deltaY)) return;

    // Determine swipe direction and calculate progress
    const direction = deltaX > 0 ? 'right' : 'left';
    const distance = Math.abs(deltaX);
    const maxDistance = window.innerWidth * 0.4; // 40% of screen width
    const progress = Math.min(distance / maxDistance, 1);
    
    // Check if we can navigate in this direction
    const routeInfo = getRouteInfo(direction);
    const willNavigate = progress > 0.25 && distance > 50 && routeInfo !== null;

    setSwipeState({
      isActive: distance > 10,
      direction,
      progress,
      willNavigate
    });

    // Prevent default scrolling when actively swiping
    if (distance > 10) {
      e.preventDefault();
    }
  }, [isMobile, getRouteInfo]);

  const handleTouchEnd = useCallback(() => {
    if (!isMobile || !touchStart.current || !touchEnd.current) return;

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const deltaTime = touchEnd.current.time - touchStart.current.time;

    // Only process horizontal swipes
    if (Math.abs(deltaX) < Math.abs(deltaY)) {
      setSwipeState({
        isActive: false,
        direction: null,
        progress: 0,
        willNavigate: false
      });
      return;
    }
    
    // Minimum swipe distance and maximum time for a valid swipe
    const minSwipeDistance = 50;
    const maxSwipeTime = 500;
    const minProgress = 0.25;
    
    const distance = Math.abs(deltaX);
    const maxDistance = window.innerWidth * 0.4;
    const progress = Math.min(distance / maxDistance, 1);

    if (distance > minSwipeDistance && 
        deltaTime < maxSwipeTime && 
        progress > minProgress) {
      
      const direction = deltaX > 0 ? 'right' : 'left';
      navigateToRoute(direction);
    }

    // Reset swipe state
    setSwipeState({
      isActive: false,
      direction: null,
      progress: 0,
      willNavigate: false
    });

    touchStart.current = null;
    touchEnd.current = null;
  }, [isMobile, navigateToRoute]);

  // Reset swipe state when route changes
  useEffect(() => {
    setSwipeState({
      isActive: false,
      direction: null,
      progress: 0,
      willNavigate: false
    });
  }, [location.pathname]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isSwipeEnabled: isMobile && getCurrentRouteIndex() !== -1,
    swipeState,
    getRouteInfo
  };
};