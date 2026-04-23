# Module C Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React/TypeScript)              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐   │
│  │  TicketForm      │  │ TicketCatalogue  │  │TicketDetails │   │
│  │  (Create)        │  │  (List View)     │  │  (Detail)    │   │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘   │
│           │                     │                    │           │
│           └─────────────────────┼────────────────────┘           │
│                                 │                                 │
│                    ┌────────────▼──────────────┐                 │
│                    │    ticketApi.ts           │                 │
│                    │  (API Service Layer)      │                 │
│                    └────────────┬──────────────┘                 │
│                                 │                                 │
│                    ┌────────────▼──────────────┐                 │
│                    │    Types/Ticket.ts        │                 │
│                    │  (TypeScript Interfaces)  │                 │
│                    └────────────────────────────┘                 │
│                                                                   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   HTTP REST API   │
                    │  (Port 8080)      │
                    └─────────┬─────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                  BACKEND (Spring Boot/Java)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              TicketController (REST API)                │    │
│  │  POST   /api/tickets                                    │    │
│  │  GET    /api/tickets                                    │    │
│  │  GET    /api/tickets/{ticketId}                         │    │
│  │  PUT    /api/tickets/{ticketId}/status                  │    │
│  │  POST   /api/tickets/{ticketId}/comments                │    │
│  │  PUT    /api/tickets/{ticketId}/comments/{id}           │    │
│  │  DELETE /api/tickets/{ticketId}/comments/{id}           │    │
│  │  ... and more                                            │    │
│  └──────────────────────────┬───────────────────────────────┘    │
│                             │                                     │
│  ┌──────────────────────────▼───────────────────────────────┐    │
│  │           TicketService (Business Logic)                │    │
│  │  • Create tickets with image processing                 │    │
│  │  • Validate workflow transitions                        │    │
│  │  • Manage comments with ownership                       │    │
│  │  • Handle assignments                                   │    │
│  │  • Query tickets by various criteria                    │    │
│  └──────────────────────────┬───────────────────────────────┘    │
│                             │                                     │
│  ┌──────────────────────────▼───────────────────────────────┐    │
│  │          TicketRepository (Data Access)                 │    │
│  │  • MongoDB queries                                       │    │
│  │  • CRUD operations                                       │    │
│  │  • Custom finders                                        │    │
│  └──────────────────────────┬───────────────────────────────┘    │
│                             │                                     │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │    MongoDB         │
                    │  (Collection:      │
                    │   "tickets")       │
                    └────────────────────┘
```

## Data Flow Example

### Creating a Ticket

```
1. User fills TicketForm
   ├─ Category, Priority, Description
   ├─ Contact Details
   └─ Upload Images (1-3)

2. TicketForm calls ticketApi.create()
   ├─ Converts images to Base64
   └─ Sends POST to /api/tickets

3. TicketController receives request
   ├─ Validates headers (X-User-Id, X-User-Name)
   └─ Calls TicketService.createTicket()

4. TicketService processes ticket
   ├─ Creates Ticket entity
   ├─ Processes image attachments (max 3)
   ├─ Sets initial status to OPEN
   └─ Calls ticketRepository.save()

5. MongoDB stores document
   └─ Returns with generated ID

6. TicketResponse sent to frontend
   └─ Component displays success message
```

## Component Interaction Diagram

```
TicketCatalogue (Parent)
    │
    ├─► ticketApi.getUserTickets()
    │   └─► Fetches and displays in table
    │
    └─► On ticket select:
        └─► TicketDetails (Child)
            ├─► Displays full details
            ├─► Shows images
            │
            ├─► Comments section
            │   ├─► TicketComment[] display
            │   └─► Add/Edit/Delete via ticketApi
            │
            └─► Status update (if admin/technician)
                └─► ticketApi.updateStatus()
```

## Workflow State Machine

```
         ┌─────────────────────────────────┐
         │   REJECTED (Final State)        │
         │   - No further transitions      │
         │   - Has rejection reason        │
         └─────────────────────────────────┘
                     ▲                      
                     │                      
                 [REJECT]                   
                     │                      
              ┌──────┴────────┐            
              │               │            
         ┌────┴─────┐     ┌───┴───────┐   
         │   OPEN   │────►│IN_PROGRESS│   
         │ (Initial)│     │           │   
         └──────────┘     └───┬───────┘   
                              │            
                              ▼            
                         ┌────────────┐   
                         │  RESOLVED  │   
                         │ (with notes)│   
                         └────┬───────┘   
                              │            
                              ▼            
                         ┌───────────┐    
                         │  CLOSED   │    
                         │ (Final)   │    
                         └───────────┘    
```

## Security & Validation

```
Request comes in with headers:
├─ X-User-Id: "user123"
├─ X-User-Name: "John Doe"
└─ Content-Type: "application/json"

