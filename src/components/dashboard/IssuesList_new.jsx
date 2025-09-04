import React, { useState, useMemo } from 'react';
import { useIssuesContext } from '../../context/IssuesContext';
import { useAuthContext } from '../../context/AuthContext';
import IssueCard from './IssueCard';
import DashboardFilters from './DashboardFilters';

const IssuesList = () => {
  const { issues, loading, error } = useIssuesContext();
  const { user, isAdmin } = useAuthContext();
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });

  const filteredIssues = useMemo(() => {
    if (!issues || !Array.isArray(issues)) {
      return [];
    }
    
    return issues.filter(issue => {
      const matchesStatus = filters.status === 'all' || issue.status === filters.status;
      const matchesCategory = filters.category === 'all' || issue.category?.slug === filters.category;
      const matchesSearch = filters.search === '' || 
        issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        issue.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        issue.location.toLowerCase().includes(filters.search.toLowerCase());

      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [issues, filters]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-medium">Error loading issues</h3>
        <p className="text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <DashboardFilters onFilterChange={setFilters} />
      
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500">No issues found matching your criteria.</p>
          </div>
        ) : (
          filteredIssues.map(issue => (
            <IssueCard 
              key={issue.id} 
              issue={issue} 
              currentUser={user}
              isAdmin={isAdmin}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default IssuesList;
