import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/SeatSelection.css';

const SeatSelection = ({ user }) => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShowDetails();
    fetchBookedSeats();

    // Optional: Poll every 5 seconds for real-time updates
    const interval = setInterval(() => {
      fetchBookedSeats();
    }, 5000);

    return () => clearInterval(interval);
  }, [showId]);

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
    }
  };

  const fetchBookedSeats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/show/${showId}/seats`);
      if (response.ok) {
        const data = await response.json();
        setBookedSeats(data.bookedSeats || []);
      }
    } catch (error) {
      console.error('Error fetching booked seats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return; // Can't select booked seats

    if (selectedSeats.includes(seatNumber)) {
      // Deselect seat
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      // Max 6 seats
      if (selectedSeats.length >= 6) {
        setError('You can select a maximum of 6 seats per booking');
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
      setError(''); // Clear error on successful selection
    }
  };

  const generateSeats = () => {
    if (!show || !show.capacity) return [];
    const seats = [];
    const rows = Math.ceil(show.capacity / 10);
    const seatsPerRow = Math.ceil(show.capacity / rows);
    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatNumber = row * seatsPerRow + seat;
        if (seatNumber <= show.capacity) rowSeats.push(seatNumber);
      }
      seats.push(rowSeats);
    }
    return seats;
  };

  const getSeatClass = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return 'seat booked';
    if (selectedSeats.includes(seatNumber)) return 'seat selected';
    return 'seat available';
  };

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }
    // Save selected seats for checkout
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    navigate(`/checkout/${showId}`);
  };

  if (loading) return <div className="loading">Loading seats...</div>;
  if (error && !show) return <div className="error">{error}</div>;
  if (!show) return <div className="error">Show not found</div>;

  const seatLayout = generateSeats();
  const totalPrice = selectedSeats.length * (show.price || 150);

  return (
    <div className="seat-selection">
      <div className="seat-selection-header">
        <h2>Select Your Seats</h2>
        <div className="show-info">
          <h3>{show.movie_title}</h3>
          <p>{show.cinema_name} - {show.screen_name}</p>
          <p>{new Date(show.show_time).toLocaleString()}</p>
          <p>Price: ₹{show.price || 150} per seat</p>
        </div>
      </div>

      <div className="screen">
        <div className="screen-label">SCREEN</div>
      </div>

      <div className="seat-map">
        {seatLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            <div className="row-label">{String.fromCharCode(65 + rowIndex)}</div>
            {row.map(seatNumber => (
              <button
                key={seatNumber}
                className={getSeatClass(seatNumber)}
                onClick={() => handleSeatClick(seatNumber)}
                disabled={bookedSeats.includes(seatNumber) }
              >
                {seatNumber}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat available"></div><span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat selected"></div><span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="seat booked"></div><span>Booked</span>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="selection-summary">
          <div className="selected-seats">
            <h4>Selected Seats: {selectedSeats.join(', ')}</h4>
            <p>Total: ₹{totalPrice}</p>
          </div>
          <button className="proceed-btn" onClick={handleProceedToCheckout}>
            Proceed to Checkout
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default SeatSelection;
