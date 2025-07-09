import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateNavigationProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateNavigation = ({ selectedDate, onDateChange }: DateNavigationProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    onDateChange(prevDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    onDateChange(nextDay);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  // Check if the selected date is today (compare just the date part)
  const today = new Date();
  const isToday = selectedDate.getFullYear() === today.getFullYear() &&
                  selectedDate.getMonth() === today.getMonth() &&
                  selectedDate.getDate() === today.getDate();
  
  // Check if next day would be in the future
  const nextDay = new Date(selectedDate);
  nextDay.setDate(nextDay.getDate() + 1);
  const wouldNextDayBeFuture = format(nextDay, 'yyyy-MM-dd') > format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="flex items-center justify-between bg-glass border-glass backdrop-blur-glass p-3 mx-4 mb-4 rounded-lg shadow-layered">
      {/* Previous Day Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={goToPreviousDay}
        className="p-2"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Date Display with Calendar Picker */}
      <div className="flex items-center space-x-2">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="font-medium text-base px-3 py-1 h-auto"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              {format(selectedDate, 'EEEE, MMM d, yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  onDateChange(date);
                  setIsCalendarOpen(false);
                }
              }}
              disabled={(date) => date > new Date()}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        {/* Today Button - only show if not already today */}
        {!isToday && (
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="text-xs px-2 py-1 h-auto"
          >
            Today
          </Button>
        )}
      </div>

      {/* Next Day Button - disabled for future dates */}
      <Button
        variant="ghost"
        size="sm"
        onClick={goToNextDay}
        disabled={wouldNextDayBeFuture}
        className="p-2"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};