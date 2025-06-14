import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AssignedStudents.css"; // Optional: include if you're using CSS

const AssignedStudents = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage] = useState(5); // Number of students per page

    // Fetch students from the backend
    useEffect(() => {
        const fetchAssignedStudents = async () => {
            const email = localStorage.getItem("userEmail");
            const token = localStorage.getItem("authToken"); // Retrieve token from localStorage

            if (!email || !token) {
                setError("No supervisor email or authentication token found. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
                const response = await axios.get(`${BASE_URL}/api/assigned-students/`, {
                    headers: {
                        Authorization: `Token ${token}`, // Pass token in the request headers
                    },
                    params: { email: email }, // Pass supervisor email as a query parameter
                });

                setStudents(response.data);
                setFilteredStudents(response.data); // Set initial filtered data
            } catch (err) {
                console.error("Error fetching assigned students:", err);
                setError("Failed to fetch assigned students.");
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedStudents();
    }, []);

    // Search and filter functionality
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        filterStudents(e.target.value);
    };

    const filterStudents = (query) => {
        const filtered = students.filter((student) => {
            return (
                student.full_name.toLowerCase().includes(query.toLowerCase()) ||
                student.reg_number.includes(query)
            );
        });
        setFilteredStudents(filtered);
    };

    // Pagination logic
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Render the component
    return (
        <div className="assigned-students-container">
            <h2>Assigned Students</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by name or registration number"
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-bar"
            />

            {!loading && !error && filteredStudents.length > 0 ? (
                <>
                    <table className="assigned-students-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Registration Number</th>
                                <th>Full Name</th>
                                <th>Project Title</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentStudents.map((student, index) => (
                                <tr key={student.id} className={student.project_title ? "" : "highlight"}>
                                    <td>{index + 1}</td>
                                    <td>{student.reg_number}</td>
                                    <td>{student.full_name}</td>
                                    <td>{student.project_title || "Not yet assigned"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="pagination">
                        {Array.from({ length: Math.ceil(filteredStudents.length / studentsPerPage) }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={currentPage === index + 1 ? "active" : ""}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                !loading && !error && <p>No students have been assigned yet.</p>
            )}
        </div>
    );
};

export default AssignedStudents;
