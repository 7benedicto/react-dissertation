import React, { useEffect, useState } from 'react';

const MyGroup = () => {
  const [group, setGroup] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
        const res = await fetch(`${BASE_URL}/api/my-group/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || 'Failed to fetch group');
        }

        const data = await res.json();
        setGroup(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchGroup();
  }, [token]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!group) return <p>Loading group info...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>My Project Group</h2>
      <p><strong>Group Name:</strong> {group.name}</p>
      <p><strong>Project Title:</strong> {group.project_title || 'N/A'}</p>
      <p><strong>Course:</strong> {group.course.name}</p>
      <p><strong>Year:</strong> {group.year.year}</p>

      {group.supervisor ? (
        <>
          <p><strong>Supervisor:</strong> {group.supervisor.username}</p>
          <p><strong>Email:</strong> {group.supervisor.email}</p>
        </>
      ) : (
        <p><strong>Supervisor:</strong> Not assigned</p>
      )}

      <h4>Members:</h4>
      <ul>
        {group.members.map((member) => (
          <li key={member.id}>
            {member.full_name} ({member.reg_number})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyGroup;
