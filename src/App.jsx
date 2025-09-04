import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { IssuesProvider } from './context/IssuesContext';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <AuthProvider>
      <IssuesProvider>
         <AppRouter />
      </IssuesProvider>
    </AuthProvider>
  );
}

export default App;