TicketController validates:
├─ Headers present ✓
└─ Request body valid (Jakarta validation) ✓

TicketService enforces:
├─ Workflow rules (status transitions) ✓
├─ Comment ownership (only owner can edit/delete) ✓
├─ Image limit (max 3) ✓
└─ Required fields (not null/blank) ✓

Response sent back with appropriate:
├─ HTTP Status Code (200, 201, 400, 404, etc.)
└─ Error message (if applicable)
```

## Comment Ownership Rules

```
Comment Created:
    ├─ userId: "user123"
    ├─ userName: "John Doe"
    └─ content: "Some comment text"

Later Operations:
    ├─ Edit: Only if current user = comment.userId ✓
    ├─ Delete: Only if current user = comment.userId ✓
    └─ View: Any user ✓
```

## Image Handling Flow

```
User selects image files
    │
    ▼
JavaScript FileReader converts to Base64
    │
    ▼
Base64 string sent in API request
    │
    ▼
Backend receives and stores in ImageAttachment
    ├─ fileName
    ├─ fileType
    ├─ fileData (Base64)
    ├─ fileSize
    └─ uploadedAt
    │
    ▼
MongoDB stores Base64 string
    │
    ▼
Frontend retrieves and renders:
    ├─ <img src={imageData} /> ✓
    └─ Click to view full size
```

## Role-Based Access Control

```
Regular USER
├─ Can create tickets
├─ Can view own tickets
├─ Can add comments
├─ Can edit own comments
└─ Cannot update ticket status

TECHNICIAN
├─ Can see assigned tickets
├─ Can add comments
├─ Can update ticket status
│  ├─ OPEN → IN_PROGRESS
│  ├─ IN_PROGRESS → RESOLVED
│  └─ RESOLVED → CLOSED
└─ Can add resolution notes

ADMIN
├─ Can see all tickets
├─ Can assign tickets
├─ Can update any ticket status
├─ Can reject with reason
├─ Can view all comments
└─ Full system access
```

## Database Schema (Simplified)

```
tickets (Collection)
├─ _id: ObjectId
├─ resourceId: String
├─ location: String
├─ category: Enum (EQUIPMENT_MALFUNCTION, DAMAGE, ...)
├─ description: String
├─ priority: Enum (LOW, MEDIUM, HIGH, CRITICAL)
├─ status: Enum (OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED)
├─ createdByUserId: String
├─ createdByUserName: String
├─ assignedToUserId: String (optional)
├─ assignedToUserName: String (optional)
├─ preferredContactDetails: String
├─ rejectionReason: String (optional)
├─ resolutionNotes: String (optional)
├─ imageAttachments: Array[ImageAttachment]
│  ├─ id: String
│  ├─ fileName: String
│  ├─ fileType: String
│  ├─ fileData: String (Base64)
│  ├─ fileSize: Number
│  └─ uploadedAt: DateTime
├─ comments: Array[TicketComment]
│  ├─ id: String
│  ├─ userId: String
│  ├─ userName: String
│  ├─ content: String
│  ├─ createdAt: DateTime
│  └─ updatedAt: DateTime
├─ createdAt: DateTime
├─ updatedAt: DateTime
├─ resolvedAt: DateTime (optional)
└─ closedAt: DateTime (optional)
```

## Error Handling Flow

```
Frontend API Call
    │
    ▼
Backend Receives Request
    │
    ├─ Validation Error?
    │  └─► 400 Bad Request (with details)
    │
    ├─ Not Found?
    │  └─► 404 Not Found
    │
    ├─ Invalid Status Transition?
    │  └─► 400 Bad Request + InvalidTicketStatusException
    │
    ├─ Access Denied?
    │  └─► 401/403 Unauthorized/Forbidden
    │
    └─ Success!
       └─► 200 OK or 201 Created + Response JSON
    
Frontend Handles Error
    ├─ Display error message to user
    └─ Log for debugging
```

## Performance Considerations

```
Optimizations:
├─ MongoDB indexes on:
│  ├─ createdByUserId
│  ├─ status
│  ├─ resourceId
│  └─ assignedToUserId
│
├─ Lazy loading of images (don't render all)
│
├─ Pagination for large ticket lists (future)
│
└─ Caching of frequently accessed data (future)

Scalability:
├─ Base64 images can be large → Consider cloud storage
├─ Comment arrays could grow → Consider pagination
└─ High ticket volume → Consider database optimization
```

## Testing Strategy

```
Backend:
├─ Unit tests for TicketService
├─ Integration tests for TicketController
├─ Workflow validation tests
└─ Comment ownership tests

Frontend:
├─ Component render tests
├─ Form validation tests
├─ API call mocking
└─ User interaction tests
```

---

This architecture provides a scalable, secure, and maintainable solution for ticket management with clear separation of concerns across frontend and backend layers.
