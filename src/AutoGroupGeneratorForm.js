import React, { useEffect, useState } from 'react';

const AutoGroupGeneratorForm = () => {
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [groupSize, setGroupSize] = useState(4);
  const [baseName, setBaseName] = useState('Group');
  const [message, setMessage] = useState('');
  const [createdGroups, setCreatedGroups] = useState([]);
  const [minFemalesPerGroup, setMinFemalesPerGroup] = useState(0);

  const token = localStorage.getItem('token');

  // Load dropdown data
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [coursesRes, yearsRes] = await Promise.all([
          fetch('/api/courses/', {
            headers: { Authorization: `Token ${token}` }
          }),
          fetch('/api/years/', {
            headers: { Authorization: `Token ${token}` }
          }),
        ]);

        const coursesData = await coursesRes.json();
        const yearsData = await yearsRes.json();

        setCourses(coursesData);
        setYears(yearsData);
      } catch (err) {
        setMessage('⚠️ Failed to load courses or years.');
      }
    };

    fetchDropdowns();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setCreatedGroups([]);

    try {
      const res = await fetch('/api/auto-create-groups/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          course_id: selectedCourse,
          year_id: selectedYear,
          group_size: groupSize,
          min_females_per_group: minFemalesPerGroup,
          base_name: baseName
        })
      });

      if (!res.ok) throw new Error('Group creation failed');

      const data = await res.json();
      setMessage(data.message);
      setCreatedGroups(data.groups);
    } catch (err) {
      setMessage('❌ Failed to create groups. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>Auto-Generate Project Groups</h2>

      {message && <p style={{ color: message.startsWith('✅') || message.includes('created') ? 'green' : 'red' }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Course:</label>
        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} required>
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>

        <label>Year of Study:</label>
        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} required>
          <option value="">Select Year</option>
          {years.map(year => (
            <option key={year.id} value={year.id}>{year.year}</option>
          ))}
        </select>

        <label>Group Size:</label>
        <input
          type="number"
          value={groupSize}
          onChange={e => setGroupSize(parseInt(e.target.value))}
          min="2"
          max="10"
          required
        />

        <label>Min Female Students per Group:</label>
        <input
          type="number"
          value={minFemalesPerGroup}
          onChange={e => setMinFemalesPerGroup(parseInt(e.target.value))}
          min="0"
          max={groupSize}
        />

        <label>Base Group Name:</label>
        <input
          type="text"
          value={baseName}
          onChange={e => setBaseName(e.target.value)}
          required
        />

        <button type="submit" style={{ marginTop: '15px' }}>Generate Groups</button>
      </form>

      {createdGroups.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Created Groups:</h3>
          <ul>
            {createdGroups.map((group, idx) => (
              <li key={idx}>{group}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AutoGroupGeneratorForm;
