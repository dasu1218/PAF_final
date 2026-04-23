import React, { useState } from 'react';
import { Ticket, TicketComment, TicketStatus } from '../types/Ticket';
import { ticketApi } from '../api/ticketApi';
import '../styles/TicketDetails.css';

interface TicketDetailsProps {
  ticket: Ticket;
  userId: string;
  userName: string;
  userRole?: 'ADMIN' | 'TECHNICIAN' | 'USER';
  onBack: () => void;
}

export const TicketDetails: React.FC<TicketDetailsProps> = ({
  ticket,
  userId,
  userName,
  userRole = 'USER',
  onBack,
}) => {
  const [ticketData, setTicketData] = useState<Ticket>(ticket);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [newStatus, setNewStatus] = useState<TicketStatus>(ticket.status);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canEditStatus = userRole === 'ADMIN' || userRole === 'TECHNICIAN';
  const canManageTicket = userRole === 'ADMIN' || (userRole === 'TECHNICIAN' && ticketData.assignedToUserId === userId);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const updatedTicket = await ticketApi.addComment(
        ticketData.id,
        { content: newComment },
        userId,
        userName
      );
      setTicketData(updatedTicket);
      setNewComment('');
      setSuccess('Comment added successfully');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editingCommentContent.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const updatedTicket = await ticketApi.editComment(
        ticketData.id,
        commentId,
        { content: editingCommentContent },
        userId
      );
      setTicketData(updatedTicket);
      setEditingCommentId(null);
      setEditingCommentContent('');
      setSuccess('Comment updated successfully');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to edit comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setLoading(true);
    setError(null);
    try {
      const updatedTicket = await ticketApi.deleteComment(ticketData.id, commentId, userId);
      setTicketData(updatedTicket);
      setSuccess('Comment deleted successfully');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (newStatus === ticketData.status && !resolutionNotes && !rejectionReason) {
      setError('Please select a new status or provide notes');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const updatedTicket = await ticketApi.updateStatus(ticketData.id, {
        status: newStatus,
        resolutionNotes: resolutionNotes || undefined,
        rejectionReason: rejectionReason || undefined,
      });
      setTicketData(updatedTicket);
      setResolutionNotes('');
      setRejectionReason('');
      setSuccess('Ticket status updated successfully');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket status');
    } finally {
      setLoading(false);
    }
  };

  const canEditComment = (comment: TicketComment) => comment.userId === userId;

  const getStatusOptions = (currentStatus: TicketStatus): TicketStatus[] => {
    switch (currentStatus) {
      case 'OPEN':
        return ['IN_PROGRESS', 'REJECTED'];
      case 'IN_PROGRESS':
        return ['RESOLVED', 'REJECTED'];
      case 'RESOLVED':
        return ['CLOSED'];
      default:
        return [];
    }
  };

  const getPriorityClass = (priority: string) => `priority-${priority.toLowerCase()}`;
  const getStatusClass = (status: TicketStatus) => `status-${status.toLowerCase()}`;

  return (
    <div className="ticket-details-container">
      <button className="back-btn" onClick={onBack}>
        ← Back to Tickets
      </button>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="ticket-details-content">
        {/* Ticket Header */}
        <div className="ticket-header">
          <div className="ticket-header-left">
            <h1>Ticket #{ticketData.id.substring(0, 8)}</h1>
            <div className="ticket-meta">
              <span className={`status-badge ${getStatusClass(ticketData.status)}`}>
                {ticketData.status}
              </span>
              <span className={`priority-badge ${getPriorityClass(ticketData.priority)}`}>
                {ticketData.priority} Priority
              </span>
            </div>
          </div>
          <div className="ticket-dates">
            <p>
              <strong>Created:</strong> {new Date(ticketData.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated:</strong> {new Date(ticketData.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Ticket Info Grid */}
        <div className="ticket-info-grid">
          <div className="info-card">
            <h3>Resource Information</h3>
            <p>
              <strong>Location:</strong> {ticketData.location}
            </p>
            <p>
              <strong>Resource ID:</strong> {ticketData.resourceId}
            </p>
            <p>
              <strong>Category:</strong> {ticketData.category.replace(/_/g, ' ')}
            </p>
          </div>

          <div className="info-card">
            <h3>Reporter</h3>
            <p>
              <strong>Name:</strong> {ticketData.createdByUserName}
            </p>
            <p>
              <strong>Contact:</strong> {ticketData.preferredContactDetails}
            </p>
          </div>

          {ticketData.assignedToUserName && (
            <div className="info-card">
              <h3>Assignment</h3>
              <p>
                <strong>Assigned To:</strong> {ticketData.assignedToUserName}
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="section">
          <h2>Description</h2>
          <p className="description-text">{ticketData.description}</p>
        </div>

        {/* Images */}
        {ticketData.imageAttachments && ticketData.imageAttachments.length > 0 && (
          <div className="section">
            <h2>Attachments ({ticketData.imageAttachments.length})</h2>
            <div className="images-grid">
              {ticketData.imageAttachments.map((img, idx) => (
                <div key={img.id} className="image-attachment">
                  <img
                    src={img.fileData}
                    alt={`Attachment ${idx + 1}`}
                    onClick={() =>
                      window.open(img.fileData, '_blank')
                    }
                    className="attachment-thumbnail"
                  />
                  <p className="image-name">{img.fileName}</p>
                  <small>{new Date(img.uploadedAt).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resolution Notes */}
        {ticketData.resolutionNotes && (
          <div className="section">
            <h2>Resolution Notes</h2>
            <p className="resolution-notes">{ticketData.resolutionNotes}</p>
          </div>
        )}

        {/* Rejection Reason */}
        {ticketData.rejectionReason && (
          <div className="section rejection">
            <h2>Rejection Reason</h2>
            <p className="rejection-reason">{ticketData.rejectionReason}</p>
          </div>
        )}

        {/* Status Update */}
        {canEditStatus && canManageTicket && (
          <div className="section status-update">
            <h2>Update Status</h2>
            <div className="status-update-form">
              <div className="form-group">
                <label htmlFor="new-status">New Status</label>
                <select
                  id="new-status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as TicketStatus)}
                >
                  <option value={ticketData.status}>{ticketData.status} (Current)</option>
                  {getStatusOptions(ticketData.status).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {(newStatus === 'RESOLVED' || newStatus === 'IN_PROGRESS') && (
                <div className="form-group">
                  <label htmlFor="resolution-notes">
                    {newStatus === 'RESOLVED' ? 'Resolution Notes' : 'Progress Notes'} (Optional)
                  </label>
                  <textarea
                    id="resolution-notes"
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Enter any relevant notes..."
                    rows={3}
                  />
                </div>
              )}

              {newStatus === 'REJECTED' && (
                <div className="form-group">
                  <label htmlFor="rejection-reason">Rejection Reason (Required)</label>
                  <textarea
                    id="rejection-reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Why is this ticket being rejected?"
                    rows={3}
                    required
                  />
                </div>
              )}

              <button
                onClick={handleStatusUpdate}
                disabled={loading}
                className="update-status-btn"
              >
                {loading ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="section comments-section">
          <h2>Comments ({ticketData.comments?.length || 0})</h2>

          <div className="add-comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
            />
            <button
              onClick={handleAddComment}
              disabled={loading || !newComment.trim()}
              className="add-comment-btn"
            >
              {loading ? 'Adding...' : 'Add Comment'}
            </button>
          </div>

          <div className="comments-list">
            {ticketData.comments && ticketData.comments.length > 0 ? (
              ticketData.comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <strong>{comment.userName}</strong>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                    {comment.createdAt !== comment.updatedAt && (
                      <span className="comment-edited">(edited)</span>
                    )}
                  </div>

                  {editingCommentId === comment.id ? (
                    <div className="comment-edit">
                      <textarea
                        value={editingCommentContent}
                        onChange={(e) => setEditingCommentContent(e.target.value)}
                        rows={2}
                      />
                      <div className="comment-actions">
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          disabled={loading}
                          className="save-btn"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="comment-content">{comment.content}</p>
                      {canEditComment(comment) && (
                        <div className="comment-actions">
                          <button
                            onClick={() => {
                              setEditingCommentId(comment.id);
                              setEditingCommentContent(comment.content);
                            }}
                            className="edit-btn"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
