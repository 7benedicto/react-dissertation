import React, { useEffect, useState, useCallback } from 'react';
import EditGroupModal from './EditGroupModal';

const ProjectGroupList = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [message, setMessage] = useState('');
  const [editingGroup, setEditingGroup] = useState(null);

  const token = localStorage.getItem('token');

  const fetchInitialData = useCallback(async () => {
    try {
      const [courseRes, yearRes, groupRes] = await Promise.all([
        fetch('/api/courses/', { headers: { Authorization: `Token ${token}` } }),
        fetch('/api/years/', { headers: { Authorization: `Token ${token}` } }),
        fetch('/api/project-groups/', { headers: { Authorization: `Token ${token}` } }),
      ]);

      if (!courseRes.ok || !yearRes.ok || !groupRes.ok) {
        throw new Error('Failed to load initial data');
      }

      const coursesData = await courseRes.json();
      const yearsData = await yearRes.json();
      const groupsData = await groupRes.json();

      setCourses(coursesData);
      setYears(yearsData);
      setGroups(groupsData);
      setFilteredGroups(groupsData);
    } catch (err) {
      setMessage('Error loading initial data');
    }
  }, [token]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    let result = [...groups];
    if (selectedCourse) {
      result = result.filter(group => group.course.id === parseInt(selectedCourse));
    }
    if (selectedYear) {
      result = result.filter(group => group.year.id === parseInt(selectedYear));
    }
    setFilteredGroups(result);
  }, [selectedCourse, selectedYear, groups]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;
    try {
      const res = await fetch(`/api/project-groups/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) {
        setMessage('Group deleted successfully');
        const updatedGroups = groups.filter(group => group.id !== id);
        setGroups(updatedGroups);
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      setMessage('Failed to delete group');
    }
  };

  const handleSaveEdit = (updatedGroup) => {
    setEditingGroup(null);
    setGroups(prev =>
      prev.map(group => (group.id === updatedGroup.id ? updatedGroup : group))
    );
    setMessage(`Group "${updatedGroup.name}" updated successfully.`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <h2>Project Groups</h2>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="">Filter by Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>

        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">Filter by Year</option>
          {years.map(year => (
            <option key={year.id} value={year.id}>{year.year}</option>
          ))}
        </select>
      </div>

      {filteredGroups.length === 0 ? (
        <p>No groups found.</p>
      ) : (
        filteredGroups.map(group => (
          <div key={group.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px' }}>
            <h3>{group.name}</h3>
            <p><strong>Project Title:</strong> {group.project_title || 'N/A'}</p>
            <p><strong>Course:</strong> {group.course.name} | <strong>Year:</strong> {group.year.year}</p>
            <p><strong>Members:</strong></p>
            <ul>
              {group.members.map(member => (
                <li key={member.id}>{member.full_name} ({member.reg_number})</li>
              ))}
            </ul>
            <div>
              <button onClick={() => handleDelete(group.id)} style={{ marginRight: '10px', color: 'red' }}>
                Delete
              </button>
              <button onClick={() => setEditingGroup(group)}>Edit</button>
            </div>
          </div>
        ))
      )}

      {editingGroup && (
        <EditGroupModal
          group={editingGroup}
          token={token}
          onClose={() => setEditingGroup(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default ProjectGroupList;
