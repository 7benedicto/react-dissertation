import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const EditGroupModal = ({ group, onClose, onSave, token }) => {
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  const [name, setName] = useState(group.name || '');
  const [projectTitle, setProjectTitle] = useState(group.project_title || '');
  const [courseId, setCourseId] = useState(group.course?.id || '');
  const [yearId, setYearId] = useState(group.year?.id || '');
  const [supervisorId, setSupervisorId] = useState(group.supervisor?.id || '');

  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [cRes, yRes, sRes] = await Promise.all([
          fetch('/api/courses/', { headers: { Authorization: `Token ${token}` } }),
          fetch('/api/years/', { headers: { Authorization: `Token ${token}` } }),
          fetch('/api/supervisors/', { headers: { Authorization: `Token ${token}` } }),
        ]);

        if (!cRes.ok || !yRes.ok || !sRes.ok) throw new Error('Dropdown fetch failed');

        setCourses(await cRes.json());
        setYears(await yRes.json());
        setSupervisors(await sRes.json());
      } catch (err) {
        setMessage('Failed to load dropdown data.');
      }
    };

    fetchDropdowns();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      project_title: projectTitle,
      course_id: parseInt(courseId),
      year_id: parseInt(yearId),
      member_ids: group.members.map((m) => m.id),
      supervisor_id: supervisorId ? parseInt(supervisorId) : null,
    };

    try {
      const res = await fetch(`/api/project-groups/${group.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error('Validation error:', result);
        setMessage('Update failed: ' + JSON.stringify(result));
        return;
      }

      onSave(result);
    } catch (err) {
      console.error('Network or unexpected error:', err);
      setMessage('Update failed: ' + err.message);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Edit Group</h3>
        {message && <p style={{ color: 'red' }}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <label>Group Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />

          <label>Project Title:</label>
          <input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />

          <label>Course:</label>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
            <option value="">-- Select Course --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <label>Year:</label>
          <select value={yearId} onChange={(e) => setYearId(e.target.value)} required>
            <option value="">-- Select Year --</option>
            {years.map((y) => (
              <option key={y.id} value={y.id}>{y.year}</option>
            ))}
          </select>

          <label>Supervisor:</label>
          <select value={supervisorId} onChange={(e) => setSupervisorId(e.target.value)}>
            <option value="">-- Select Supervisor --</option>
            {supervisors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.username} ({s.email})
              </option>
            ))}
          </select>

          <div style={{ marginTop: '10px' }}>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditGroupModal.propTypes = {
  group: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default EditGroupModal;
