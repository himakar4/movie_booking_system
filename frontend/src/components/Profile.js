import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/bookings/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(Array.isArray(data) ? data : (data.bookings && Array.isArray(data.bookings) ? data.bookings : []));
      } else {
        setError('Failed to fetch bookings');
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Error fetching bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="user-info">
        <h2>Welcome, {user?.name}!</h2>
        <p>Email: {user?.email}</p>
      </div>

      <div className="bookings-section">
        <h3>Your Bookings</h3>
        {error && <div className="error-message">{error}</div>}

        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <h4>{booking.movie_title}</h4>
                <p><strong>Cinema:</strong> {booking.cinema_name}</p>
                <p><strong>Screen:</strong> {booking.screen_name}</p>
                <p>
                  <strong>Date:</strong>{" "}
                  {booking.show_time
                    ? new Date(booking.show_time).toLocaleDateString('en-IN', { dateStyle: 'medium' })
                    : 'N/A'}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {booking.show_time
                    ? new Date(booking.show_time).toLocaleTimeString('en-IN', { timeStyle: 'short' })
                    : 'N/A'}
                </p>
                <p><strong>Seats:</strong> {booking.seats.toLocaleString()}</p>
                <p><strong>Total Amount:</strong> ₹{booking.total_amount}</p>
                <p>
                  <strong>Booking Date:</strong>{" "}
                  {booking.booked_at
                    ? new Date(booking.booked_at.replace(' ', 'T')).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                    : 'N/A'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;