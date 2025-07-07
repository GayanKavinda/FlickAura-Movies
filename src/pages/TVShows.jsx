import React, { useEffect, useState } from 'react';
import { tmdb } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

const TVShows = () => {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        const response = await tmdb.get('/tv/popular');
        setShows(response.data.results);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      }
    };

    fetchTVShows();
  }, []);

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h2 className="text-white text-3xl font-bold mb-6">TV Shows</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {shows.map((show) => (
          <MovieCard key={show.id} movie={show} />
        ))}
      </div>
    </div>
  );
}

export default TVShows;