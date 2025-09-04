// Utility helper functions

import { ISSUE_STATUSES, STATUS_COLORS } from './constants';

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return formatDate(dateString);
  }
};

export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || 'text-gray-600 bg-gray-100';
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getIssueStats = (issues) => {
  const stats = {
    total: issues.length,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  };

  issues.forEach(issue => {
    switch (issue.status) {
      case ISSUE_STATUSES.PENDING:
        stats.pending++;
        break;
      case ISSUE_STATUSES.IN_PROGRESS:
        stats.inProgress++;
        break;
      case ISSUE_STATUSES.RESOLVED:
        stats.resolved++;
        break;
      case ISSUE_STATUSES.CLOSED:
        stats.closed++;
        break;
    }
  });

  return stats;
};

export const filterIssuesByStatus = (issues, status) => {
  if (!status || status === 'all') return issues;
  return issues.filter(issue => issue.status === status);
};

export const searchIssues = (issues, searchTerm) => {
  if (!searchTerm) return issues;
  const term = searchTerm.toLowerCase();
  return issues.filter(issue => 
    issue.title.toLowerCase().includes(term) ||
    issue.description.toLowerCase().includes(term) ||
    issue.location.toLowerCase().includes(term)
  );
};
