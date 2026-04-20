import { Link } from 'react-router-dom';
import { authService } from '../services/authService';

function Navbar({ user, onLogout }) {
  const isAdmin = authService.isAdmin();

  return (
    <nav className="navbar">
      <h1>Smart Campus Operations Hub</h1>
      <div className="navbar-links">
        <span>Welcome, {user.fullName}</span>
        <Link to="/my-bookings">My Bookings</Link>
        <Link to="/create-booking">New Booking</Link>
        {isAdmin && <Link to="/all-bookings">All Bookings</Link>}
        <button className="btn btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
