// Issues service for API operations

import { API_ENDPOINTS, ISSUE_STATUSES } from '../utils/constants';
import { generateId } from '../utils/helpers';

const API_BASE_URL = 'http://localhost:5000';

class IssuesService {
  async getAllIssues() {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ISSUES}`);
      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching issues:', error);
      throw error;
    }
  }

  async getIssueById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ISSUES}/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch issue');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching issue:', error);
      throw error;
    }
  }

  async createIssue(issueData) {
    try {
      const newIssue = {
        id: generateId(),
        ...issueData,
        status: ISSUE_STATUSES.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: 0,
        feedback: []
      };

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ISSUES}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newIssue)
      });

      if (!response.ok) {
        throw new Error('Failed to create issue');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating issue:', error);
      throw error;
    }
  }

  async updateIssue(id, updates) {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ISSUES}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update issue');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating issue:', error);
      throw error;
    }
  }

  async updateIssueStatus(id, status) {
    return this.updateIssue(id, { status });
  }

  async deleteIssue(id) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ISSUES}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete issue');
      }

      return true;
    } catch (error) {
      console.error('Error deleting issue:', error);
      throw error;
    }
  }

  async addFeedback(id, feedback) {
    try {
      // First get the current issue
      const issue = await this.getIssueById(id);
      
      const newFeedback = {
        id: generateId(),
        ...feedback,
        createdAt: new Date().toISOString()
      };

      // Add the new feedback to existing feedback array
      const updatedFeedback = [...(issue.feedback || []), newFeedback];

      return this.updateIssue(id, { feedback: updatedFeedback });
    } catch (error) {
      console.error('Error adding feedback:', error);
      throw error;
    }
  }

  async addComment(id, comment) {
    try {
      const issue = await this.getIssueById(id);
      const newComment = {
        id: generateId(),
        ...comment,
        timestamp: new Date().toISOString()
      };
      const updatedComments = [...(issue.comments || []), newComment];
      return this.updateIssue(id, { comments: updatedComments });
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  async assignIssue(id, { assignedTo, departmentId }) {
    try {
      const payload = {};
      if (assignedTo !== undefined) payload.assignedTo = assignedTo;
      if (departmentId !== undefined) payload.departmentId = departmentId;
      return this.updateIssue(id, payload);
    } catch (error) {
      console.error('Error assigning issue:', error);
      throw error;
    }
  }

  async upvoteIssue(id) {
    try {
      const issue = await this.getIssueById(id);
      const newUpvotes = (issue.upvotes || 0) + 1;
      return this.updateIssue(id, { upvotes: newUpvotes });
    } catch (error) {
      console.error('Error upvoting issue:', error);
      throw error;
    }
  }

  async getIssuesByUser(userId) {
    try {
      const allIssues = await this.getAllIssues();
      return allIssues.filter(issue => issue.userId === userId);
    } catch (error) {
      console.error('Error fetching user issues:', error);
      throw error;
    }
  }

  async getIssuesByStatus(status) {
    try {
      const allIssues = await this.getAllIssues();
      return allIssues.filter(issue => issue.status === status);
    } catch (error) {
      console.error('Error fetching issues by status:', error);
      throw error;
    }
  }

  async getIssuesByCategory(categoryId) {
    try {
      const allIssues = await this.getAllIssues();
      return allIssues.filter(issue => issue.categoryId === categoryId);
    } catch (error) {
      console.error('Error fetching issues by category:', error);
      throw error;
    }
  }

  async getStats() {
    try {
      const allIssues = await this.getAllIssues();
      
      const total = allIssues.length;
      const pending = allIssues.filter(issue => 
        issue.status === 'Pending' || issue.status === 'submitted'
      ).length;
      const inProgress = allIssues.filter(issue => 
        issue.status === 'In Progress' || issue.status === 'in-progress' || issue.status === 'acknowledged'
      ).length;
      const resolved = allIssues.filter(issue => 
        issue.status === 'Resolved' || issue.status === 'resolved' || issue.status === 'closed'
      ).length;
      
      return {
        total,
        pending,
        inProgress,
        resolved
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
}

export const issuesService = new IssuesService();
