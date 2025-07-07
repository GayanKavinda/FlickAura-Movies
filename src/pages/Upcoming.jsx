import React, { useEffect, useState } from 'react';
import { tmdb } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

const Upcoming = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const response = await tmdb.get('/movie/upcoming');
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching upcoming movies:', error);
      }
    };

    fetchUpcoming();
  }, []);

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h2 className="text-white text-3xl font-bold mb-6">Upcoming Releases</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default Upcoming;