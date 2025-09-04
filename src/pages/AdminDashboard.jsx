import React from 'react';
import StatsCards from '../components/dashboard/StatsCards';
import IssuesList from '../components/dashboard/IssuesList';
import { useAuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuthContext();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Console</h1>
        <p className="text-gray-600">Welcome {user?.name}. Manage city-wide issues, departments, and status updates.</p>
      </div>
      <StatsCards />
      <IssuesList adminMode />
    </div>
  );
}
