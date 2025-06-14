import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AssignedStudents.css";

const AssignedGroups = () => {
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const groupsPerPage = 5;

    useEffect(() => {
        const fetchGroups = async () => {
            const email = localStorage.getItem("userEmail");
            const token = localStorage.getItem("authToken");

            if (!email || !token) {
                setError("Authentication details missing. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
                const response = await axios.get(`${BASE_URL}/api/assigned-groups/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                    params: { email },
                });

                setGroups(response.data);
                setFilteredGroups(response.data);
            } catch (err) {
                console.error("Error fetching groups:", err);
                setError("Failed to retrieve assigned groups.");
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        const results = groups.filter(
            (group) =>
                group.name.toLowerCase().includes(query.toLowerCase()) ||
                group.group_id.includes(query)
        );
        setFilteredGroups(results);
        setCurrentPage(1); // Reset to first page on search
    };

    const indexOfLast = currentPage * groupsPerPage;
    const indexOfFirst = indexOfLast - groupsPerPage;
    const currentGroups = filteredGroups.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredGroups.length / groupsPerPage);

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <div className="assigned-students-container">
            <h2>Assigned Groups</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}

            <input
                type="text"
                className="search-bar"
                placeholder="Search by name or group ID"
                value={searchQuery}
                onChange={handleSearch}
            />

            {!loading && !error && filteredGroups.length > 0 ? (
                <>
                    <table className="assigned-students-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Group ID</th>
                                <th>Name</th>
                                <th>Project Title</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentGroups.map((group, index) => (
                                <tr key={group.id} className={!group.project_title ? "highlight" : ""}>
                                    <td>{indexOfFirst + index + 1}</td>
                                    <td>{group.group_id}</td>
                                    <td>{group.name}</td>
                                    <td>{group.project_title || "Not yet assigned"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={currentPage === i + 1 ? "active" : ""}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                !loading && !error && <p>No groups have been assigned yet.</p>
            )}
        </div>
    );
};

export default AssignedGroups;
