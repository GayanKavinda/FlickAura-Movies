import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Calendar,
  Eye,
  Heart,
  ChevronDown,
  X,
  SlidersHorizontal,
} from "lucide-react";

const ModernSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromURL = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(queryFromURL);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filters, setFilters] = useState({
    year: "",
    genre: "",
    rating: "",
    includeAdult: false,
  });

  // Movie/TV themed background images
  const backgroundImages = [
    "https://images.unsplash.com/photo-1489599735023-bf207a276e08?w=1920&h=1080&fit=crop&q=80", // Cinema seats
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop&q=80", // Movie theater
    "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1920&h=1080&fit=crop&q=80", // Film reels
    "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1920&h=1080&fit=crop&q=80", // Movie projector
    "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1920&h=1080&fit=crop&q=80", // Hollywood sign
    "https://images.unsplash.com/photo-1489599735023-bf207a276e08?w=1920&h=1080&fit=crop&q=80", // Cinema interior
    "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=1920&h=1080&fit=crop&q=80", // Movie set
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920&h=1080&fit=crop&q=80", // Film strip
    "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=1920&h=1080&fit=crop&q=80", // Movie night
    "https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=1920&h=1080&fit=crop&q=80", // Popcorn and film
  ];

  const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ];

  // Auto-change background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Update search query when URL changes
  useEffect(() => {
    setSearchQuery(queryFromURL);
    setCurrentPage(1); // Reset to first page when search changes
  }, [queryFromURL]);

  const fetchSearchResults = async () => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    try {
      const apiKey = "3be3d6240008ba97e1e073581dadc972";

      const baseUrl = "https://api.themoviedb.org/3/search/movie";
      const params = new URLSearchParams({
        api_key: apiKey,
        query: searchQuery,
        language: "en-US",
        page: currentPage.toString(),
        include_adult: filters.includeAdult ? "true" : "false",
      });

      if (filters.year) params.append("year", filters.year);

      const response = await fetch(`${baseUrl}?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.results) {
        let filteredResults = data.results;

        // Apply genre filter
        if (filters.genre) {
          filteredResults = filteredResults.filter(
            (movie) =>
              movie.genre_ids &&
              movie.genre_ids.includes(parseInt(filters.genre))
          );
        }

        // Apply rating filter
        if (filters.rating) {
          filteredResults = filteredResults.filter(
            (movie) => movie.vote_average >= parseFloat(filters.rating)
          );
        }

        // Apply sorting
        if (sortBy === "rating") {
          filteredResults.sort(
            (a, b) => (b.vote_average || 0) - (a.vote_average || 0)
          );
        } else if (sortBy === "release_date") {
          filteredResults.sort((a, b) => {
            const dateA = new Date(a.release_date || "1900-01-01");
            const dateB = new Date(b.release_date || "1900-01-01");
            return dateB - dateA;
          });
        } else if (sortBy === "title") {
          filteredResults.sort((a, b) =>
            (a.title || "").localeCompare(b.title || "")
          );
        } else {
          filteredResults.sort(
            (a, b) => (b.popularity || 0) - (a.popularity || 0)
          );
        }

        setResults(filteredResults);
        setTotalResults(data.total_results || 0);
      } else {
        setResults([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
      setTotalResults(0);
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [searchQuery, currentPage, filters, sortBy]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      year: "",
      genre: "",
      rating: "",
      includeAdult: false,
    });
    setCurrentPage(1);
  };

  const getGenreName = (genreId) => {
    const genre = genres.find((g) => g.id === genreId);
    return genre ? genre.name : "";
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search");
    if (query && query.trim()) {
      setSearchParams({ q: query.trim() }); // <-- This updates the URL
      setCurrentPage(1);
    }
  };

  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {results.map((movie) => (
        <div
          key={movie.id}
          className="group relative bg-gradient-to-br from-black/70 to-gray-900/70 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30"
        >
          <div className="relative overflow-hidden">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://placehold.co/500x750?text=No+Image"
              }
              alt={movie.title || "Movie poster"}
              className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white text-sm font-medium">
                {(movie.vote_average || 0).toFixed(1)}
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Calendar className="w-4 h-4" />
                <span>
                  {movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1">
              {movie.title || "Unknown Title"}
            </h3>
            <p className="text-gray-300 text-sm line-clamp-2 mb-3">
              {movie.overview || "No description available"}
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {(movie.genre_ids || []).slice(0, 2).map((genreId) => (
                <span
                  key={genreId}
                  className="px-2 py-1 bg-purple-500/30 text-purple-300 rounded-full text-xs"
                >
                  {getGenreName(genreId)}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Eye className="w-4 h-4" />
                <span className="text-sm">Watch</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-4">
      {results.map((movie) => (
        <div
          key={movie.id}
          className="bg-gradient-to-r from-black/70 to-gray-900/70 backdrop-blur-md rounded-2xl border border-gray-700/50 hover:border-purple-500/70 transition-all duration-300 overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row">
            {" "}
            {/* Added flex-col for mobile stacking */}
            <div className="w-full sm:w-32 h-48 flex-shrink-0 relative overflow-hidden">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://placehold.co/500x750?text=No+Image"
                }
                alt={movie.title || "Movie poster"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-4 sm:p-6">
              {" "}
              {/* Adjusted padding for mobile */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-bold text-xl mb-2">
                  {movie.title || "Unknown Title"}
                </h3>
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white font-medium">
                    {(movie.vote_average || 0).toFixed(1)}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 mb-4 line-clamp-3">
                {movie.overview || "No description available"}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                {" "}
                {/* Adjusted for mobile stacking */}
                <div className="flex flex-wrap gap-2 mb-3 sm:mb-0">
                  {" "}
                  {/* Added margin-bottom for mobile */}
                  {(movie.genre_ids || []).slice(0, 3).map((genreId) => (
                    <span
                      key={genreId}
                      className="px-3 py-1 bg-purple-500/30 text-purple-300 rounded-full text-sm"
                    >
                      {getGenreName(genreId)}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>Watch</span>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const CompactView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {" "}
      {/* Changed md to sm for better breakpoint */}
      {results.map((movie) => (
        <div
          key={movie.id}
          className="bg-gradient-to-r from-black/70 to-gray-900/70 backdrop-blur-md rounded-xl border border-gray-700/50 hover:border-purple-500/70 transition-all duration-300 p-4"
        >
          <div className="flex gap-4">
            <div className="w-20 h-28 flex-shrink-0 relative overflow-hidden rounded-lg">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://placehold.co/500x750?text=No+Image"
                }
                alt={movie.title || "Movie poster"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-lg mb-1 truncate">
                {movie.title || "Unknown Title"}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <span>
                  {movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : "N/A"}
                </span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span>{(movie.vote_average || 0).toFixed(1)}</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                {movie.overview || "No description available"}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {" "}
                  {/* Smaller gap for compact view */}
                  {(movie.genre_ids || []).slice(0, 2).map((genreId) => (
                    <span
                      key={genreId}
                      className="px-2 py-1 bg-purple-500/30 text-purple-300 rounded text-xs"
                    >
                      {getGenreName(genreId)}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="p-1 text-gray-400 hover:text-white transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden pb-24">
      {/* Dynamic Background with Fade Effect */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-2000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${image})`,
              transitionDuration: "2s",
            }}
          />
        ))}
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Gradient overlay for cinematic effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="pt-16 bg-black/30 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Search Bar */}
            <div className="mb-6">
              <form onSubmit={handleSearchSubmit} className="w-full sm:max-w-2xl sm:mx-auto"> {/* Changed max-w-2xl mx-auto to be conditional */}
                <div className="relative">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search for movies..."
                    defaultValue={searchQuery}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 backdrop-blur-md border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 sm:gap-0"> {/* Added flex-col and gap for mobile */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center sm:text-left"> {/* Centered on mobile */}
                  Search Results
                </h1>
                <p className="text-gray-300 drop-shadow-md text-center sm:text-left"> {/* Centered on mobile */}
                  {searchQuery
                    ? `Found ${totalResults} movies for "${searchQuery}"`
                    : "Enter a search term to find movies"}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"> {/* Adjusted for mobile stacking */}
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-lg p-1 border border-gray-700/50 w-full justify-center sm:w-auto"> {/* Added w-full and justify-center */}
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === "grid"
                        ? "bg-purple-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === "list"
                        ? "bg-purple-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("compact")}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === "compact"
                        ? "bg-purple-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600/90 hover:bg-purple-700 text-white rounded-lg transition-colors backdrop-blur-sm cursor-pointer w-full sm:w-auto" // Added w-full and justify-center
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="bg-black/50 backdrop-blur-md rounded-xl border border-gray-700/50 p-4 sm:p-6 mb-6"> {/* Adjusted padding */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-lg">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"> {/* Changed md to sm for smaller screens */}
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Year
                    </label>
                    <select
                      value={filters.year}
                      onChange={(e) =>
                        handleFilterChange("year", e.target.value)
                      }
                      className="w-full bg-black/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                    >
                      <option value="">All Years</option>
                      {Array.from(
                        { length: 30 },
                        (_, i) => new Date().getFullYear() - i
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Genre
                    </label>
                    <select
                      value={filters.genre}
                      onChange={(e) =>
                        handleFilterChange("genre", e.target.value)
                      }
                      className="w-full bg-black/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                    >
                      <option value="">All Genres</option>
                      {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Rating
                    </label>
                    <select
                      value={filters.rating}
                      onChange={(e) =>
                        handleFilterChange("rating", e.target.value)
                      }
                      className="w-full bg-black/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                    >
                      <option value="">All Ratings</option>
                      <option value="9">9.0+ Stars</option>
                      <option value="8">8.0+ Stars</option>
                      <option value="7">7.0+ Stars</option>
                      <option value="6">6.0+ Stars</option>
                      <option value="5">5.0+ Stars</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-black/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                    >
                      <option value="popularity">Popularity</option>
                      <option value="rating">Rating</option>
                      <option value="release_date">Release Date</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center min-h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-300 drop-shadow-md">
                  Searching for movies...
                </p>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700/50">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2 drop-shadow-lg">
                No results found
              </h3>
              <p className="text-gray-300 drop-shadow-md">
                Try adjusting your search terms or filters
              </p>
            </div>
          ) : (
            <>
              {viewMode === "grid" && <GridView />}
              {viewMode === "list" && <ListView />}
              {viewMode === "compact" && <CompactView />}

              {/* Pagination */}
              {totalResults > 20 && (
                <div className="flex flex-col sm:flex-row items-center justify-center mt-8 gap-2 sm:gap-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-black/50 hover:bg-black/70 disabled:bg-black/30 disabled:text-gray-500 text-white rounded-lg transition-colors disabled:cursor-not-allowed backdrop-blur-md border border-gray-700/50 cursor-pointer w-full sm:w-auto justify-center" // Added w-full and justify-center
                  >
                    <ChevronDown className="w-4 h-4 rotate-90" />
                    Prev
                  </button>

                  <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-full">
                    {[
                      ...Array(Math.min(5, Math.ceil(totalResults / 20))),
                    ].map((_, index) => {
                      const pageNumber =
                        currentPage <= 3
                          ? index + 1
                          : currentPage - 2 + index;
                      const totalPages = Math.ceil(totalResults / 20);

                      if (pageNumber > totalPages) return null;

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-medium transition-colors backdrop-blur-md border text-sm sm:text-base cursor-pointer flex-shrink-0 ${ // Added flex-shrink-0
                            currentPage === pageNumber
                              ? "bg-purple-600 text-white border-purple-500"
                              : "bg-black/50 hover:bg-black/70 text-gray-300 border-gray-700/50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(Math.ceil(totalResults / 20), prev + 1)
                      )
                    }
                    disabled={currentPage >= Math.ceil(totalResults / 20)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-black/50 hover:bg-black/70 disabled:bg-black/30 disabled:text-gray-500 text-white rounded-lg transition-colors disabled:cursor-not-allowed backdrop-blur-md border border-gray-700/50 cursor-pointer w-full sm:w-auto justify-center" // Added w-full and justify-center
                  >
                    Next
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  </button>
                </div>
              )}

              {/* Results info */}
              <div className="text-center mt-8 text-gray-300 drop-shadow-md">
                <p>
                  Showing {(currentPage - 1) * 20 + 1} -{" "}
                  {Math.min(currentPage * 20, totalResults)} of {totalResults}{" "}
                  results
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Background transition indicators */}
      <div className="fixed bottom-6 right-6 z-20 flex gap-2">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentImageIndex
                ? "bg-purple-500 shadow-lg shadow-purple-500/50"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ModernSearch;