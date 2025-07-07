import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { tmdb } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

const FilteredByGenre = () => {
  const { genreId } = useParams(); // Get genre ID from URL
  const [movies, setMovies] = useState([]);
  const [genreName, setGenreName] = useState('');

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      try {
        const response = await tmdb.get(`/discover/movie`, {
          params: { with_genres: genreId },
        });
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching movies by genre:', error);
      }
    };

    const fetchGenreName = async () => {
      try {
        const response = await tmdb.get(`/genre/movie/list`);
        const genre = response.data.genres.find(g => g.id === parseInt(genreId));
        if (genre) {
          setGenreName(genre.name);
        }
      } catch (error) {
        console.error('Error fetching genre name:', error);
      }
    };

    fetchMoviesByGenre();
    fetchGenreName();
  }, [genreId]);

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h2 className="text-white text-3xl font-bold mb-6">Genre: {genreName}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default FilteredByGenre;