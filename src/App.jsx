import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import Students from './pages/Admin/Students';
import Companies from './pages/Admin/Companies';

// User Pages
import Dashboard from './pages/User/Dashboard';
import Profile from './pages/User/Profile';
import Opportunities from './pages/User/Opportunities';
import HomePage from './pages/Auth/HomePage';
import CompanyForm from './pages/Admin/CompanyForm';
import CompanyVisitsList from './pages/Admin/CompanyVisitsList';
import VisitForm from './pages/Admin/VisitForm';
import EditVisitForm from './pages/Admin/EditVisitForm';
import ApplicationsManagement from './pages/Admin/ApplicationsManagement';
import ReportsDashboard from'./pages/Admin/ReportsDashboard';
import PlacementRecords from './pages/Admin/PlacementRecords';
import DepartmentManagement from './pages/Admin/DepartmentManagement';
import OpportunityDetails from './pages/User/OpportunityDetails';
import ApplicationsList from './pages/User/ApplicationsList';
import PlacementRecordsUser from './pages/User/PlacementRecordsUser';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/api/auth/public/reset-password" element={<ResetPassword />} />
            {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
           
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/students" element={
              <ProtectedRoute adminOnly>
                <Students />
              </ProtectedRoute>
            } />
            <Route path="/admin/companies" element={
              <ProtectedRoute adminOnly>
                <Companies />
              </ProtectedRoute>
            } />
             <Route path="/companies/new" element={ <ProtectedRoute adminOnly>
                <CompanyForm />
              </ProtectedRoute>} />
            <Route path="/companies/edit/:id" element={ <ProtectedRoute adminOnly>
                <CompanyForm />
              </ProtectedRoute>} />

              <Route path="/admin/visits" element={
              <ProtectedRoute adminOnly>
                <CompanyVisitsList />
              </ProtectedRoute>
            } />

             <Route path="/admin/visits/new" element={
              <ProtectedRoute adminOnly>
                <VisitForm />
              </ProtectedRoute>
            } />
            <Route 
              path="/admin/visits/edit/:visitId" 
              element={
                <ProtectedRoute adminOnly>
                  <EditVisitForm />
                </ProtectedRoute>
              } 
              />

              <Route 
              path="/admin/applications" 
              element={
                <ProtectedRoute adminOnly>
                  <ApplicationsManagement />
                </ProtectedRoute>
              } 
              />

              <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute adminOnly>
                  <ReportsDashboard />
                </ProtectedRoute>
              } 
              />

               <Route 
              path="/admin/placementrecords" 
              element={
                <ProtectedRoute adminOnly>
                  <PlacementRecords />
                </ProtectedRoute>
              } 
              />

              <Route 
              path="/admin/departments" 
              element={
                <ProtectedRoute adminOnly>
                  <DepartmentManagement />
                </ProtectedRoute>
              } 
              />

              

            
            
            {/* User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/opportunities" element={
              <ProtectedRoute>
                <Opportunities />
              </ProtectedRoute>
            } />

            <Route path="/opportunities/:visitId" element={
              <ProtectedRoute>
                <OpportunityDetails />
              </ProtectedRoute>
            } />

            <Route path="/applications" element={
              <ProtectedRoute>
                <ApplicationsList />
              </ProtectedRoute>
            } />

            <Route path="/placements" element={
              <ProtectedRoute>
                <PlacementRecordsUser />
              </ProtectedRoute>
            } />
            
            {/* Default Redirects */}
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;