import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Home from './Pages/Home';
import Hero from './Pages/Hero';
import Login from './Pages/Login';

export const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:4000';

function RequireAuth({ children }) {
  const token = sessionStorage.getItem('admin_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

const App = () => {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token'));

  const handleLogin = (newToken, adminData) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_name');
    setToken(null);
  };

  return (
    <div>
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home onLogout={handleLogout} />
            </RequireAuth>
          }
        />
        <Route
          path="/hero"
          element={
            <RequireAuth>
              <Hero onLogout={handleLogout} />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
