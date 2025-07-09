import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { BottomNavigation } from "@/components/nutrition/BottomNavigation";
import { AddFoodModal } from "@/components/nutrition/AddFoodModal";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

export const AppLayout = () => {
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const location = useLocation();
  
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