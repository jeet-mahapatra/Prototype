import React from 'react';
import Layout from '../components/layout/Layout';
import StatsCards from '../components/dashboard/StatsCards';
import IssuesList from '../components/dashboard/IssuesList';
import ReportIssueForm from '../components/ReportIssueForm';
import UserProfile from '../components/auth/UserProfile';
import AuthModal from '../components/auth/AuthModal';
import { useAuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuthContext();

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        <div className="bg-blue-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-4">
                  Jharkhand Civic Issues Portal
                </h1>
                <p className="text-xl text-blue-100">
                  Report civic issues and track their resolution in your community
                </p>
              </div>
              
              {isAuthenticated ? (
                <UserProfile />
              ) : (
                <AuthModal />
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <StatsCards />
              <IssuesList />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {isAuthenticated && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Report New Issue</h2>
                  <ReportIssueForm />
                </div>
              )}

              {/* Info Section */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">How it Works</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-2 text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-medium">Report Issue</h4>
                      <p className="text-sm text-gray-600">Describe the problem with location and photos</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-2 text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-medium">Track Progress</h4>
                      <p className="text-sm text-gray-600">Monitor the status of your reported issue</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-2 text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-medium">Issue Resolved</h4>
                      <p className="text-sm text-gray-600">Get notified when the issue is fixed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
