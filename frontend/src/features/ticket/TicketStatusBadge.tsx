import React from 'react';
import { TicketStatus } from './ticket';
import { cn } from '../../lib/utils';

interface TicketStatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

export const TicketStatusBadge: React.FC<TicketStatusBadgeProps> = ({ status, className }) => {
  const styles = {
    OPEN: 'bg-blue-50 text-blue-700 border-blue-100',
    REJECTED: 'bg-red-50 text-red-700 border-red-100',
    IN_PROGRESS: 'bg-orange-50 text-orange-700 border-orange-100',
    RESOLVED: 'bg-green-50 text-green-700 border-green-100',
    CLOSED: 'bg-gray-50 text-gray-700 border-gray-100',
  };

  return (
    <span className={cn(
      "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border",
      styles[status],
      className
    )}>
      {status.replace('_', ' ')}
    </span>
  );
};
