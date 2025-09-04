import React from 'react';
import StatsCards from '../components/dashboard/StatsCards';
import IssuesList from '../components/dashboard/IssuesList';
import DashboardFilters from '../components/dashboard/DashboardFilters';

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <p className="text-gray-600">Track your reported issues and local updates.</p>
      </div>
      <DashboardFilters />
      <StatsCards />
      <IssuesList onlyMine />
    </div>
  );
}
