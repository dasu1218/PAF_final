# Module C - Ticket System: Quick Reference Guide

## Implementation Summary

Module C (Maintenance & Incident Ticketing) has been **fully implemented** for both backend and frontend. Below is a complete list of all created files and their purposes.

---

## 📋 Backend Files (Java/Spring Boot)

### Models (6 files)
Located: `backend/src/main/java/com/example/resourceapp/model/`

| File | Purpose |
|------|---------|
| `Ticket.java` | Main ticket entity with MongoDB support, contains all ticket fields |
| `TicketStatus.java` | Enum: OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED |
| `TicketPriority.java` | Enum: LOW, MEDIUM, HIGH, CRITICAL |
| `TicketCategory.java` | Enum: EQUIPMENT_MALFUNCTION, DAMAGE, CLEANING, SAFETY_HAZARD, CONNECTIVITY_ISSUE, MAINTENANCE, OTHER |
| `TicketComment.java` | Comment entity embedded in tickets with ownership tracking |
| `ImageAttachment.java` | Image data container with Base64 encoding and metadata |

### Data Transfer Objects - DTOs (5 files)
Located: `backend/src/main/java/com/example/resourceapp/dto/`

| File | Purpose |
|------|---------|
| `CreateTicketRequest.java` | Request DTO for creating new tickets |
| `TicketResponse.java` | Response DTO with all ticket details |
| `AddCommentRequest.java` | Request DTO for adding/editing comments |
| `UpdateTicketStatusRequest.java` | Request DTO for status updates with notes/reasons |
| `AssignTicketRequest.java` | Request DTO for assigning tickets to technicians |

### Repository (1 file)
Located: `backend/src/main/java/com/example/resourceapp/repository/`

| File | Purpose |
|------|---------|
| `TicketRepository.java` | MongoDB repository interface with custom queries |

### Service (1 file)
Located: `backend/src/main/java/com/example/resourceapp/service/`

| File | Purpose |
|------|---------|
| `TicketService.java` | Business logic for all ticket operations including workflow validation |

### Controller (1 file)
Located: `backend/src/main/java/com/example/resourceapp/controller/`

| File | Purpose |
|------|---------|
| `TicketController.java` | REST API endpoints (11 endpoints total) |

### Exceptions (3 files)
Located: `backend/src/main/java/com/example/resourceapp/exception/`

| File | Purpose |
|------|---------|
| `TicketNotFoundException.java` | Exception when ticket not found |
| `InvalidTicketStatusException.java` | Exception for invalid status transitions |
| `CommentNotFoundException.java` | Exception when comment not found |

---

## 🎨 Frontend Files (TypeScript/React)

### Types (1 file)
Located: `frontend/src/types/`

| File | Purpose |
|------|---------|
| `Ticket.ts` | TypeScript interfaces for all ticket-related types |

### API Service (1 file)
Located: `frontend/src/api/`

| File | Purpose |
|------|---------|
| `ticketApi.ts` | API functions for all ticket operations (14 functions) |

### Components (3 files)
Located: `frontend/src/components/`

| File | Purpose |
|------|---------|
| `TicketForm.tsx` | Form component for creating new tickets with image upload |
| `TicketCatalogue.tsx` | List/table view of tickets with filtering |
| `TicketDetails.tsx` | Detailed ticket view with comments and status updates |

### Styles (3 files)
Located: `frontend/src/styles/`

| File | Purpose |
|------|---------|
| `TicketForm.css` | Styling for ticket creation form |
| `TicketCatalogue.css` | Styling for ticket list/table view |
| `TicketDetails.css` | Styling for detailed ticket view |

---

## 📚 Documentation Files (Markdown)

| File | Purpose |
|------|---------|
| `TICKET_SYSTEM_DOCUMENTATION.md` | Comprehensive system documentation with full feature list |
| `TICKET_INTEGRATION_GUIDE.md` | Integration examples and backend setup checklist |
| `TICKET_QUICK_REFERENCE.md` | This file - quick overview of all files |

---

## ✨ Key Features Implemented

### Core Functionality
- ✅ Create tickets with category, priority, description, and contact details
- ✅ Upload up to 3 image attachments per ticket (Base64 encoded)
- ✅ Full ticket lifecycle workflow with status validation
- ✅ Assign tickets to technicians
- ✅ Add/edit/delete comments with ownership rules
- ✅ Resolution notes and rejection reasons
- ✅ Comprehensive timestamp tracking

### Access Control
- ✅ Role-based ticket visibility (USER, TECHNICIAN, ADMIN)
- ✅ Comment ownership validation
- ✅ Status update restrictions based on workflow

