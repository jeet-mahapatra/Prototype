// Custom hook for issues data management

import { useState, useEffect } from 'react';
import { issuesService } from '../services/issuesService';
import { getIssueStats, filterIssuesByStatus, searchIssues } from '../utils/helpers';

export const useIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });

  // Fetch all issues
  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const issuesData = await issuesService.getAllIssues();
      setIssues(issuesData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching issues:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new issue
  const createIssue = async (issueData) => {
    try {
      const newIssue = await issuesService.createIssue(issueData);
      setIssues(prev => [newIssue, ...prev]);
      return { success: true, issue: newIssue };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Update issue status
  const updateIssueStatus = async (issueId, status) => {
    try {
      const updatedIssue = await issuesService.updateIssueStatus(issueId, status);
      setIssues(prev => 
        prev.map(issue => 
          issue.id === issueId ? { ...issue, ...updatedIssue } : issue
        )
      );
      return { success: true, issue: updatedIssue };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Delete issue
  const deleteIssue = async (issueId) => {
    try {
      await issuesService.deleteIssue(issueId);
      setIssues(prev => prev.filter(issue => issue.id !== issueId));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Add feedback to issue
  const addFeedback = async (issueId, feedback) => {
    try {
      const updatedIssue = await issuesService.addFeedback(issueId, feedback);
      setIssues(prev => 
        prev.map(issue => 
          issue.id === issueId ? { ...issue, ...updatedIssue } : issue
        )
      );
      return { success: true, issue: updatedIssue };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Get filtered issues based on current filters
  const getFilteredIssues = () => {
    let filtered = issues;

    // Filter by status
    filtered = filterIssuesByStatus(filtered, filters.status);

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(issue => issue.categoryId === parseInt(filters.category));
    }

    // Filter by search term
    filtered = searchIssues(filtered, filters.search);

    return filtered;
  };

  // Get issues statistics
  const getStats = () => {
    return getIssueStats(issues);
  };

  // Get user's issues
  const getUserIssues = (userId) => {
    return issues.filter(issue => issue.userId === userId);
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: 'all',
      category: 'all',
      search: ''
    });
  };

  // Fetch issues on component mount
  useEffect(() => {
    fetchIssues();
  }, []);

  // Refresh issues periodically (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchIssues();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    issues,
    loading,
    error,
    filters,
    fetchIssues,
    createIssue,
    updateIssueStatus,
    deleteIssue,
    addFeedback,
    getFilteredIssues,
    getStats,
    getUserIssues,
    updateFilters,
    clearFilters,
    setError
  };
};
