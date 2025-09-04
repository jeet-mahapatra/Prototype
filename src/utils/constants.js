// App constants for the Civic Issue Reporting System

export const ISSUE_STATUSES = {
  SUBMITTED: 'submitted',
  PENDING: 'Pending',
  ACKNOWLEDGED: 'acknowledged',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'Resolved',
  CLOSED: 'closed'
};

export const USER_ROLES = {
  CITIZEN: 'citizen',
  ADMIN: 'admin',
  MUNICIPALITY: 'municipality'
};

export const ISSUE_CATEGORIES = [
  { id: 1, name: 'Road Maintenance', icon: '🛣️' },
  { id: 2, name: 'Water Supply', icon: '💧' },
  { id: 3, name: 'Electricity', icon: '⚡' },
  { id: 4, name: 'Garbage Collection', icon: '🗑️' },
  { id: 5, name: 'Street Lighting', icon: '💡' },
  { id: 6, name: 'Drainage', icon: '🌊' },
  { id: 7, name: 'Public Transport', icon: '🚌' },
  { id: 8, name: 'Public Safety', icon: '🛡️' },
  { id: 9, name: 'Healthcare', icon: '🏥' },
  { id: 10, name: 'Education', icon: '🎓' },
  { id: 11, name: 'Parks & Recreation', icon: '🌳' },
  { id: 12, name: 'Others', icon: '📝' }
];

export const DEPARTMENTS = [
  { id: 1, name: 'Public Works Department' },
  { id: 2, name: 'Water & Sanitation Department' },
  { id: 3, name: 'Electricity Board' },
  { id: 4, name: 'Municipal Corporation' },
  { id: 5, name: 'Transport Department' },
  { id: 6, name: 'Police Department' },
  { id: 7, name: 'Health Department' },
  { id: 8, name: 'Education Department' }
];

export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const API_ENDPOINTS = {
  USERS: '/users',
  ISSUES: '/issues',
  CATEGORIES: '/categories',
  DEPARTMENTS: '/departments',
  UPLOADED_IMAGES: '/uploadedImages'
};

export const LOCAL_STORAGE_KEYS = {
  USER: 'civic_user',
  TOKEN: 'civic_token',
  PREFERENCES: 'civic_preferences'
};

export const STATUS_COLORS = {
  [ISSUE_STATUSES.PENDING]: 'text-yellow-600 bg-yellow-100',
  [ISSUE_STATUSES.IN_PROGRESS]: 'text-blue-600 bg-blue-100',
  [ISSUE_STATUSES.RESOLVED]: 'text-green-600 bg-green-100',
  [ISSUE_STATUSES.CLOSED]: 'text-gray-600 bg-gray-100'
};

export const DEMO_CREDENTIALS = {
  CITIZEN: {
    email: 'citizen@demo.com',
    password: 'citizen123'
  },
  ADMIN: {
    email: 'admin@jharkhand.gov.in',
    password: 'admin123'
  }
};
