import React, { useState, useEffect } from 'react';
import { Ticket, TicketStatus } from '../types/Ticket';
import { ticketApi } from '../api/ticketApi';
import TicketDetails from './TicketDetails';
import '../styles/TicketCatalogue.css';

interface TicketCatalogueProps {
  userId: string;
  userName: string;
  userRole?: 'ADMIN' | 'TECHNICIAN' | 'USER';
}

export const TicketCatalogue: React.FC<TicketCatalogueProps> = ({
  userId,
  userName,
  userRole = 'USER',
}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'ALL'>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [viewType, setViewType] = useState<'list' | 'detail'>('list');

  useEffect(() => {
    loadTickets();
  }, [filterStatus]);

  const loadTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      let ticketData: Ticket[];

      if (userRole === 'ADMIN') {
        // Admins can see all tickets
        if (filterStatus === 'ALL') {
          ticketData = await ticketApi.getAll();
        } else {
          ticketData = await ticketApi.getByStatus(filterStatus as TicketStatus);
        }
      } else if (userRole === 'TECHNICIAN') {
        // Technicians see assigned tickets
        const assignedTickets = await ticketApi.getAssignedTickets(userId);
        if (filterStatus === 'ALL') {
          ticketData = assignedTickets;
        } else {
          ticketData = assignedTickets.filter((t) => t.status === filterStatus);
        }
      } else {
        // Regular users see their own tickets
        ticketData = await ticketApi.getUserTickets(userId);
      }

      setTickets(ticketData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setViewType('detail');
  };

  const handleBackToList = () => {
    setViewType('list');
    setSelectedTicket(null);
    loadTickets(); // Refresh tickets
  };

  const getPriorityClass = (priority: string) => {
    return `priority-${priority.toLowerCase()}`;
  };

  const getStatusClass = (status: TicketStatus) => {
    return `status-${status.toLowerCase()}`;
  };

  if (selectedTicket && viewType === 'detail') {
    return (
      <TicketDetails
        ticket={selectedTicket}
        userId={userId}
        userName={userName}
        userRole={userRole}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="ticket-catalogue-container">
      <div className="catalogue-header">
        <h2>Maintenance Tickets</h2>
        <div className="filter-controls">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TicketStatus | 'ALL')}
          >
            <option value="ALL">All</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="empty-state">
          <p>No tickets found</p>
        </div>
      ) : (
        <div className="tickets-table-wrapper">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Resource/Location</th>
                <th>Category</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Assigned To</th>
                <th>Created Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="ticket-row">
                  <td className="ticket-id">{ticket.id.substring(0, 8)}...</td>
                  <td>
                    <strong>{ticket.location}</strong>
                    <br />
                    <small>{ticket.resourceId}</small>
                  </td>
                  <td>{ticket.category.replace(/_/g, ' ')}</td>
                  <td className="description-cell">
                    {ticket.description.length > 50
                      ? `${ticket.description.substring(0, 50)}...`
                      : ticket.description}
                  </td>
                  <td>
                    <span className={`priority-badge ${getPriorityClass(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td>{ticket.createdByUserName}</td>
                  <td>{ticket.assignedToUserName || '-'}</td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => handleTicketSelect(ticket)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TicketCatalogue;
