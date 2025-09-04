import React from 'react';
import ReportIssueForm from '../components/ReportIssueForm';

export default function ReportIssue() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Report a New Issue</h1>
      <ReportIssueForm />
    </div>
  );
}
