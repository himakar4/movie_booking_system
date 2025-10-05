import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Checkout.css';

const Checkout = ({ user }) => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get selected seats from localStorage
    const seats = JSON.parse(localStorage.getItem('selectedSeats') || '[]');
    if (!seats || seats.length === 0) {
      navigate(`/shows/${showId}/seats`);
      return;
    }
    setSelectedSeats(seats);
    fetchShowDetails();
  }, [showId, navigate]);

  // Fetch show details
  const fetchShowDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/shows/${showId}`);
      if (response.ok) {
        const data = await response.json();
        setShow(data);
      } else {
        setError('Failed to fetch show details');
      }
    } catch (error) {
      console.error('Error fetching show details:', error);
      setError('Error fetching show details');
    } finally {
      setLoading(false);
    }
  };

  // Handle booking API call
  const handleBooking = async () => {
    if (!user) {
      setError('Please login to continue');
      return;
    }

    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    setProcessing(true);
    setError('');

    const seatPrice = show?.price || 150;
    const totalPrice = selectedSeats.length * seatPrice;
    const convenienceFee = Math.round(totalPrice * 0.1);
    const finalTotal = totalPrice + convenienceFee;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user?.id,
          show_id: showId,
          seats: selectedSeats.map(Number), // convert to numbers
          total_amount: finalTotal,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Clear selected seats from localStorage
        localStorage.removeItem('selectedSeats');
        // Redirect to confirmation page
        navigate(`/confirmation/${data.booking_id}`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setError('Error creating booking. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleBackToSeats = () => {
    navigate(`/shows/${showId}/seats`);
  };

  if (loading) {
    return <div className="loading">Loading checkout...</div>;
  }

  if (error && !show) {
    return <div className="error">{error}</div>;
  }

  if (!show) {
    return <div className="error">Show not found</div>;
  }

  const seatPrice = show.price || 150;
  const totalPrice = selectedSeats.length * seatPrice;
  const convenienceFee = Math.round(totalPrice * 0.1);
  const finalTotal = totalPrice + convenienceFee;

  return (
    <div className="checkout">
      <div className="checkout-container">
        <h2>Booking Summary</h2>

        <div className="booking-details">
          <div className="show-details">
            <h3>{show.movie_title}</h3>
            <div className="detail-row">
              <span className="label">Cinema:</span>
              <span className="value">{show.cinema_name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Screen:</span>
              <span className="value">{show.screen_name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Date & Time:</span>
              <span className="value">{new Date(show.show_time).toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <span className="label">Selected Seats:</span>
              <span className="value">{selectedSeats.join(', ')}</span>
            </div>
          </div>

          <div className="price-breakdown">
            <h4>Price Breakdown</h4>
            <div className="price-row">
              <span>Tickets ({selectedSeats.length} × ₹{seatPrice})</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="price-row">
              <span>Convenience Fee</span>
              <span>₹{convenienceFee}</span>
            </div>
            <div className="price-row total">
              <span>Total Amount</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>

          <div className="user-details">
            <h4>Booking For</h4>
            <div className="detail-row">
              <span className="label">Name:</span>
              <span className="value">{user?.name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Email:</span>
              <span className="value">{user?.email}</span>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="checkout-actions">
          <button
            className="back-btn"
            onClick={handleBackToSeats}
            disabled={processing}
          >
            Back to Seats
          </button>
          <button
            className="book-btn"
            onClick={handleBooking}
            disabled={processing}
          >
            {processing ? 'Processing...' : `Pay ₹${finalTotal}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
