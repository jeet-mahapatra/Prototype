import React from 'react';
import IssuesList from '../components/dashboard/IssuesList';

export default function MyIssues() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Reported Issues</h1>
      <IssuesList onlyMine />
    </div>
  );
}
