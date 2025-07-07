import React, { useEffect, useState } from 'react';
import { tmdb } from '../api/tmdb';
import { useNavigate } from 'react-router-dom';

const Genre = () => {
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate(); // Hook to navigate

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await tmdb.get('/genre/movie/list');
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreClick = (genreId) => {
    navigate(`/genres/${genreId}`); // Navigate to the filtered movies page
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h2 className="text-white text-3xl font-bold mb-6">By Genre</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {genres.map((genre) => (
          <div 
            key={genre.id} 
            className="p-4 bg-gray-800 rounded-lg cursor-pointer" 
            onClick={() => handleGenreClick(genre.id)} // Handle click
          >
            <h3 className="text-white">{genre.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Genre;