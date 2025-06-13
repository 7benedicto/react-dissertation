// src/api.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

// Register a new student
export const registerStudent = async (studentData) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/register/`, studentData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
// For courses
export const getCourses = async () => {
    const response = await fetch('/api/courses/');
    return await response.json();
};

// For years
export const getYears = async () => {
    const response = await fetch('/api/years/');
    return await response.json();
};

// Login a student
export const loginStudent = async (credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/login/`, credentials);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Login Admin
export const loginAdmin = async (credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/admin-login/`, credentials);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to fetch the list of students
export const fetchStudents = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/students/`);
        return response.data; // Return the list of students
    } catch (error) {
        console.error("Error fetching students:", error);
        throw error; // Throw the error for the calling code to handle
    }
};

// Function to fetch the list of students
export const titleRegister = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/register-title/`);
        return response.data; // Return the list of students
    } catch (error) {
        console.error("Error registering titles:", error);
        throw error; // Throw the error for the calling code to handle
    }
};

// Function to fetch the list of students
export const seeStudents = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/assigned-students/`);
        return response.data; // Return the list of students
    } catch (error) {
        console.error("Error fetching students:", error);
        throw error; // Throw the error for the calling code to handle
    }
};

// Function to fetch the list of students
export const seeSupervisors = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/assigned-supervisor/`);
        return response.data; // Return the list of students
    } catch (error) {
        console.error("Error fetching supervisors:", error);
        throw error; // Throw the error for the calling code to handle
    }
};
