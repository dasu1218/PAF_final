# Module C - Maintenance & Incident Ticketing Implementation

## Overview

This module implements a complete maintenance and incident ticketing system for the PAF (Platform Administration Framework) application. Users can create tickets for resource/location issues with categories, priorities, descriptions, and up to 3 image attachments. The system includes a full ticket lifecycle workflow and comprehensive comment functionality.

## Features

### Core Features
- **Ticket Creation**: Users can create incident tickets with:
  - Resource/Location identification
  - Category selection (Equipment Malfunction, Damage, Cleaning, Safety Hazard, Connectivity Issue, Maintenance, Other)
  - Priority levels (Low, Medium, High, Critical)
  - Detailed description
  - Preferred contact details
  - Up to 3 image attachments (Base64 encoded)

- **Ticket Workflow**: Tickets follow this status flow:
  - OPEN → IN_PROGRESS → RESOLVED → CLOSED
  - OPEN → REJECTED (admin may reject at any point with reason)
  - IN_PROGRESS → REJECTED

- **Assignment**: Admins/technicians can assign tickets to specific technicians

- **Comments**: Users and staff can add comments with:
  - Full edit capabilities by comment owner
  - Delete capabilities by comment owner or admin
  - Ownership-based access control

- **Resolution Tracking**: 
  - Resolution notes when marking tickets as RESOLVED
  - Rejection reasons when rejecting tickets
  - Timestamps for created, updated, resolved, and closed states

## Backend Implementation

### Models
Located in `backend/src/main/java/com/example/resourceapp/model/`

- **TicketStatus.java**: Enum (OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED)
- **TicketPriority.java**: Enum (LOW, MEDIUM, HIGH, CRITICAL)
- **TicketCategory.java**: Enum for ticket categories
- **Ticket.java**: Main ticket entity with MongoDB support
- **TicketComment.java**: Comment embedded in tickets
- **ImageAttachment.java**: Image data with metadata

### DTOs (Data Transfer Objects)
Located in `backend/src/main/java/com/example/resourceapp/dto/`

- **CreateTicketRequest.java**: Request to create new tickets
- **TicketResponse.java**: Complete ticket response with all details
- **AddCommentRequest.java**: Request to add/edit comments
- **UpdateTicketStatusRequest.java**: Request to update ticket status
- **AssignTicketRequest.java**: Request to assign ticket to technician

### Repository
- **TicketRepository.java**: MongoDB repository with queries for:
  - Finding tickets by user, status, resource, technician, location

### Service
- **TicketService.java**: Business logic including:
  - Ticket creation with image processing
  - Status updates with workflow validation
  - Ticket assignment
  - Comment CRUD with ownership validation
  - Retrieval by various criteria

### Controller
- **TicketController.java**: REST endpoints:
  - `POST /api/tickets` - Create ticket
  - `GET /api/tickets` - Get all tickets (admin)
  - `GET /api/tickets/status/{status}` - Get by status
  - `GET /api/tickets/resource/{resourceId}` - Get by resource
  - `GET /api/tickets/user/{userId}` - Get user's tickets
  - `GET /api/tickets/assigned/{technicianId}` - Get assigned tickets
  - `GET /api/tickets/{ticketId}` - Get ticket details
  - `PUT /api/tickets/{ticketId}/assign` - Assign ticket
  - `PUT /api/tickets/{ticketId}/status` - Update status
  - `POST /api/tickets/{ticketId}/comments` - Add comment
  - `PUT /api/tickets/{ticketId}/comments/{commentId}` - Edit comment
  - `DELETE /api/tickets/{ticketId}/comments/{commentId}` - Delete comment

### Exceptions
- **TicketNotFoundException.java**: When ticket is not found
- **InvalidTicketStatusException.java**: When status transition is invalid
- **CommentNotFoundException.java**: When comment is not found

## Frontend Implementation

### Types
Located in `frontend/src/types/Ticket.ts`

Includes TypeScript interfaces for:
- Ticket
- TicketComment
- ImageAttachment
- All enums (Status, Priority, Category)
- Request/Response types

