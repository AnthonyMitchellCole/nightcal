import { cn } from "@/lib/utils";

interface LoadingEmblemProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6", 
  lg: "w-8 h-8",
  xl: "w-12 h-12"
};

export const LoadingEmblem = ({ className, size = "md" }: LoadingEmblemProps) => {
  return (
    <img 
      src="https://ebdtrwkrelzbtjdwuxbk.supabase.co/storage/v1/object/public/branding/nightcal-emblem.png" 
      alt="Loading" 
      className={cn(
        "animate-spin",
        sizeClasses[size],
        className
      )}
    />
  );
};