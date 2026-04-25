import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './shared/context/AuthContext';
import { ThemeProvider } from './shared/context/ThemeContext';
import { Toaster } from 'sonner';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { DashboardLayout } from './shared/layouts/DashboardLayout';
import { LoginPage } from './shared/pages/LoginPage';
import { SignupPage } from './shared/pages/SignupPage';
import { Dashboard } from './shared/pages/Dashboard';
import { AdminDashboard } from './shared/pages/admin/AdminDashboard';
import { BookingPage } from './features/booking/BookingPage';
import { TicketListPage } from './features/ticket/TicketListPage';
import { TicketDetailsPage } from './features/ticket/TicketDetailsPage';
import { CreateTicketPage } from './features/ticket/CreateTicketPage';
import { ResourceManagementPage } from './features/resource/ResourceManagementPage';
import { BookingManagementPage } from './features/booking/BookingManagementPage';
import { MyTicketsPage } from './features/ticket/MyTicketsPage';
import { TechnicianTicketDetailsPage } from './features/ticket/TechnicianTicketDetailsPage';
import { NotificationsPage } from './features/notification/NotificationsPage';
import { MyBookingsPage } from './features/booking/MyBookingsPage';
import { UnauthorizedPage } from './shared/pages/UnauthorizedPage';
import { AdminNoticePage } from './shared/pages/admin/AdminNoticePage';
import { TechnicianDashboard } from './shared/pages/TechnicianDashboard';
import { OAuth2Callback } from './shared/pages/OAuth2Callback';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-right" expand={false} richColors />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/oauth2/callback" element={<OAuth2Callback />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Dashboard Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="bookings" element={<BookingPage />} />
              <Route path="my-bookings" element={<MyBookingsPage />} />
              
              {/* Ticketing Module */}
              <Route path="tickets">
                <Route index element={<TicketListPage />} />
                <Route path="create" element={<CreateTicketPage />} />
                <Route path=":id" element={<TicketDetailsPage />} />
              </Route>

              {/* Admin Routes */}
              <Route path="admin" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="admin/overview" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="admin/resources" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ResourceManagementPage />
                </ProtectedRoute>
              } />
              <Route path="admin/bookings" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <BookingManagementPage />
                </ProtectedRoute>
              } />
              <Route path="admin/notices" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminNoticePage />
                </ProtectedRoute>
              } />
              
              <Route path="notifications" element={<NotificationsPage />} />

              {/* Technician Specific Routes */}
              <Route path="technician/overview" element={
                <ProtectedRoute allowedRoles={['TECHNICIAN']}>
                  <TechnicianDashboard />
                </ProtectedRoute>
              } />
              <Route path="technician">
                <Route path="tickets" element={
                  <ProtectedRoute allowedRoles={['TECHNICIAN']}>
                    <MyTicketsPage />
                  </ProtectedRoute>
                } />
                <Route path="tickets/:id" element={
                  <ProtectedRoute allowedRoles={['TECHNICIAN']}>
                    <TechnicianTicketDetailsPage />
                  </ProtectedRoute>
                } />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