### API Service
Located in `frontend/src/api/ticketApi.ts`

Provides functions for:
- Creating tickets
- Fetching tickets (all, by status, by resource, user's tickets, assigned)
- Getting ticket details
- Assigning tickets
- Updating status
- Adding/editing/deleting comments

### Components

#### TicketForm.tsx
**Location**: `frontend/src/components/TicketForm.tsx`

A comprehensive form for creating new tickets with:
- Category dropdown
- Description textarea
- Priority selector
- Contact details input
- Multi-image upload (up to 3)
- Image preview with remove functionality
- Success/error messaging

**Props**:
```typescript
{
  userId: string;
  userName: string;
  resourceId: string;
  location: string;
  onTicketCreated: () => void;
}
```

#### TicketCatalogue.tsx
**Location**: `frontend/src/components/TicketCatalogue.tsx`

Displays list of tickets in a table view with:
- Status filtering
- Role-based ticket display:
  - Admin: sees all tickets
  - Technician: sees assigned tickets
  - User: sees their own tickets
- Sortable columns with priority/status badges
- Click to view details

**Props**:
```typescript
{
  userId: string;
  userName: string;
  userRole?: 'ADMIN' | 'TECHNICIAN' | 'USER';
}
```

#### TicketDetails.tsx
**Location**: `frontend/src/components/TicketDetails.tsx`

Detailed ticket view with:
- Full ticket information
- Image attachments with preview
- Comment section with add/edit/delete
- Status update controls (for admins/technicians)
- Resolution notes input
- Rejection reason input
- Comment ownership validation

**Props**:
```typescript
{
  ticket: Ticket;
  userId: string;
  userName: string;
  userRole?: 'ADMIN' | 'TECHNICIAN' | 'USER';
  onBack: () => void;
}
```

### Styles
Located in `frontend/src/styles/`

- **TicketForm.css**: Form styling
- **TicketCatalogue.css**: Table and list styling
- **TicketDetails.css**: Detail view styling

Color scheme:
- Priority: Low (green), Medium (yellow), High (red), Critical (dark red)
- Status: Open (blue), In Progress (yellow), Resolved (green), Closed (gray), Rejected (red)

## Database Schema (MongoDB)

### Tickets Collection

```json
{
  "_id": ObjectId,
  "resourceId": String,
  "location": String,
  "createdByUserId": String,
  "createdByUserName": String,
  "category": String (enum),
  "description": String,
  "priority": String (enum),
  "preferredContactDetails": String,
  "status": String (enum),
  "assignedToUserId": String (optional),
  "assignedToUserName": String (optional),
  "rejectionReason": String (optional),
  "resolutionNotes": String (optional),
  "imageAttachments": [
    {
      "id": String,
      "fileName": String,
      "fileType": String,
      "fileData": String (Base64),
      "fileSize": Number,
      "uploadedAt": DateTime
    }
  ],
  "comments": [
    {
      "id": String,
      "userId": String,
      "userName": String,
      "content": String,
      "createdAt": DateTime,
      "updatedAt": DateTime
    }
  ],
  "createdAt": DateTime,
  "updatedAt": DateTime,
  "resolvedAt": DateTime (optional),
  "closedAt": DateTime (optional)
}
```

## Integration Guide

### Backend Integration

1. **Update User model** (if needed):
   Add a `role` field to distinguish between users, technicians, and admins:
   ```java
   @Indexed
   private String role; // "USER", "TECHNICIAN", "ADMIN"
   ```

2. **Add to exception handler** (`GlobalExceptionHandler.java`):
   ```java
   @ExceptionHandler(TicketNotFoundException.class)
   public ResponseEntity<String> handleTicketNotFound(TicketNotFoundException e) {
       return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
   }
   ```

3. **Add headers in Auth middleware**:
   Ensure `X-User-Id` and `X-User-Name` headers are passed from frontend

### Frontend Integration

1. **Add to App.tsx** or main routing:
   ```typescript
   import TicketForm from './components/TicketForm';
   import TicketCatalogue from './components/TicketCatalogue';
   import { ticketApi } from './api/ticketApi';
   ```

2. **Add styles directory** (if not existing):
   Create `frontend/src/styles/` directory for CSS files

3. **Update navigation**:
   Add links to ticket creation and viewing in main menu

4. **Example usage**:
   ```typescript
   // Create ticket
   <TicketForm
     userId={userId}
     userName={userName}
     resourceId="res123"
     location="Room 101"
     onTicketCreated={() => console.log('Ticket created')}
   />

   // View tickets
   <TicketCatalogue
     userId={userId}
     userName={userName}
     userRole="USER"
   />
   ```

## API Request Examples

### Create Ticket
```bash
curl -X POST http://localhost:8080/api/tickets \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user123" \
  -H "X-User-Name: John Doe" \
  -d '{
    "resourceId": "projector_101",
    "location": "Room 101",
    "category": "EQUIPMENT_MALFUNCTION",
    "description": "Projector not responding to inputs",
    "priority": "HIGH",
    "preferredContactDetails": "john@example.com",
    "imageDataList": ["data:image/jpeg;base64,/9j/4AAQSkZJRg..."]
  }'
```

### Update Ticket Status
```bash
curl -X PUT http://localhost:8080/api/tickets/ticket_id/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS",
    "resolutionNotes": "Technician assigned"
  }'
```

### Add Comment
```bash
curl -X POST http://localhost:8080/api/tickets/ticket_id/comments \
  -H "Content-Type: application/json" \
  -H "X-User-Id: tech123" \
  -H "X-User-Name: Jane Tech" \
  -d '{
    "content": "Working on the issue now"
  }'
```

## Security Considerations

1. **Image Size Limiting**: Base64 encoded images can be large. Consider implementing:
   - File size limits (recommend max 5MB per image)
   - Image compression before upload
   - Cloud storage integration (AWS S3, Google Cloud Storage)

2. **Access Control**: Currently implements:
   - Comment ownership validation
   - Role-based ticket visibility
   - Consider implementing full authorization middleware

3. **Data Validation**: All inputs validated using Jakarta validation

## Future Enhancements

1. **Cloud Storage**: Move from Base64 to actual file storage
2. **Email Notifications**: Notify users when tickets are updated
3. **SLA Tracking**: Add deadline tracking and escalation
4. **Ticket Metrics**: Dashboard with ticket statistics
5. **File Management**: Support for other file types (PDFs, docs)
6. **Ticket Search**: Full-text search across tickets
7. **Ticket Templates**: Pre-defined templates for common issues
8. **Bulk Operations**: Assign multiple tickets at once
9. **Ticket History**: Audit trail of all changes
10. **Mobile App**: Native mobile support

## Testing

### Backend Testing
```bash
# Run tests
mvn test

# Build
mvn clean install
```

### Frontend Testing
```bash
# Start dev server
npm run dev

# Build
npm run build
```

## File Structure Summary

```
Backend:
backend/src/main/java/com/example/resourceapp/
├── model/
│   ├── Ticket.java
│   ├── TicketStatus.java
│   ├── TicketPriority.java
│   ├── TicketCategory.java
│   ├── TicketComment.java
│   └── ImageAttachment.java
├── dto/
│   ├── CreateTicketRequest.java
│   ├── TicketResponse.java
│   ├── AddCommentRequest.java
│   ├── UpdateTicketStatusRequest.java
│   └── AssignTicketRequest.java
├── repository/
│   └── TicketRepository.java
├── service/
│   └── TicketService.java
├── controller/
│   └── TicketController.java
└── exception/
    ├── TicketNotFoundException.java
    ├── InvalidTicketStatusException.java
    └── CommentNotFoundException.java

Frontend:
frontend/src/
├── types/
│   └── Ticket.ts
├── api/
│   └── ticketApi.ts
├── components/
│   ├── TicketForm.tsx
│   ├── TicketCatalogue.tsx
│   └── TicketDetails.tsx
└── styles/
    ├── TicketForm.css
    ├── TicketCatalogue.css
    └── TicketDetails.css
```

## Support & Contact

For issues or questions regarding this implementation, please refer to the project documentation or contact the development team.
