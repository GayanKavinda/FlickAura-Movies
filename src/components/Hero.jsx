import React, { useState, useEffect, useRef, createRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Star,
  Calendar,
  Clock,
  Info,
  Heart,
  Share2,
  Volume2,
  VolumeX,
  Plus,
  Bookmark,
  X,
  Menu,
} from "lucide-react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w300";

const CreativeMovieSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [likedMovies, setLikedMovies] = useState(new Set());
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const transitionRef = useRef(null);
  const autoPlayRef = useRef(null);
  const sidebarObserver = useRef();
  const sidebarRefs = useRef([]);
  const sidebarContainerRef = useRef(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${TMDB_BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`
        );
        const data = await res.json();
        const mapped = data.results.slice(0, 8).map((m) => ({
          id: m.id,
          title: m.title,
          backdrop: m.backdrop_path ? `${IMAGE_BASE_URL}${m.backdrop_path}` : "",
          poster: m.poster_path ? `${POSTER_BASE_URL}${m.poster_path}` : "",
          rating: m.vote_average?.toFixed(1) ?? "N/A",
          year: m.release_date ? m.release_date.slice(0, 4) : "",
          duration: m.runtime
            ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m`
            : "N/A",
          genre: m.genre_ids?.length ? m.genre_ids.join(", ") : "",
          overview: m.overview,
          popularity: m.popularity,
          voteCount: m.vote_count,
        }));
        setMovies(mapped);
        setHasMore(data.page < data.total_pages);
      } catch (error) {
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [page]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSlideChange = (direction) => {
    if (isTransitioning || movies.length === 0) return;

    setIsTransitioning(true);
    setShowDetails(false);
    setShowMobileMenu(false);
    clearTimeout(transitionRef.current);

    if (direction === "next") {
      setCurrentSlide((prev) => (prev + 1) % movies.length);
    } else {
      setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);
    }

    transitionRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, isMobile ? 500 : 800); // Faster transition on mobile
  };

  const goToSlide = (index) => {
    if (isTransitioning || movies.length === 0 || index === currentSlide) return;

    setIsTransitioning(true);
    setShowDetails(false);
    setShowMobileMenu(false);
    clearTimeout(transitionRef.current);
    setCurrentSlide(index);

    transitionRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, isMobile ? 500 : 800);
  };

  const toggleLike = (movieId) => {
    setLikedMovies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(movieId)) {
        newSet.delete(movieId);
      } else {
        newSet.add(movieId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (isAutoPlaying && movies.length > 0 && !isTransitioning && !showDetails && !showMobileMenu) {
      autoPlayRef.current = setTimeout(() => {
        handleSlideChange("next");
      }, isMobile ? 8000 : 6000); // Slower auto-play on mobile
      return () => clearTimeout(autoPlayRef.current);
    }
  }, [isAutoPlaying, currentSlide, movies.length, isTransitioning, showDetails, showMobileMenu, isMobile]);

  useEffect(() => {
    sidebarRefs.current = movies.map((_, i) => sidebarRefs.current[i] || createRef());
  }, [movies]);

  useEffect(() => {
    if (!isMobile && sidebarRefs.current[currentSlide]?.current && sidebarContainerRef.current) {
      const node = sidebarRefs.current[currentSlide].current;
      const container = sidebarContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      const offset = nodeRect.top - containerRect.top - containerRect.height / 2 + nodeRect.height / 2;
      container.scrollBy({ top: offset, behavior: "smooth" });
    }
  }, [currentSlide, isMobile]);

  if (isLoading || movies.length === 0) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <div className="text-white text-xl font-light">Loading cinematic experience...</div>
        </div>
      </div>
    );
  }

  const currentMovie = movies[currentSlide];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black pt-0 pb-0">
      {/* Background with parallax effect - reduced on mobile */}
      <div className="absolute inset-0">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
              style={{
                backgroundImage: `url(${movie.backdrop})`,
                transform: `scale(${index === currentSlide ? (isMobile ? 1.05 : 1.1) : (isMobile ? 1.1 : 1.2)})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50" />
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-900/30 via-transparent to-blue-900/30" />
          </div>
        ))}
      </div>

      {/* Mobile Header */}
      {isMobile && (
        <div className="absolute top-0 left-0 right-0 z-30 px-3 py-1">
          <div className="flex items-center justify-between">
            {/* Auto/Manual Badge */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}></div>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${isAutoPlaying ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"}`}>
                {isAutoPlaying ? "Auto" : "Manual"}
              </span>
            </div>

            {/* Menu Toggle Button */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Side Menu */}
      {isMobile && (
        <div className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-black/95 backdrop-blur-md z-40 transform transition-transform duration-300 ease-in-out ${
          showMobileMenu ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col shadow-2xl`}>
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-lg font-bold">Featured Movies</h3>
              <button 
                onClick={() => setShowMobileMenu(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                onClick={() => {
                  goToSlide(index);
                  setShowMobileMenu(false);
                }}
                className={`group cursor-pointer transition-all duration-200 ${
                  index === currentSlide
                    ? "ring-2 ring-purple-500"
                    : "hover:scale-[1.01] hover:ring-2 hover:ring-white/30"
                }`}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
                  <div className="flex space-x-2 p-2">
                    <div className="relative flex-shrink-0 w-14 h-20">
                      <img
                        src={movie.poster || "https://via.placeholder.com/300x450?text=No+Image"}
                        alt={movie.title}
                        className="w-full h-full object-cover rounded"
                      />
                      {index === currentSlide && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm mb-1 truncate">
                        {movie.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-white/60 mb-1">
                        <span>{movie.year}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>{movie.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-white/50 line-clamp-2">
                        {movie.overview}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black/60 z-35 backdrop-blur-sm"
          onClick={() => setShowMobileMenu(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center px-8 sm:px-6 sm:py-10 py-4">
      <div className="container mx-auto px-6 sm:px-8 lg:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4 md:space-y-6 mt-0 sm:mt-0 px-2 sm:px-0">

              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-purple-300 font-medium">
                  <span className="px-2 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">
                    NOW PLAYING
                  </span>
                  <span className="flex items-center space-x-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                    <span>{currentMovie.rating}</span>
                  </span>
                  <span>{currentMovie.year}</span>
                </div>
                
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {currentMovie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-white/70 text-xs sm:text-sm">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{currentMovie.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{currentMovie.year}</span>
                  </div>
                </div>
                
                <p className="text-sm sm:text-base text-purple-200 font-medium">{currentMovie.genre}</p>
              </div>

              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl">
                {showDetails ? currentMovie.overview : `${currentMovie.overview?.substring(0, isMobile ? 100 : 120) || ""}...`}
                {!showDetails && (
                  <button 
                    onClick={() => setShowDetails(true)}
                    className="ml-1 text-purple-300 hover:text-purple-400 text-sm font-medium"
                  >
                    Read more
                  </button>
                )}
              </p>

              {/* Action Buttons - Stacked on mobile */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-sm sm:text-base">Play Now</span>
                </button>
                
                <div className="flex gap-2 sm:gap-3">
                  <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-3 py-2 sm:px-4 sm:py-3 rounded-full flex items-center space-x-2 transition-all duration-300 border border-white/20 hover:border-white/40"
                  >
                    <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-semibold text-sm">{showDetails ? "Less" : "More"}</span>
                  </button>
                  
                  <button 
                    onClick={() => toggleLike(currentMovie.id)}
                    className={`p-2 sm:p-3 rounded-full transition-all duration-300 ${
                      likedMovies.has(currentMovie.id) 
                        ? "bg-red-500 text-white" 
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    }`}
                    aria-label={likedMovies.has(currentMovie.id) ? "Unlike movie" : "Like movie"}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${likedMovies.has(currentMovie.id) ? "fill-current" : ""}`} />
                  </button>
                  
                  <button className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 border border-white/20">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Additional Details - Simplified on mobile */}
              {showDetails && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 bg-black/30 backdrop-blur-md rounded-lg sm:rounded-xl border border-white/10">
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-bold text-white">{currentMovie.rating}</div>
                    <div className="text-xs text-white/60">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-bold text-white">{Math.round(currentMovie.popularity)}</div>
                    <div className="text-xs text-white/60">Popularity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-bold text-white">{currentMovie.voteCount?.toLocaleString()}</div>
                    <div className="text-xs text-white/60">Votes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-bold text-white">{currentMovie.year}</div>
                    <div className="text-xs text-white/60">Year</div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Desktop Only */}
            {!isMobile && (
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-xl font-bold">Featured Movies</h3>
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide" ref={sidebarContainerRef}>
                  {movies.map((movie, index) => (
                    <div
                      key={movie.id}
                      ref={sidebarRefs.current[index]}
                      onClick={() => goToSlide(index)}
                      className={`group cursor-pointer transition-all duration-300 ${
                        index === currentSlide
                          ? "scale-[1.02] ring-2 ring-purple-500"
                          : "hover:scale-[1.01] hover:ring-2 hover:ring-white/30"
                      }`}
                      onMouseEnter={() => setIsAutoPlaying(false)}
                      onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                      <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
                        <div className="flex space-x-3 p-3">
                          <div className="relative flex-shrink-0 w-14 h-20">
                            <img
                              src={movie.poster || "https://via.placeholder.com/300x450?text=No+Image"}
                              alt={movie.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                            {index === currentSlide && (
                              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white text-sm mb-1 truncate group-hover:text-purple-300 transition-colors">
                              {movie.title}
                            </h4>
                            
                            <div className="flex items-center space-x-2 text-xs text-white/60 mb-1">
                              <span>{movie.year}</span>
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span>{movie.rating}</span>
                              </div>
                            </div>
                            
                            <p className="text-xs text-white/50 leading-relaxed group-hover:text-white/70 transition-colors line-clamp-2">
                              {movie.overview}
                            </p>
                            
                            <div className="mt-1.5 flex items-center justify-between">
                              <span className="text-xs text-purple-300 font-medium">{movie.genre}</span>
                              <div className="flex space-x-1">
                                <button className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200">
                                  <Play className="w-3 h-3" />
                                </button>
                                <button className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200">
                                  <Bookmark className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Controls - Larger touch targets on mobile */}
      <div className="absolute top-1/2 left-4 sm:left-4 lg:left-8 transform -translate-y-1/2 z-20 mb-4">
        <button
          onClick={() => handleSlideChange("prev")}
          className="group bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-2 sm:p-3 rounded-full transition-all duration-300 transform hover:scale-110 border border-white/20"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>

      <div className="absolute top-1/2 right-4 sm:right-4 lg:right-8 transform -translate-y-1/2 z-20">
        <button
          onClick={() => handleSlideChange("next")}
          className="group bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Bottom Progress Indicators - More visible on mobile */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2.5 z-20">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative transition-all duration-300 ${
              index === currentSlide
                ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-gradient-to-r from-purple-500 to-red-500 rounded-full"
                : "w-2 sm:w-3 h-1.5 sm:h-2 bg-white/30 hover:bg-white/50 rounded-full"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide && (
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </div>

      {/* Auto-play indicator - Desktop only */}
      {!isMobile && (
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center space-x-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}></div>
          <span className="text-white text-xs sm:text-sm font-medium">
            {isAutoPlaying ? "Auto" : "Manual"}
          </span>
        </div>
      )}
    </div>
  );
};

export default CreativeMovieSlider;