import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import MyBookings from './components/MyBookings';
import AllBookings from './components/AllBookings';
import CreateBooking from './components/CreateBooking';
import { authService } from './services/authService';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const PrivateRoute = ({ children }) => {
    return authService.isAuthenticated() ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
    return authService.isAdmin() ? children : <Navigate to="/my-bookings" />;
  };

  return (
    <Router>
      <div className="app">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <div className="container">
          <Routes>
            <Route
              path="/login"
              element={
                authService.isAuthenticated() ? (
                  <Navigate to="/my-bookings" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/my-bookings"
              element={
                <PrivateRoute>
                  <MyBookings />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-booking"
              element={
                <PrivateRoute>
                  <CreateBooking />
                </PrivateRoute>
              }
            />
            <Route
              path="/all-bookings"
              element={
                <AdminRoute>
                  <AllBookings />
                </AdminRoute>
              }
            />
            <Route path="/" element={<Navigate to="/my-bookings" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
