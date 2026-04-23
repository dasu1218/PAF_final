// Example Integration Guide for Ticket System
// Add this to your App.tsx or routing configuration

import React, { useState } from 'react';
import TicketForm from './components/TicketForm';
import TicketCatalogue from './components/TicketCatalogue';

// Example App Component with Ticket System Integration
export const AppWithTickets: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'create-ticket' | 'view-tickets'>('home');
  
  // Mock user data - replace with actual auth
  const userId = 'user123';
  const userName = 'John Doe';
  const userRole = 'USER' as const; // or 'TECHNICIAN' or 'ADMIN'

  const handleTicketCreated = () => {
    // Refresh ticket list or navigate to it
    setCurrentPage('view-tickets');
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="app-nav">
        <button
          onClick={() => setCurrentPage('home')}
          className={currentPage === 'home' ? 'active' : ''}
        >
          Home
        </button>
        <button
          onClick={() => setCurrentPage('create-ticket')}
          className={currentPage === 'create-ticket' ? 'active' : ''}
        >
          Create Ticket
        </button>
        <button
          onClick={() => setCurrentPage('view-tickets')}
          className={currentPage === 'view-tickets' ? 'active' : ''}
        >
          View Tickets
        </button>
      </nav>

      {/* Page Content */}
      <main className="app-main">
        {currentPage === 'home' && (
          <div className="home-page">
            <h1>Welcome to Maintenance & Incident Ticketing</h1>
            <p>Use the navigation above to create or view maintenance tickets.</p>
          </div>
        )}

        {currentPage === 'create-ticket' && (
          <TicketForm
            userId={userId}
            userName={userName}
            resourceId="projector_101"
            location="Room 101 - Lecture Hall"
            onTicketCreated={handleTicketCreated}
          />
        )}

        {currentPage === 'view-tickets' && (
          <TicketCatalogue
            userId={userId}
            userName={userName}
            userRole={userRole}
          />
        )}
      </main>
    </div>
  );
};

// ============================================
// Alternative: Using with React Router
// ============================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';

export const AppWithRouter: React.FC = () => {
  const userId = 'user123';
  const userName = 'John Doe';
  const userRole = 'USER' as const;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tickets/create" element={
          <TicketForm
            userId={userId}
            userName={userName}
            resourceId="projector_101"
            location="Room 101"
            onTicketCreated={() => window.location.href = '/tickets/list'}
          />
        } />
        <Route path="/tickets/list" element={
          <TicketCatalogue
            userId={userId}
            userName={userName}
            userRole={userRole}
          />
        } />
      </Routes>
    </BrowserRouter>
  );
};

// ============================================
// Usage in Admin Panel
// ============================================

export const AdminTicketPanel: React.FC = () => {
  const [viewType, setViewType] = useState<'list' | 'create'>('list');

  return (
    <div className="admin-panel">
      <div className="panel-controls">
        <button onClick={() => setViewType('list')}>All Tickets</button>
        <button onClick={() => setViewType('create')}>Create Ticket</button>
      </div>

      {viewType === 'list' && (
        <TicketCatalogue
          userId="admin1"
          userName="Admin User"
          userRole="ADMIN"
        />
      )}

      {viewType === 'create' && (
        <TicketForm
          userId="admin1"
          userName="Admin User"
          resourceId=""
          location=""
          onTicketCreated={() => setViewType('list')}
        />
      )}
    </div>
  );
};

// ============================================
// Backend Setup Checklist
// ============================================

/*
1. Add to GlobalExceptionHandler.java:

   @ExceptionHandler(TicketNotFoundException.class)
   public ResponseEntity<String> handleTicketNotFound(TicketNotFoundException e) {
       return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
   }

   @ExceptionHandler(InvalidTicketStatusException.class)
   public ResponseEntity<String> handleInvalidTicketStatus(InvalidTicketStatusException e) {
       return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
   }

   @ExceptionHandler(CommentNotFoundException.class)
   public ResponseEntity<String> handleCommentNotFound(CommentNotFoundException e) {
       return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
   }

2. Update User model (optional):
   Add role field:
   @Indexed
   private String role; // "USER", "TECHNICIAN", "ADMIN"

3. Ensure these dependencies in pom.xml:
   - spring-boot-starter-data-mongodb
   - jakarta.validation
   - spring-security-crypto

4. Start MongoDB before running backend

5. Test endpoints using curl or Postman
*/

// ============================================
// Frontend CSS Import
// ============================================

/*
Add to your main CSS file or import in components:

@import './styles/TicketForm.css';
@import './styles/TicketCatalogue.css';
@import './styles/TicketDetails.css';

Or import in component files:
import '../styles/TicketForm.css';
*/

// ============================================
// Example: Embedding in Resource Details
// ============================================

interface ResourceDetailProps {
  resourceId: string;
  resourceName: string;
  location: string;
}

export const ResourceDetail: React.FC<ResourceDetailProps> = ({
  resourceId,
  resourceName,
  location,
}) => {
  const [showTicketForm, setShowTicketForm] = useState(false);

  if (showTicketForm) {
    return (
      <TicketForm
        userId="user123"
        userName="John Doe"
        resourceId={resourceId}
        location={location}
        onTicketCreated={() => setShowTicketForm(false)}
      />
    );
  }

  return (
    <div className="resource-detail">
      <h2>{resourceName}</h2>
      <p>Location: {location}</p>
      <button onClick={() => setShowTicketForm(true)}>
        Report Issue
      </button>
    </div>
  );
};

// ============================================
// Headers Configuration
// ============================================

/*
Ensure your HTTP client sets these headers:

const headers = {
  'Content-Type': 'application/json',
  'X-User-Id': userId,
  'X-User-Name': userName,
};

// In axios interceptor:
instance.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  
  if (userId) config.headers['X-User-Id'] = userId;
  if (userName) config.headers['X-User-Name'] = userName;
  
  return config;
});
*/
