import React, { useState, useMemo, useEffect } from 'react';
import { useIssuesContext } from '../../context/IssuesContext';
import { useAuthContext } from '../../context/AuthContext';
import IssueCard from './IssueCard';
import DashboardFilters from './DashboardFilters';
import { api } from '../../services/api';

const IssuesList = ({ onlyMine = false, adminMode = false, showFilters = true }) => {
  const { issues, loading, error, updateIssueStatus } = useIssuesContext();
  const { user, isAdmin } = useAuthContext();
  const [filters, setFilters] = useState({
    status: 'all',
    categoryId: 'all',
    search: '',
    departmentId: 'all'
  });
  const [usersIndex, setUsersIndex] = useState({});
  const [departments, setDepartments] = useState([]);

  // Fetch users and departments once for admin reporting and filtering
  useEffect(() => {
    const loadAux = async () => {
      try {
        const [usersRes, deptRes] = await Promise.all([
          api.get('/users'),
          api.get('/departments')
        ]);
        const idx = {};
        usersRes.forEach(u => { idx[String(u.id)] = u; });
        setUsersIndex(idx);
        setDepartments(deptRes || []);
      } catch (_) {
        // non-fatal
      }
    };
    loadAux();
  }, []);

  const filteredIssues = useMemo(() => {
    if (!issues || !Array.isArray(issues)) {
      return [];
    }
    const norm = (s) => (s || '').toString().toLowerCase();
    const currentUserId = user?.id || user?.ID || user?._id;
    let currentDeptId = user?.departmentId || user?.department?.id || user?.departmentId?.toString?.();
    if (!currentDeptId && user?.department && Array.isArray(departments) && departments.length) {
      const match = departments.find(d => norm(d.name) === norm(user.department));
      if (match) currentDeptId = String(match.id);
    }

    return issues
      .filter(issue => {
        // Scope by mine if requested
        const mineOk = !onlyMine || (currentUserId != null && String(issue.userId) === String(currentUserId));
        if (!mineOk) return false;

        // If adminMode, optionally scope by admin's department by default
        if (adminMode) {
          // If a department filter is set, apply it; else if user has a department, default to that
          const deptFilter = filters.departmentId !== 'all' ? String(filters.departmentId) : (currentDeptId ? String(currentDeptId) : null);
          if (deptFilter && String(issue.departmentId) !== deptFilter) return false;
        }

        const matchesStatus = filters.status === 'all' || issue.status === filters.status;
        const matchesCategory = filters.categoryId === 'all' || Number(issue.categoryId) === Number(filters.categoryId);
        const locationStr = typeof issue.location === 'string' ? issue.location : (issue.location?.address || '');
        const q = norm(filters.search);
        const matchesSearch = q === '' ||
          norm(issue.title).includes(q) ||
          norm(issue.description).includes(q) ||
          norm(locationStr).includes(q);

        return matchesStatus && matchesCategory && matchesSearch;
      });
  }, [issues, filters, onlyMine, user, adminMode, departments]);

  const handleStatusChange = async (issueId, status) => {
    await updateIssueStatus(issueId, status);
  };

  const handleAddOfficialComment = async (issueId, message) => {
    try {
      const { issuesService } = await import('../../services/issuesService');
      await issuesService.addComment(issueId, { userId: user?.id, message, isOfficial: true });
    } catch (_) {}
  };

  const handleAssign = async (issueId, assignedTo, departmentId) => {
    try {
      const { issuesService } = await import('../../services/issuesService');
      await issuesService.assignIssue(issueId, { assignedTo, departmentId });
    } catch (_) {}
  };

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
      {showFilters && (
        <>
          <DashboardFilters onFilterChange={setFilters} adminMode={adminMode} departments={departments} />
          {adminMode && user?.departmentId && (
            <div className="text-sm text-gray-500 mb-2">Defaulting to your department unless changed.</div>
          )}
        </>
      )}
      
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500">No issues found matching your criteria.</p>
          </div>
        ) : (
          filteredIssues.map(issue => (
            <div key={issue.id} className="space-y-2">
              <IssueCard 
                issue={issue} 
                currentUser={user}
                isAdmin={adminMode || isAdmin()}
                onStatusChange={adminMode ? handleStatusChange : undefined}
                reporterName={usersIndex[String(issue.userId)]?.name}
              />
              {adminMode && (
                <div className="bg-white rounded-lg shadow p-4 -mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600 w-28">Assigned to</label>
                      <input className="flex-1 border border-gray-300 rounded px-2 py-1" defaultValue={issue.assignedTo || ''}
                        onBlur={(e) => handleAssign(issue.id, e.target.value, undefined)} />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600 w-28">Department</label>
                      <select className="flex-1 border border-gray-300 rounded px-2 py-1" defaultValue={issue.departmentId || 'all'}
                        onChange={(e) => handleAssign(issue.id, undefined, e.target.value)}>
                        <option value="all">Unassigned</option>
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600 w-28">Add note</label>
                      <input className="flex-1 border border-gray-300 rounded px-2 py-1" placeholder="Official comment"
                        onKeyDown={(e) => { if (e.key === 'Enter' && e.currentTarget.value.trim()) { handleAddOfficialComment(issue.id, e.currentTarget.value.trim()); e.currentTarget.value=''; } }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IssuesList;
