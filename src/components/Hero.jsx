import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Star, Calendar, Clock } from 'lucide-react';
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MovieHeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionRef = useRef(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
        );
        const fetchedMovies = response.data.results.slice(0, 5).map(movie => ({
          id: movie.id,
          title: movie.title,
          backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
          poster: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
          rating: movie.vote_average.toFixed(1),
          year: new Date(movie.release_date).getFullYear(),
          duration: "2h 0m",
          genre: "Action, Adventure", // You can enhance this with actual genres
          overview: movie.overview
        }));
        setMovies(fetchedMovies);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchMovies();
  }, []);

  const handleSlideChange = (direction) => {
    if (isTransitioning || movies.length === 0) return;
    
    setIsTransitioning(true);
    clearTimeout(transitionRef.current);

    if (direction === 'next') {
      setCurrentSlide((prev) => (prev + 1) % movies.length);
    } else {
      setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);
    }

    transitionRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 1000); // Match this with your CSS transition duration
  };

  const goToSlide = (index) => {
    if (isTransitioning || movies.length === 0 || index === currentSlide) return;
    
    setIsTransitioning(true);
    clearTimeout(transitionRef.current);
    
    setCurrentSlide(index);
    
    transitionRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && movies.length > 0 && !isTransitioning) {
      const interval = setInterval(() => handleSlideChange('next'), 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, currentSlide, movies.length, isTransitioning]);

  if (isLoading || movies.length === 0) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading movies...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Slides container */}
      <div className="relative w-full h-full">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
              style={{
                backgroundImage: `url(${movie.backdrop})`,
                transform: `scale(${index === currentSlide ? 1.05 : 1})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30"></div>
            </div>

            {/* Content (only visible for current slide) */}
            {index === currentSlide && (
              <div className="relative z-10 flex items-center h-full pt-16">
                <div className="container mx-auto px-6 lg:px-8 flex items-center justify-between">
                  {/* Left Content */}
                  <div className="flex-1 max-w-2xl">
                    <div className="space-y-6 animate-fade-in">
                      <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                        {movie.title}
                      </h1>

                      <div className="flex items-center space-x-6 text-white/80">
                        <div className="flex items-center space-x-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="font-semibold">{movie.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-5 h-5" />
                          <span>{movie.year}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-5 h-5" />
                          <span>{movie.duration}</span>
                        </div>
                      </div>

                      <div className="text-white/60 text-lg">
                        {movie.genre}
                      </div>

                      <p className="text-white/90 text-md leading-relaxed max-w-xl">
                        {movie.overview}
                      </p>

                      <div className="flex space-x-4">
                        <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full flex items-center space-x-2 transition-all duration-300 transform hover:scale-105">
                          <Play className="w-5 h-5" />
                          <span className="font-semibold">Watch Now</span>
                        </button>
                        <button className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-full backdrop-blur-sm transition-all duration-300">
                          <span className="font-semibold">More Info</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Navigation Cards */}
                  <div className="hidden lg:flex flex-col space-y-4 max-w-sm">
                    <h3 className="text-white text-xl font-bold mb-4">Up Next</h3>
                    {movies.map((navMovie, navIndex) => (
                      <div
                        key={navMovie.id}
                        onClick={() => goToSlide(navIndex)}
                        className={`relative cursor-pointer transition-all duration-300 transform ${
                          navIndex === currentSlide 
                            ? 'ring-2 ring-red-500 scale-105' 
                            : 'hover:ring-2 hover:ring-white/50 hover:scale-105'
                        }`}
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                      >
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                          <div className="flex space-x-4">
                            <img
                              src={navMovie.poster}
                              alt={navMovie.title}
                              className="w-16 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1 text-white">
                              <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                                {navMovie.title}
                              </h4>
                              <div className="flex items-center space-x-2 text-xs text-white/70 mb-2">
                                <span>{navMovie.year}</span>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span>{navMovie.rating}</span>
                                </div>
                              </div>
                              <p className="text-xs text-white/60 line-clamp-3">
                                {navMovie.overview}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => handleSlideChange('prev')}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 z-20"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => handleSlideChange('next')}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 z-20"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-red-500 scale-125' 
                : 'bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div 
          className="h-full bg-red-500 transition-all duration-1000 ease-out"
          style={{ 
            width: `${((currentSlide + 1) / movies.length) * 100}%`,
            transition: isTransitioning ? 'width 1s ease-out' : 'none'
          }}
        />
      </div>

      {/* Mobile Navigation Cards */}
      <div className="lg:hidden absolute bottom-20 left-0 right-0 px-6 z-20">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${
                index === currentSlide ? 'scale-105' : ''
              }`}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20 min-w-[200px]">
                <div className="flex space-x-3">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1 text-white">
                    <h4 className="font-semibold text-sm mb-1">{movie.title}</h4>
                    <div className="flex items-center space-x-2 text-xs text-white/70">
                      <span>{movie.year}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{movie.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieHeroSlider;