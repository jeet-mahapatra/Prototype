import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { IssuesProvider } from './context/IssuesContext';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <IssuesProvider>
        <Dashboard />
      </IssuesProvider>
    </AuthProvider>
  );
}

export default App;
