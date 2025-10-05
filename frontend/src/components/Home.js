import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch movies
    fetch('http://localhost:5000/api/movies')
      .then(res => res.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching movies:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
    <div className="home-container">
      {/* Movies Section */}
      <div className="movies-section">
        <h2>🎬 Movies Now Showing</h2>
        <div className="movies-grid">
          {movies.map(movie => (
            <div key={movie.id} className="movie-card">
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={
                    movie.poster
                      ? `/${movie.poster}`
                      : 'https://via.placeholder.com/240x360?text=Movie+Poster'
                  }
                  alt={movie.title}
                />
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.genre}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      
      
    </div>
    <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <h3>🎥 Chaos Cinemas</h3>
            <p>Your go-to platform for booking the latest movies with ease.</p>
          </div>

          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/movies">Movies</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-right">
            <p>&copy; {new Date().getFullYear()} Chaos. All Rights Reserved.</p>
            <p>Made with ❤️ by Chaos Team</p>
          </div>
        </div>
      </footer>
      </>
  );
};

export default Home;
