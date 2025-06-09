import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registerStudent, getCourses, getYears } from './api';
import './RegistrationForm.css';

const StudentRegisterForm = () => {
    const [formData, setFormData] = useState({
        reg_number: '',
        full_name: '',
        password: '',
        course_id: '',
        year_id: '',
        sex: '',
    });

    const [courses, setCourses] = useState([]);
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Fetch courses and years when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const coursesData = await getCourses();
                const yearsData = await getYears();

                console.log("Courses fetched:", coursesData);
                console.log("Years fetched:", yearsData);

                setCourses(coursesData || []); // fallback to [] if undefined
                setYears(yearsData || []);
            } catch (error) {
                console.error('Failed to load courses or years:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await registerStudent(formData);
            setMessage(data.message || "Registration successful!");
        } catch (error) {
            console.error('Registration error:', error);
            setMessage("Error: " + JSON.stringify(error));
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Student Registration</h2>

                {loading ? (
                    <p>Loading course and year options...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="text"
                                name="reg_number"
                                placeholder="Reg Number"
                                value={formData.reg_number}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                name="full_name"
                                placeholder="Full Name"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <select name="course_id" value={formData.course_id} onChange={handleChange} required>
                                <option value="">Select Course</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>{course.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <select name="year_id" value={formData.year_id} onChange={handleChange} required>
                                <option value="">Select Year of Study</option>
                                {years.map(year => (
                                    <option key={year.id} value={year.id}>{year.year}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <select name="sex" value={formData.sex} onChange={handleChange} required>
                                <option value="">Select Sex</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </select>
                        </div>
                        <button type="submit" className="register-button">Register</button>
                    </form>
                )}

                {message && <p className="message">{message}</p>}

                <div className="back-link">
                    <Link to="/student-login">← Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default StudentRegisterForm;
