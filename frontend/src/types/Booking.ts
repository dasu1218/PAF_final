export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface BookingRequest {
  resourceId: string;
  startTime: string;
  endTime: string;
  purpose: string;
  expectedAttendees: number;
}

export interface BookingResponse {
  id: string;
  resourceId: string;
  userId: string;
  startTime: string;
  endTime: string;
  purpose: string;
  expectedAttendees: number;
  status: BookingStatus;
  rejectionReason?: string;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}
