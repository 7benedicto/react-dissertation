import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get('/api/notifications/', {
      headers: {
        Authorization: `Token ${localStorage.getItem('authToken')}`,
      }
    })
    .then(response => {
      setNotifications(response.data);
    })
    .catch(error => {
      console.error("Error fetching notifications", error);
    });
  }, []);

  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {notifications.map(note => (
          <li key={note.id}>
            {note.message} ({new Date(note.created_at).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
