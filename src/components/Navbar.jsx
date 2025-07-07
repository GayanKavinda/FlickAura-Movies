import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Heart, Menu, X, Film, Tv, Users, Star, TrendingUp, Calendar, Play } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Film className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                FlickAura
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-pink-400 transition-colors duration-200 font-medium">
              Home
            </Link>

            {/* Movies Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('movies')}
                className="flex items-center space-x-1 text-white hover:text-pink-400 transition-colors duration-200 font-medium"
              >
                <Film className="h-4 w-4" />
                <span>Movies</span>
                <svg className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'movies' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'movies' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden">
                  <div className="p-2">
                    <Link to="/movies/popular" className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-purple-600/30 rounded-xl transition-colors duration-200">
                      <TrendingUp className="h-4 w-4 text-pink-400" />
                      <span>Popular Movies</span>
                    </Link>
                    <Link to="/movies/now-playing" className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-purple-600/30 rounded-xl transition-colors duration-200">
                      <Play className="h-4 w-4 text-pink-400" />
                      <span>Now Playing</span>
                    </Link>
                    <Link to="/movies/upcoming" className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-purple-600/30 rounded-xl transition-colors duration-200">
                      <Calendar className="h-4 w-4 text-pink-400" />
                      <span>Upcoming</span>
                    </Link>
                    <Link to="/movies/top-rated" className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-purple-600/30 rounded-xl transition-colors duration-200">
                      <Star className="h-4 w-4 text-pink-400" />
                      <span>Top Rated</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* TV Shows Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('tv')}
                className="flex items-center space-x-1 text-white hover:text-pink-400 transition-colors duration-200 font-medium"
              >
                <Tv className="h-4 w-4" />
                <span>TV Shows</span>
                <svg className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'tv' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'tv' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden">
                  <div className="p-2">
                    <Link to="/tv/popular" className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-purple-600/30 rounded-xl transition-colors duration-200">
                      <TrendingUp className="h-4 w-4 text-pink-400" />
                      <span>Popular Shows</span>
                    </Link>
                    <Link to="/tv/now-playing" className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-purple-600/30 rounded-xl transition-colors duration-200">
                      <Play className="h-4 w-4 text-pink-400" />
                      <span>On Air</span>
                    </Link>
                    <Link to="/tv/top-rated" className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-purple-600/30 rounded-xl transition-colors duration-200">
                      <Star className="h-4 w-4 text-pink-400" />
                      <span>Top Rated</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/people" className="flex items-center space-x-1 text-white hover:text-pink-400 transition-colors duration-200 font-medium">
              <Users className="h-4 w-4" />
              <span>People</span>
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Link to="/search" className="p-2 text-white hover:text-pink-400 hover:bg-purple-600/30 rounded-xl transition-all duration-200">
              <Search className="h-5 w-5" />
            </Link>

            {/* Watchlist */}
            <Link to="/watchlist" className="p-2 text-white hover:text-pink-400 hover:bg-purple-600/30 rounded-xl transition-all duration-200">
              <Heart className="h-5 w-5" />
            </Link>

            {/* User Profile */}
            <Link to="/login" className="p-2 text-white hover:text-pink-400 hover:bg-purple-600/30 rounded-xl transition-all duration-200">
              <User className="h-5 w-5" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-white hover:text-pink-400 hover:bg-purple-600/30 rounded-xl transition-all duration-200"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-purple-500/30">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-white hover:bg-purple-600/30 rounded-xl transition-colors duration-200">
              Home
            </Link>
            
            {/* Mobile Movies Section */}
            <div className="space-y-1">
              <button
                onClick={() => toggleDropdown('mobile-movies')}
                className="flex items-center justify-between w-full px-3 py-2 text-white hover:bg-purple-600/30 rounded-xl transition-colors duration-200"
              >
                <span className="flex items-center space-x-2">
                  <Film className="h-4 w-4" />
                  <span>Movies</span>
                </span>
                <svg className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'mobile-movies' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'mobile-movies' && (
                <div className="ml-4 space-y-1">
                  <Link to="/movies/popular" className="block px-3 py-2 text-gray-300 hover:bg-purple-600/30 rounded-xl transition-colors duration-200">
                    Popular Movies
                  </Link>
                  <Link to="/movies/now-playing" className="block px-3 py-2 text-gray-300 hover:bg-purple-600/30 rounded-xl transition-colors duration-200">
                    Now Playing
                  </Link>
                  <Link to="/movies/upcoming" className="block px-3 py-2 text-gray-300 hover:bg-purple-600/30 rounded-xl transition-colors duration-200">
                    Upcoming
                  </Link>
                  <Link to="/movies/top-rated" className="block px-3 py-2 text-gray-300 hover:bg-purple-600/30 rounded-xl transition-colors duration-200">
                    Top Rated
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile TV Shows Section */}
            <div className="space-y-1">
              <button
                onClick={() => toggleDropdown('mobile-tv')}
                className="flex items-center justify-between w-full px-3 py-2 text-white hover:bg-purple-600/30 rounded-xl transition-colors duration-200"
              >
                <span className="flex items-center space-x-2">
                  <Tv className="h-4 w-4" />
                  <span>TV Shows</span>
                </span>
                <svg className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'mobile-tv' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'mobile-tv' && (
                <div className="ml-4 space-y-1">
                  <Link to="/tv/popular" className="block px-3 py-2 text-gray-300 hover:bg-purple-600/30 rounded-xl transition-colors duration-200">
                    Popular Shows
                  </Link>
                  <Link to="/tv/now-playing" className="block px-3 py-2 text-gray-300 hover:bg-purple-600/30 rounded-xl transition-colors duration-200">
                    On Air
                  </Link>
                  <Link to="/tv/top-rated" className="block px-3 py-2 text-gray-300 hover:bg-purple-600/30 rounded-xl transition-colors duration-200">
                    Top Rated
                  </Link>
                </div>
              )}
            </div>

            <Link to="/people" className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-purple-600/30 rounded-xl transition-colors duration-200">
              <Users className="h-4 w-4" />
              <span>People</span>
            </Link>
            
            <Link to="/watchlist" className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-purple-600/30 rounded-xl transition-colors duration-200">
              <Heart className="h-4 w-4" />
              <span>My Watchlist</span>
            </Link>
            
            <Link to="/contact" className="block px-3 py-2 text-white hover:bg-purple-600/30 rounded-xl transition-colors duration-200">
              Contact Us
            </Link>
            
            <Link to="/about" className="block px-3 py-2 text-white hover:bg-purple-600/30 rounded-xl transition-colors duration-200">
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;