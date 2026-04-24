export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TicketCategory =
  | 'EQUIPMENT_MALFUNCTION'
  | 'DAMAGE'
  | 'CLEANING'
  | 'SAFETY_HAZARD'
  | 'CONNECTIVITY_ISSUE'
  | 'MAINTENANCE'
  | 'OTHER';

export interface ImageAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileData: string; // Base64 encoded
  fileSize: number;
  uploadedAt: string;
}

export interface TicketComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  resourceId: string;
  location: string;
  createdByUserId: string;
  createdByUserName: string;
  category: TicketCategory;
  description: string;
  priority: TicketPriority;
  preferredContactDetails: string;
  status: TicketStatus;
  assignedToUserId?: string;
  assignedToUserName?: string;
  rejectionReason?: string;
  resolutionNotes?: string;
  imageAttachments: ImageAttachment[];
  comments: TicketComment[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

export interface CreateTicketRequest {
  resourceId: string;
  location: string;
  category: TicketCategory;
  description: string;
  priority: TicketPriority;
  preferredContactDetails: string;
  imageDataList?: string[]; // Base64 encoded images
}

export interface AddCommentRequest {
  content: string;
}

export interface UpdateTicketStatusRequest {
  status: TicketStatus;
  resolutionNotes?: string;
  rejectionReason?: string;
}

export interface AssignTicketRequest {
  technicianId: string;
  technicianName: string;
}
