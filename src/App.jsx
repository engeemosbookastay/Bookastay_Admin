import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Home from './Pages/Home';
import Hero from './Pages/Hero';
import Login from './Pages/Login';

// Prefer an explicit build-time env var. Otherwise use localhost ONLY when the
// app is actually running on localhost — any real domain uses the deployed
// backend, so the hosted admin keeps working even if VITE_API_URL wasn't baked
// into the production build.
const isLocalhost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(window.location.hostname);
export const backendUrl =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  (isLocalhost ? 'http://localhost:4000' : 'https://bookastay-backend-zuwa.onrender.com');

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
