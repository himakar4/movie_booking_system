import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Home from './components/Home';
import MovieDetails from './components/MovieDetails';
import SeatSelection from './components/SeatSelection';
import Checkout from './components/Checkout';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Confirmation from './components/Confirmation';

// Auth Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function AppContent() {
  const { user, logout } = useAuth();

  return (
    <div className="App">
      <Navbar user={user} logout={logout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />

        <Route
          path="/shows/:showId/seats"
          element={
            <ProtectedRoute>
              <SeatSelection user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout/:showId"
          element={
            <ProtectedRoute>
              <Checkout user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/confirmation/:bookingId"
          element={
            <ProtectedRoute>
              <Confirmation user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />

        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
