import { useState } from 'react';
import { Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingActionItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
}

interface FloatingActionMenuProps {
  items: FloatingActionItem[];
  className?: string;
}

export function FloatingActionMenu({ items, className }: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className={cn("fixed bottom-24 right-6 z-50", className)}>
      {/* Action Items */}
      <div className={cn(
        "flex flex-col-reverse space-y-reverse space-y-3 mb-3 transition-all duration-300 ease-out",
        isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
      )}>
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 group"
            style={{ 
              transitionDelay: isOpen ? `${index * 50}ms` : `${(items.length - index - 1) * 50}ms` 
            }}
          >
            {/* Label */}
            <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                {item.label}
              </span>
            </div>
            
            {/* Button */}
            <Button
              size="icon"
              variant="secondary"
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className="h-12 w-12 rounded-full shadow-elegant hover:shadow-glow transition-all duration-200"
            >
              <item.icon className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <Button
        size="icon"
        variant="secondary"
        onClick={toggleMenu}
        className={cn(
          "h-14 w-14 rounded-full shadow-elegant hover:shadow-glow transition-all duration-300",
          isOpen && "rotate-12"
        )}
      >
        <Apple className="h-6 w-6" />
      </Button>
    </div>
  );
}