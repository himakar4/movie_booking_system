import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Confirmation.css';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get booking data from location state
  const bookingData = location.state;

  useEffect(() => {
    if (!bookingData || !user) {
      navigate('/');
    }
  }, [bookingData, user, navigate]);

  const handleConfirmBooking = async () => {
    if (!bookingData || !user) {
      setError('Missing booking information');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          show_id: bookingData.showId,
          seats: Array.isArray(bookingData.selectedSeats) ? bookingData.selectedSeats : [],
          total_amount: bookingData.totalAmount
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('Booking confirmed successfully!');
        navigate('/profile');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to confirm booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData || !user) {
    return <div>Loading...</div>;
  }

  // Ensure selectedSeats is always an array before using join
  const selectedSeats = Array.isArray(bookingData.selectedSeats) ? bookingData.selectedSeats : [];
  const seatsDisplay = selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected';

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <h2>Booking Confirmation</h2>
        
        <div className="booking-details">
          <h3>Booking Details</h3>
          <div className="detail-row">
            <span className="label">Movie:</span>
            <span className="value">{bookingData.movieTitle || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Cinema:</span>
            <span className="value">{bookingData.cinemaName || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Screen:</span>
            <span className="value">{bookingData.screenName || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Date:</span>
            <span className="value">{bookingData.showDate || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Time:</span>
            <span className="value">{bookingData.showTime || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Selected Seats:</span>
            <span className="value">{seatsDisplay}</span>
          </div>
          <div className="detail-row total">
            <span className="label">Total Amount:</span>
            <span className="value">₹{bookingData.totalAmount || 0}</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="confirmation-actions">
          <button 
            onClick={() => navigate(-1)} 
            className="back-btn"
            disabled={loading}
          >
            Back
          </button>
          <button 
            onClick={handleConfirmBooking} 
            className="confirm-btn"
            disabled={loading}
          >
            {loading ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;