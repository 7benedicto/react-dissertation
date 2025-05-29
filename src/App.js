import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import HomePage from "./HomePage";
import StudentLogin from "./pages/StudentLogin";
import SupervisorLogin from "./SupervisorLogin";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import RegistrationForm from "./RegistrationForm";
import AdminLoginForm from "./AdminLoginForm";
import AdminDashboard from "./AdminDashboard";
import StudentList from "./StudentList";
import AssignSupervisor from "./AssignSupervisor";
import AssignGroupSupervisor from "./AssignGroupSupervisor";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import AdminAnnouncements from "./AdminAnnouncements";
import AddSupervisor from "./AddSupervisor";
import UserProfile from "./UserProfile";
import ChangePassword from "./ChangePassword";
import ManageStages from "./ManageStages";
import Layout from "./Layout";
import GroupedStudentList from './GroupedStudentList';
import AutoGroupGeneratorForm from "./AutoGroupGeneratorForm";
import ProjectGroupList from "./ProjectGroupList";
import AdminRepository from "./AdminRepository";

function App() {
  return (
      <Router>
        <Header />
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/student-login" element={<StudentLogin />} />
              <Route path="/supervisor-login" element={<SupervisorLogin />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/supervisor-dashboard" element={<Layout><SupervisorDashboard /></Layout>} />
              <Route path="/registration" element={<RegistrationForm />} />
              {/* Login Page */}
                <Route path="/admin-login" element={<AdminLoginForm />} />

              {/* Admin Dashboard */}
              <Route path="/admin-dashboard" element={<Layout><AdminDashboard /></Layout>} />
              <Route path="/admin-dashboard/students" element={<StudentList />} />
              <Route path="/admin-dashboard/assign-supervisor" element={<AssignSupervisor />} />
              <Route path="/admin-dashboard/assign-group-supervisor" element={<AssignGroupSupervisor />} />
              <Route path="/admin-dashboard/admin-announcements" element={<AdminAnnouncements />} />
              <Route path="/admin-dashboard/add-supervisor" element={<AddSupervisor />} />
              <Route path="/admin-dashboard/user-profile" element={<UserProfile />} />
              <Route path="/admin-dashboard/manage-stages" element={<ManageStages />} />
              <Route path="/admin-dashboard/grouped-student-list" element={<GroupedStudentList />} />
              <Route path="/admin-dashboard/auto-group-generator" element={<AutoGroupGeneratorForm />} />
              <Route path="/admin-dashboard/project-group-list" element={<ProjectGroupList />} />
              <Route path="/admin-dashboard/admin-repository" element={<AdminRepository />} />
              <Route path="/change-password" element={<ChangePassword />} />

          </Routes>
      </Router>
  );
}

export default App;