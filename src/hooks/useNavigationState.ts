import { useCallback, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Unified navigation mapping - SINGLE SOURCE OF TRUTH
export const NAVIGATION_CONFIG = {
  routes: ['/', '/full-log', '/all-foods', '/settings'],
  routeNames: ['Home', 'Full Log', 'All Foods', 'Settings'],
  tabIds: ['home', 'log', 'foods', 'settings']
};

export const useNavigationState = () => {
  const location = useLocation();
  
  // Convert route to tab ID
  const getTabFromRoute = useCallback((route: string): string => {
    const index = NAVIGATION_CONFIG.routes.indexOf(route);
    return index !== -1 ? NAVIGATION_CONFIG.tabIds[index] : 'home';
  }, []);
  
  // Convert tab ID to route
  const getRouteFromTab = useCallback((tabId: string): string => {
    const index = NAVIGATION_CONFIG.tabIds.indexOf(tabId);
    return index !== -1 ? NAVIGATION_CONFIG.routes[index] : '/';
  }, []);
  
  // Get current route index
  const getCurrentRouteIndex = useCallback((): number => {
    return NAVIGATION_CONFIG.routes.indexOf(location.pathname);
  }, [location.pathname]);
  
  // Get current tab ID from current route
  const getCurrentTab = useCallback((): string => {
    return getTabFromRoute(location.pathname);
  }, [location.pathname, getTabFromRoute]);
  
  // Active tab state - always synced with current route
  const [activeTab, setActiveTab] = useState(() => getCurrentTab());
  
  // Update active tab when route changes
  useEffect(() => {
    const currentTab = getCurrentTab();
    setActiveTab(currentTab);
  }, [location.pathname, getCurrentTab]);
  
  // Get next/previous route info for swipe navigation
  const getAdjacentRoute = useCallback((direction: 'left' | 'right') => {
    const currentIndex = getCurrentRouteIndex();
    if (currentIndex === -1) return null;
    
    let nextIndex;
    if (direction === 'left') {
      // Swipe left = go to next page
      nextIndex = currentIndex < NAVIGATION_CONFIG.routes.length - 1 ? currentIndex + 1 : 0;
    } else {
      // Swipe right = go to previous page
      nextIndex = currentIndex > 0 ? currentIndex - 1 : NAVIGATION_CONFIG.routes.length - 1;
    }
    
    return {
      route: NAVIGATION_CONFIG.routes[nextIndex],
      name: NAVIGATION_CONFIG.routeNames[nextIndex],
      tabId: NAVIGATION_CONFIG.tabIds[nextIndex],
      index: nextIndex
    };
  }, [getCurrentRouteIndex]);
  
  return {
    activeTab,
    setActiveTab,
    getCurrentTab,
    getTabFromRoute,
    getRouteFromTab,
    getCurrentRouteIndex,
    getAdjacentRoute,
    currentRoute: {
      index: getCurrentRouteIndex(),
      name: NAVIGATION_CONFIG.routeNames[getCurrentRouteIndex()] || 'Unknown',
      total: NAVIGATION_CONFIG.routes.length
    }
  };
};