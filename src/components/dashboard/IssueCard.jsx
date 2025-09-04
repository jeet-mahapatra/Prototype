import React from 'react';
import { useAuthContext } from '../../context/AuthContext';

const IssueCard = ({ issue, onStatusChange, reporterName }) => {
  const { user } = useAuthContext();
  
  const getStatusColor = (status) => {
    switch (status) {
  case 'pending': return 'bg-yellow-100 text-yellow-800';
  case 'submitted': return 'bg-yellow-100 text-yellow-800';
  case 'acknowledged': return 'bg-indigo-100 text-indigo-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
  case 'closed': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const canViewUserDetails = () => {
    return user?.role === 'admin' || user?.id === issue.userId;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{issue.title}</h3>
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(issue.status)}`}>
            {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {formatDate(issue.createdAt)}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 line-clamp-3">{issue.description}</p>

      {/* Image */}
      {issue.imageUrl && (
        <div className="mb-4">
          <img 
            src={issue.imageUrl} 
            alt="Issue" 
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Category:</span>
          <span>
            {typeof issue.category === 'string' 
              ? issue.category 
              : issue.category?.name || 'Other'
            }
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Location:</span>
          <span>
            {typeof issue.location === 'string' 
              ? issue.location 
              : issue.location?.address || 'Location not specified'
            }
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Reported by:</span>
          <span>
            {canViewUserDetails() ? (reporterName || issue.userName || `User #${issue.userId}`) : 'Citizen'}
          </span>
        </div>
      </div>

      {/* Actions */}
      {user?.role === 'admin' && onStatusChange && (
        <div className="flex gap-2">
          <select
            value={issue.status}
            onChange={(e) => onStatusChange(issue.id, e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="submitted">Submitted</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default IssueCard;