### API Endpoints (11 total)
```
POST   /api/tickets                                 - Create ticket
GET    /api/tickets                                 - Get all (admin)
GET    /api/tickets/status/{status}                 - Get by status
GET    /api/tickets/resource/{resourceId}           - Get by resource
GET    /api/tickets/user/{userId}                   - Get user's tickets
GET    /api/tickets/assigned/{technicianId}         - Get assigned tickets
GET    /api/tickets/{ticketId}                      - Get details
PUT    /api/tickets/{ticketId}/assign               - Assign ticket
PUT    /api/tickets/{ticketId}/status               - Update status
POST   /api/tickets/{ticketId}/comments             - Add comment
PUT    /api/tickets/{ticketId}/comments/{id}        - Edit comment
DELETE /api/tickets/{ticketId}/comments/{id}        - Delete comment
```

---

## 🔧 Required Setup

### Backend
1. Ensure MongoDB is running
2. Add ticket-related files to project
3. Update `GlobalExceptionHandler.java` to handle ticket exceptions
4. (Optional) Add role field to User model

### Frontend
1. Add all TypeScript types and API functions
2. Import components into your app
3. Create `/styles` directory if it doesn't exist
4. Set `X-User-Id` and `X-User-Name` headers in HTTP requests

---

## 📊 Database Collection

**Collection Name**: `tickets`

Fields:
- `_id`: ObjectId (auto-generated)
- `resourceId`: String
- `location`: String
- `category`: String (enum)
- `description`: String
- `priority`: String (enum)
- `status`: String (enum)
- `createdByUserId`: String
- `createdByUserName`: String
- `assignedToUserId`: String (optional)
- `assignedToUserName`: String (optional)
- `preferredContactDetails`: String
- `rejectionReason`: String (optional)
- `resolutionNotes`: String (optional)
- `imageAttachments`: Array of attachment objects
- `comments`: Array of comment objects
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `resolvedAt`: DateTime (optional)
- `closedAt`: DateTime (optional)

---

## 🎯 Status Workflow

```
OPEN ──┬──→ IN_PROGRESS ──┬──→ RESOLVED ──→ CLOSED
       │                 │
       └─────────────────┴──→ REJECTED
```

**Valid Transitions:**
- OPEN → IN_PROGRESS (when assigned)
- IN_PROGRESS → RESOLVED (with optional notes)
- RESOLVED → CLOSED
- OPEN/IN_PROGRESS → REJECTED (with required reason)
- CLOSED/REJECTED → (no further transitions)

---

## 🚀 Getting Started

### Step 1: Backend
```bash
# Copy all backend files to your project
# Update GlobalExceptionHandler.java
# Run Maven
mvn clean install
mvn spring-boot:run
```

### Step 2: Frontend
```bash
# Copy all frontend files to your project
# Install dependencies (if needed)
npm install
npm run dev
```

### Step 3: Integration
```typescript
// In your App.tsx or route
import TicketCatalogue from './components/TicketCatalogue';

<TicketCatalogue
  userId={userId}
  userName={userName}
  userRole="USER"
/>
```

---

## 🔍 File Checklist

### Backend (12 files)
- [ ] Ticket.java
- [ ] TicketStatus.java
- [ ] TicketPriority.java
- [ ] TicketCategory.java
- [ ] TicketComment.java
- [ ] ImageAttachment.java
- [ ] CreateTicketRequest.java
- [ ] TicketResponse.java
- [ ] AddCommentRequest.java
- [ ] UpdateTicketStatusRequest.java
- [ ] AssignTicketRequest.java
- [ ] TicketRepository.java
- [ ] TicketService.java
- [ ] TicketController.java
- [ ] TicketNotFoundException.java
- [ ] InvalidTicketStatusException.java
- [ ] CommentNotFoundException.java

### Frontend (7 files)
- [ ] Ticket.ts
- [ ] ticketApi.ts
- [ ] TicketForm.tsx
- [ ] TicketCatalogue.tsx
- [ ] TicketDetails.tsx
- [ ] TicketForm.css
- [ ] TicketCatalogue.css
- [ ] TicketDetails.css

### Documentation (3 files)
- [ ] TICKET_SYSTEM_DOCUMENTATION.md
- [ ] TICKET_INTEGRATION_GUIDE.md
- [ ] TICKET_QUICK_REFERENCE.md

---

## 📞 Support

For detailed information, refer to:
- **Full Documentation**: `TICKET_SYSTEM_DOCUMENTATION.md`
- **Integration Guide**: `TICKET_INTEGRATION_GUIDE.md`
- **Code Comments**: Available in all source files

---

## 💡 Tips

1. **Image Handling**: Currently uses Base64 encoding. For production, consider cloud storage integration.
2. **Validation**: All inputs validated using Jakarta validation annotations.
3. **Headers**: Remember to include `X-User-Id` and `X-User-Name` headers in ticket creation/comment operations.
4. **Testing**: Use Postman or curl to test API endpoints.
5. **Styling**: CSS uses modern flexbox and grid layouts, responsive design included.

---

**Implementation Date**: April 23, 2026
**Status**: ✅ Complete and Ready for Integration
