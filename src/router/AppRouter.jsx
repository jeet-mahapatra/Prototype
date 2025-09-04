import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';

// Lazy placeholders for dedicated pages
const AdminDashboard = React.lazy(() => import('../pages/AdminDashboard'));
const UserDashboard = React.lazy(() => import('../pages/UserDashboard'));
const ReportIssue = React.lazy(() => import('../pages/ReportIssue'));
const MyIssues = React.lazy(() => import('../pages/MyIssues'));
const NotFound = () => <div className="p-8">404 - Page Not Found</div>;

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}

function RequireAdmin({ children }) {
  const { isAuthenticated, isAdmin } = useAuthContext();
  if (!isAuthenticated()) return <Navigate to="/" replace />;
  return isAdmin() ? children : <Navigate to="/user" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <React.Suspense fallback={<div className="p-8">Loading...</div>}>
          <Routes>
            {/* Public Landing -> existing Dashboard acts as landing */}
            <Route path="/" element={<Dashboard />} />

            {/* User area */}
            <Route
              path="/user"
              element={
                <RequireAuth>
                  <UserDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/user/report"
              element={
                <RequireAuth>
                  <ReportIssue />
                </RequireAuth>
              }
            />
            <Route
              path="/user/issues"
              element={
                <RequireAuth>
                  <MyIssues />
                </RequireAuth>
              }
            />

            {/* Admin area */}
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminDashboard />
                </RequireAdmin>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.Suspense>
      </Layout>
    </BrowserRouter>
  );
}



// Root ->   login, register , otp verify , /

// root/p -> dashboard , profile , report , report/reportId , track, 

// root/admin -> areas , issues , login , organization , users , /
