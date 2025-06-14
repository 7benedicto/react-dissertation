import React, { useEffect, useState } from 'react';

const GroupedStudentList = () => {
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // 👈 new state for search

  useEffect(() => {
    const fetchGroupedStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("You must be logged in to view this data.");
          setLoading(false);
          return;
        }

        const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
        const response = await fetch(`${BASE_URL}/api/grouped-students/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('Access denied. Please log in again.');
          }
          throw new Error('Failed to load data');
        }

        const data = await response.json();
        setGroupedData(data);
      } catch (err) {
        setError(err.message || 'Unexpected error');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupedStudents();
  }, []);

  const handleGroupClick = (groupKey) => {
    setSelectedGroup(groupKey);
    setSearchTerm(''); // reset search when new group is selected
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <p>Loading student groups...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const uniqueGroups = groupedData.map(group => ({
    key: `${group.course} - ${group.year}`,
    course: group.course,
    year: group.year
  }));

  const selectedStudents = groupedData.find(
    group => `${group.course} - ${group.year}` === selectedGroup
  );

  const filteredStudents = selectedStudents?.students.filter(student =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.reg_number.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="grouped-student-list">
      <h2>Student Groups</h2>

      {/* Group Filter Buttons */}
      <div className="group-buttons" style={{ marginBottom: '20px' }}>
        {uniqueGroups.map((group, index) => (
          <button
            key={index}
            onClick={() => handleGroupClick(group.key)}
            style={{
              margin: '5px',
              padding: '8px 12px',
              backgroundColor: selectedGroup === group.key ? '#4CAF50' : '#eee',
              color: selectedGroup === group.key ? '#fff' : '#333',
              border: '1px solid #ccc',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {group.key}
          </button>
        ))}
      </div>

      {/* Show Students of Selected Group */}
      {selectedGroup && selectedStudents ? (
        <div className="student-group">
          <h3>{selectedGroup}</h3>

          {/* 🔍 Search Box */}
          <div style={{ margin: '10px 0' }}>
            <input
              type="text"
              placeholder="Search by name or reg number..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                padding: '8px',
                width: '100%',
                maxWidth: '400px',
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            />
          </div>

          {/* Filtered Students */}
          {filteredStudents.length > 0 ? (
            <ul>
              {filteredStudents.map((student) => (
                <li key={student.reg_number}>
                  {student.full_name} ({student.reg_number})
                </li>
              ))}
            </ul>
          ) : (
            <p>No matching students found.</p>
          )}
        </div>
      ) : (
        <p>Please select a group to view students.</p>
      )}
    </div>
  );
};

export default GroupedStudentList;
