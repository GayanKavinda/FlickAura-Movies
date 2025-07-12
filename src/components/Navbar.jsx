import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Heart,
  Menu,
  X,
  Film,
  Tv,
  Users,
  Star,
  TrendingUp,
  Calendar,
  Play,
  ChevronDown,
  Zap,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      if (isMenuOpen) setIsMenuOpen(false);
    }
  };

  const navItems = [
    { name: "Home", path: "/movies", icon: null },
    {
      name: "Movies",
      icon: Film,
      dropdown: "movies",
      items: [
        { name: "Popular Movies", path: "/movies/popular", icon: TrendingUp },
        { name: "Now Playing", path: "/movies/now-playing", icon: Play },
        { name: "Upcoming", path: "/movies/upcoming", icon: Calendar },
        { name: "Top Rated", path: "/movies/top-rated", icon: Star },
      ],
    },
    {
      name: "TV Shows",
      icon: Tv,
      dropdown: "tv",
      items: [
        { name: "Popular Shows", path: "/tv/popular", icon: TrendingUp },
        { name: "On Air", path: "/tv/now-playing", icon: Play },
        { name: "Top Rated", path: "/tv/top-rated", icon: Star },
      ],
    },
    { name: "People", path: "/people", icon: Users },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 to-purple-600 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  FlickAura
                </span>
                <div className="text-xs text-gray-400 -mt-1">CINEMA HUB</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.dropdown ? (
                    <button
                      onClick={() => toggleDropdown(item.dropdown)}
                      className="flex items-center space-x-2 px-4 py-2 text-white hover:text-cyan-400 transition-colors duration-200 font-medium rounded-xl hover:bg-white/10 group"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          activeDropdown === item.dropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className="flex items-center space-x-2 px-4 py-2 text-white hover:text-cyan-400 transition-colors duration-200 font-medium rounded-xl hover:bg-white/10"
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.name}</span>
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {item.dropdown && activeDropdown === item.dropdown && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-black/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-cyan-500/20 overflow-hidden">
                      <div className="p-2">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 rounded-xl transition-all duration-200 group w-full text-left"
                          >
                            <subItem.icon className="h-4 w-4 text-cyan-400 group-hover:text-cyan-300" />
                            <span>{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Menu Button and Search/Actions - Repositioned */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                {/* Search Bar and Action Buttons (hidden on mobile, shown on md and up) */}
                <div className="hidden md:flex items-center space-x-4">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <div
                      className={`relative transition-all duration-300 ${
                        isSearchFocused ? "scale-105" : ""
                      }`}
                    >
                      <input
                        type="text"
                        placeholder="Search movies, shows..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className="w-64 bg-white/10 backdrop-blur-xl border border-cyan-500/30 rounded-full px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/20 transition-all duration-300"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 group"
                      >
                        <Search className="h-4 w-4 text-white group-hover:scale-110 transition-transform duration-200" />
                      </button>
                    </div>
                  </form>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <Link
                    to="/watchlist"
                    className="p-3 text-white hover:text-pink-400 hover:bg-white/10 rounded-xl transition-all duration-200 group"
                  >
                    <Heart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  </Link>
                  <Link
                    to="/login"
                    className="p-3 text-white hover:text-cyan-400 hover:bg-white/10 rounded-xl transition-all duration-200 group"
                  >
                    <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  </Link>
                </div>
              </div>

              {/* Mobile Menu Button (hidden on lg and up) */}
              <button
                onClick={toggleMenu}
                className="p-2 text-white hover:text-cyan-400 hover:bg-white/10 rounded-xl transition-all duration-200 lg:hidden"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-2xl border-t border-cyan-500/20">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {/* Mobile Search */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search movies, shows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSearchSubmit(e);
                      }
                    }}
                    className="w-full bg-white/10 backdrop-blur-xl border border-cyan-500/30 rounded-full px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/20 transition-all duration-300"
                  />
                  <button
                    onClick={handleSearchSubmit}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full hover:from-cyan-400 hover:to-purple-500 transition-all duration-300"
                  >
                    <Search className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Mobile Navigation Items */}
              {navItems.map((item) => (
                <div key={item.name} className="space-y-1">
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() =>
                          toggleDropdown(`mobile-${item.dropdown}`)
                        }
                        className="flex items-center justify-between w-full px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                      >
                        <span className="flex items-center space-x-3">
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            activeDropdown === `mobile-${item.dropdown}`
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                      {activeDropdown === `mobile-${item.dropdown}` && (
                        <div className="ml-6 space-y-1">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 rounded-xl transition-all duration-200 w-full text-left"
                            >
                              <subItem.icon className="h-4 w-4 text-cyan-400" />
                              <span>{subItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-200 w-full text-left"
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile Action Items */}
              <div className="border-t border-cyan-500/20 pt-4 space-y-2">
                <Link
                  to="/watchlist"
                  className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-200 w-full text-left"
                >
                  <Heart className="h-5 w-5" />
                  <span>My Watchlist</span>
                </Link>
                <Link
                  to="/login"
                  className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-200 w-full text-left"
                >
                  <User className="h-5 w-5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/contact"
                  className="block px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-200 w-full text-left"
                >
                  Contact Us
                </Link>
                <Link
                  to="/about"
                  className="block px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-200 w-full text-left"
                >
                  About
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
