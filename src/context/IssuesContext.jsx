// Issues Context Provider

import React, { createContext, useContext } from 'react';
import { useIssues } from '../hooks/useIssues';

const IssuesContext = createContext();

export const useIssuesContext = () => {
  const context = useContext(IssuesContext);
  if (!context) {
    throw new Error('useIssuesContext must be used within an IssuesProvider');
  }
  return context;
};

export const IssuesProvider = ({ children }) => {
  const issues = useIssues();

  return (
    <IssuesContext.Provider value={issues}>
      {children}
    </IssuesContext.Provider>
  );
};
