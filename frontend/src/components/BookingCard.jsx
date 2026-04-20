import { format } from 'date-fns';

function BookingCard({ booking, onCancel, onApprove, onReject, onDelete, isAdmin }) {
  const getStatusBadge = (status) => {
    const badgeClass = `badge badge-${status.toLowerCase()}`;
    return <span className={badgeClass}>{status}</span>;
  };

  const formatDateTime = (dateTime) => {
    return format(new Date(dateTime), 'MMM dd, yyyy HH:mm');
  };

  return (
    <div className="card" style={{ marginBottom: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
        <div>
          <h3 style={{ marginBottom: '5px' }}>{booking.resourceName}</h3>
          {getStatusBadge(booking.status)}
        </div>
        <div style={{ fontSize: '12px', color: '#6c757d' }}>
          ID: #{booking.id}
        </div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <p style={{ marginBottom: '5px' }}>
          <strong>Time:</strong> {formatDateTime(booking.startDateTime)} →{' '}
          {formatDateTime(booking.endDateTime)}
        </p>
        <p style={{ marginBottom: '5px' }}>
          <strong>Purpose:</strong> {booking.purpose}
        </p>
        {booking.expectedAttendees && (
          <p style={{ marginBottom: '5px' }}>
            <strong>Expected Attendees:</strong> {booking.expectedAttendees}
          </p>
        )}
        {isAdmin && (
          <p style={{ marginBottom: '5px' }}>
            <strong>Requested by:</strong> {booking.userFullName}
          </p>
        )}
        {booking.adminNotes && (
          <p style={{ marginBottom: '5px' }}>
            <strong>Admin Notes:</strong> {booking.adminNotes}
          </p>
        )}
        {booking.reviewedByUserName && (
          <p style={{ marginBottom: '5px', fontSize: '12px', color: '#6c757d' }}>
            Reviewed by: {booking.reviewedByUserName} on{' '}
            {formatDateTime(booking.reviewedAt)}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {booking.status === 'PENDING' && isAdmin && (
          <>
            <button
              className="btn btn-success"
              onClick={() => onApprove(booking.id)}
            >
              Approve
            </button>
            <button
              className="btn btn-danger"
              onClick={() => onReject(booking.id)}
            >
              Reject
            </button>
          </>
        )}

        {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
          <button
            className="btn btn-warning"
            onClick={() => onCancel(booking.id)}
          >
            Cancel
          </button>
        )}

        {(booking.status === 'PENDING' || booking.status === 'REJECTED') && (
          <button
            className="btn btn-danger"
            onClick={() => onDelete(booking.id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default BookingCard;
