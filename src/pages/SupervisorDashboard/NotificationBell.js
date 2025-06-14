import { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
      const res = await axios.get(`${BASE_URL}/api/notifications/?is_read=false`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`
        }
      });
      setUnreadCount(res.data.length);
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleClick = () => {
    setOpen(!open);
  };

  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
  const markAsRead = async (id) => {
    await axios.post(`${BASE_URL}/api/notifications/${id}/mark_as_read/`, {}, {
      headers: {
        Authorization: `Token ${localStorage.getItem('authToken')}`
      }
    });
    fetchNotifications(); // Refresh count
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={handleClick} style={{ position: 'relative' }}>
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: -5,
            right: -5,
            background: 'red',
            color: 'white',
            borderRadius: '50%',
            padding: '4px 6px',
            fontSize: '12px'
          }}>{unreadCount}</span>
        )}
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          background: 'white',
          border: '1px solid #ccc',
          padding: '10px',
          width: '300px',
          zIndex: 10
        }}>
          <h4>Notifications</h4>
          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {notifications.map(note => (
                <li key={note.id} style={{ padding: '5px 0' }}>
                  <p>{note.message}</p>
                  <small>{new Date(note.created_at).toLocaleString()}</small><br />
                  <button onClick={() => markAsRead(note.id)} style={{ fontSize: '12px', marginTop: '5px' }}>
                    Mark as read
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
