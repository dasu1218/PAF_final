import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Booking } from '../../features/booking/bookingService';

interface DashboardCalendarProps {
  bookings: Booking[];
}

export const DashboardCalendar: React.FC<DashboardCalendarProps> = ({ bookings }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold tracking-tight text-ink uppercase">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-black/5 rounded-xl transition-all text-ink/40 hover:text-ink"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-black/5 rounded-xl transition-all text-ink/40 hover:text-ink"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-4">
        {days.map((day) => (
          <div key={day} className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-ink/20">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return (
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const dayBookings = bookings.filter(b => 
            b.status === 'APPROVED' && b.date && isSameDay(parseISO(b.date), day)
          );
          
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toString()}
              className={cn(
                "aspect-square p-2 rounded-2xl border transition-all relative group cursor-pointer",
                !isCurrentMonth ? "bg-transparent border-transparent opacity-20" : "bg-white border-black/5 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5",
                isToday && "border-accent ring-1 ring-accent/20"
              )}
            >
              <span className={cn(
                "text-[11px] font-bold",
                isToday ? "text-accent" : "text-ink/60"
              )}>
                {format(day, 'd')}
              </span>
              
              <div className="mt-1 flex flex-wrap gap-0.5">
                {dayBookings.slice(0, 3).map((b, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "w-1 h-1 rounded-full",
                      (b.resourceName || '').toLowerCase().includes('lab') ? "bg-blue-500" : "bg-orange-500"
                    )} 
                    title={b.resourceName}
                  />
                ))}
                {dayBookings.length > 3 && (
                  <div className="w-1 h-1 rounded-full bg-ink/20" />
                )}
              </div>

              {/* Tooltip on hover */}
              {dayBookings.length > 0 && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-ink text-white p-3 rounded-2xl text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-2xl">
                  <p className="font-black uppercase tracking-widest mb-2 text-accent border-b border-white/10 pb-1">Bookings</p>
                  <div className="space-y-1.5">
                    {dayBookings.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          (b.resourceName || '').toLowerCase().includes('lab') ? "bg-blue-500" : "bg-orange-500"
                        )} />
                        <span className="font-bold truncate">{b.resourceName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-black/5 p-10 card-shadow">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      <div className="mt-8 pt-8 border-t border-black/5 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Labs</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Lecture Halls</span>
        </div>
      </div>
    </div>
  );
};
