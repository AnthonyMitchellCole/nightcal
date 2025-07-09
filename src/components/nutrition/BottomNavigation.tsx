import { Home, FileText, Plus, Package, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddFood: () => void;
}

export const BottomNavigation = ({ activeTab, onTabChange, onAddFood }: BottomNavigationProps) => {
  const navigate = useNavigate();
  
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', route: '/', useEmblem: true },
    { id: 'log', icon: FileText, label: 'Full Log', route: '/full-log' },
    { id: 'add', icon: Plus, label: 'Add', isSpecial: true },
    { id: 'foods', icon: Package, label: 'All Foods', route: '/all-foods' },
    { id: 'settings', icon: Settings, label: 'Settings', route: '/settings' }
  ];

  const handleNavigation = (item: typeof navItems[0]) => {
    if (item.isSpecial) {
      onAddFood();
    } else {
      onTabChange(item.id);
      navigate(item.route);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-glass border-t border-glass backdrop-blur-glass shadow-layered">
      <div className="flex items-center py-2 px-4 w-full">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.isSpecial) {
            return (
              <div key={item.id} className="flex-1 flex justify-center">
                <Button
                  onClick={onAddFood}
                  className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-layered transform transition-all duration-200 hover:scale-105 active:scale-95 mt-1"
                >
                  <Icon className="w-7 h-7" />
                </Button>
              </div>
            );
          }

          return (
            <div key={item.id} className="flex-1 flex justify-center">
              <button
                onClick={() => handleNavigation(item)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 min-h-[60px] min-w-[60px] ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-text-muted hover:text-text hover:bg-bg-light/50'
                }`}
              >
                {item.useEmblem && isActive ? (
                  <img 
                    src="https://ebdtrwkrelzbtjdwuxbk.supabase.co/storage/v1/object/public/branding/nightcal-emblem.png" 
                    alt="NightCal" 
                    className="w-5 h-5 mb-1" 
                  />
                ) : (
                  <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-primary' : ''}`} />
                )}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};