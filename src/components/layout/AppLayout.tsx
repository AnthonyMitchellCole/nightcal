import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { BottomNavigation } from "@/components/nutrition/BottomNavigation";
import { AddFoodModal } from "@/components/nutrition/AddFoodModal";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";

export const AppLayout = () => {
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const location = useLocation();
  const { handleTouchStart, handleTouchMove, handleTouchEnd, isSwipeEnabled } = useSwipeNavigation();
  
  // Determine active tab based on current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/full-log') return 'log';
    if (path === '/all-foods') return 'foods';
    if (path === '/settings') return 'settings';
    return 'home';
  };

  const handleTabChange = (tab: string) => {
    // Navigation is handled by the BottomNavigation component itself
    // This is just for maintaining state consistency
  };

  // Add touch event listeners for swipe navigation
  useEffect(() => {
    if (!isSwipeEnabled) return;

    const touchStartHandler = (e: TouchEvent) => handleTouchStart(e);
    const touchMoveHandler = (e: TouchEvent) => handleTouchMove(e);
    const touchEndHandler = () => handleTouchEnd();

    document.addEventListener('touchstart', touchStartHandler, { passive: true });
    document.addEventListener('touchmove', touchMoveHandler, { passive: true });
    document.addEventListener('touchend', touchEndHandler, { passive: true });

    return () => {
      document.removeEventListener('touchstart', touchStartHandler);
      document.removeEventListener('touchmove', touchMoveHandler);
      document.removeEventListener('touchend', touchEndHandler);
    };
  }, [isSwipeEnabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Main content area */}
      <div className="pb-20">
        <Outlet />
      </div>

      {/* Persistent Bottom Navigation */}
      <BottomNavigation 
        activeTab={getActiveTab()} 
        onTabChange={handleTabChange}
        onAddFood={() => setIsAddFoodModalOpen(true)}
      />

      {/* Add Food Modal */}
      <AddFoodModal 
        isOpen={isAddFoodModalOpen}
        onClose={() => setIsAddFoodModalOpen(false)}
      />

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
};