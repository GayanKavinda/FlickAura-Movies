import React, { useEffect, useState } from 'react';
import { tmdb } from '../api/tmdb'; // Import the tmdb instance
import MovieCard from '../components/MovieCard'; // Import MovieCard to display movies

const NowPlaying = () => {
  const [movies, setMovies] = useState([]); // State to hold the movies

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await tmdb.get('/movie/now_playing'); // Fetch now playing movies
        setMovies(response.data.results); // Set the movies in state
      } catch (error) {
        console.error('Error fetching now playing movies:', error);
      }
    };

    fetchNowPlaying(); // Call the fetch function
  }, []);

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h2 className="text-white text-3xl font-bold mb-6">Now Playing</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} /> // Render MovieCard for each movie
        ))}
      </div>
    </div>
  );
}

export default NowPlaying;