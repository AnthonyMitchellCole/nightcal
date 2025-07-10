import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/nutrition/BottomNavigation";
import { AddFoodModal } from "@/components/nutrition/AddFoodModal";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { SwipeIndicator } from "@/components/ui/swipe-indicator";
import { FloatingActionMenu } from "@/components/ui/floating-action-menu";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { useNavigationState } from "@/hooks/useNavigationState";
import { Database, PlusCircle, Search } from "lucide-react";

export const AppLayout = () => {
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use unified navigation state
  const { activeTab, setActiveTab } = useNavigationState();
  
  const { 
    handleTouchStart, 
    handleTouchMove, 
    handleTouchEnd, 
    isSwipeEnabled, 
    swipeState,
    getRouteInfo 
  } = useSwipeNavigation();
  
  const handleTabChange = (tab: string) => {
    // Update the active tab immediately for instant UI feedback
    setActiveTab(tab);
  };

  // Add touch event listeners for swipe navigation
  useEffect(() => {
    if (!isSwipeEnabled) return;

    const touchStartHandler = (e: TouchEvent) => handleTouchStart(e);
    const touchMoveHandler = (e: TouchEvent) => handleTouchMove(e);
    const touchEndHandler = () => handleTouchEnd();

    document.addEventListener('touchstart', touchStartHandler, { passive: true });
    document.addEventListener('touchmove', touchMoveHandler, { passive: false }); // Not passive to allow preventDefault
    document.addEventListener('touchend', touchEndHandler, { passive: true });

    return () => {
      document.removeEventListener('touchstart', touchStartHandler);
      document.removeEventListener('touchmove', touchMoveHandler);
      document.removeEventListener('touchend', touchEndHandler);
    };
  }, [isSwipeEnabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Get next page info for swipe indicator
  const nextPageInfo = swipeState.direction ? getRouteInfo(swipeState.direction) : null;

  // Define floating actions for specific pages
  const getFloatingActions = () => {
    switch (location.pathname) {
      case '/all-foods':
      case '/':
      case '/full-log':
        return [
          {
            icon: Database,
            label: "USDA Search",
            onClick: () => navigate('/usda-search')
          },
          {
            icon: PlusCircle,
            label: "Add Food", 
            onClick: () => navigate('/add-food')
          }
        ];
      default:
        return null;
    }
  };

  const floatingActions = getFloatingActions();

  return (
    <div className="min-h-screen bg-bg text-text relative">
      {/* Main content area - no transform to avoid layout issues */}
      <div className="pb-20">
        <Outlet />
      </div>

      {/* Swipe Indicator - Clean, subtle feedback */}
      <SwipeIndicator
        isActive={swipeState.isActive}
        direction={swipeState.direction}
        progress={swipeState.progress}
        willNavigate={swipeState.willNavigate}
        nextPageName={nextPageInfo?.name}
      />

      {/* Persistent Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        onAddFood={() => setIsAddFoodModalOpen(true)}
      />

      {/* Add Food Modal */}
      <AddFoodModal 
        isOpen={isAddFoodModalOpen}
        onClose={() => setIsAddFoodModalOpen(false)}
      />

      {/* Floating Action Menu - Outside transform container */}
      {floatingActions && <FloatingActionMenu items={floatingActions} />}

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
};