import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const handleDateSelect = (date) => {
  const normalizedDate = new Date(date).toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
  console.log("Clicked Date:", normalizedDate);
  setSelectedDate(normalizedDate);
};


  useEffect(() => {
    // Fetch movie details
    fetch(`http://localhost:5000/api/movies/${id}`)
      .then(res => res.json())
      .then(data => {
        setMovie(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching movie details:', err);
        setLoading(false);
      });

    // Fetch shows for this movie
    fetch(`http://localhost:5000/api/shows/movie/${id}`)
      .then(res => res.json())
      .then(data => {
        // Ensure shows is always an array
        setShows(Array.isArray(data) ? data : (data.shows || []));
      })
      .catch(err => {
        console.error('Error fetching shows:', err);
      });
  }, [id]);

  // Group shows by cinema and date
 const groupedShows = shows.reduce((acc, show) => {
  const cinemaName = show.cinema_name;

  // ✅ Use local date (not UTC)
  const showDate = new Date(show.show_time).toLocaleDateString('en-CA');

  console.log("Show ID:", show.id, "| Show Date:", showDate, "| Selected Date:", selectedDate);

  if (showDate !== selectedDate) return acc;

  if (!acc[cinemaName]) {
    acc[cinemaName] = {
      cinema_name: cinemaName,
      shows: []
    };
  }

  acc[cinemaName].shows.push(show);
  return acc;
}, {});

  

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!movie) {
    return <div className="error">Movie not found</div>;
  }

  // Generate dates for the next 7 days
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push({
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayOfMonth: date.getDate()
    });
  }

  return (
    <div className="movie-details-container">
      <div className="movie-banner" style={{ backgroundImage: `url(${movie.banner_url || 'https://via.placeholder.com/1200x400?text=Movie+Banner'})` }}>
        <div className="movie-banner-content">
          <div className="movie-poster">
            <img src={`/${movie.poster}` || 'https://via.placeholder.com/300x450?text=Movie+Poster'} alt={movie.title} />
          </div>
          <div className="movie-info">
            <h1>{movie.title}</h1>
            <div className="movie-meta">
              <span>{movie.certificate}</span>
              <span>{movie.duration} min</span>
              <span>{movie.language}</span>
              <span>{movie.genre}</span>
              <span>{new Date(movie.release_date).toLocaleDateString()}</span>
            </div>
            <p className="movie-description">{movie.description}</p>
          </div>
        </div>
      </div>

      <div className="show-dates">
        {dates.map(date => (
          <div
            key={date.date}
            className={`date-item ${selectedDate === date.date ? 'active' : ''}`}
            onClick={() => handleDateSelect(date.date)}   // use function
          >
            <div className="day">{date.day}</div>
            <div className="date">{date.dayOfMonth}</div>
          </div>
        ))}
      </div>

      <div className="shows-container">
        {Object.values(groupedShows).length > 0 ? (
          Object.values(groupedShows).map((cinema, index) => (
            <div key={index} className="cinema-shows">
              <div className="cinema-name">
                <h3>{cinema.cinema_name}</h3> 
              </div>
              <div className="show-times">
                {cinema.shows.map(show => (
                  <Link
                    key={show.id}
                    to={`/shows/${show.id}/seats`}
                    className="show-time"
                  >
                    {new Date(show.show_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {/* updated */}
                  </Link>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="no-shows">No shows available for this date</div>
        )}
      </div>

    </div>
  );
};

export default MovieDetails;