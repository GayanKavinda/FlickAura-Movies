import React from "react";
import {
  Film,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Github,
  Heart,
  Star,
  Calendar,
  TrendingUp,
  Linkedin,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleNavClick = (path) => {
    navigate(path); // Navigate to the specified path
    console.log("Navigate to:", path);
    // In a real app, this would be replaced with router navigation
  };

  const socialUrls = {
    facebook: "https://fb.com/gayan%20kavinda",
    // twitter: "https://twitter.com/your-profile",
    instagram: "https://instagram.com/gayan_kavind",
    linkedin: "https://linkedin.com/in/gayan%20kavinda",
    github: "https://github.com/GayanKavinda",
    portfolio: "https://gayankv-profile.vercel.app/",
  };

  const handleSocialClick = (platform) => {
    const url = socialUrls[platform];
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
    console.log("Open social platform:", platform);
    // In a real app, this would open the social media links
  };

  const handleSubscribe = () => {
    console.log("Subscribe to newsletter");
    // In a real app, this would handle newsletter subscription
  };

  return (
    <footer className="bg-gradient-to-t from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-xl">
                <Film className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                FlickAura
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your ultimate destination for discovering movies, TV shows, and
              entertainment. Explore the world of cinema with comprehensive
              reviews, ratings, and recommendations.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleSocialClick("facebook")}
                className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer"
              >
                <Facebook className="h-5 w-5" />
              </button>
              {/* <button
                onClick={() => handleSocialClick("twitter")}
                className="w-10 h-10 bg-gray-700 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer"
              >
                <Twitter className="h-5 w-5" />
              </button> */}
              <button
                onClick={() => handleSocialClick("instagram")}
                className="w-10 h-10 bg-gray-700 hover:bg-pink-500 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer"
              >
                <Instagram className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleSocialClick("linkedin")}
                className="w-10 h-10 bg-gray-700 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer"
              >
                <Linkedin className="h-5 w-5" />
              </button>
              {/* <button
                onClick={() => handleSocialClick("youtube")}
                className="w-10 h-10 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer"
              >
                <Youtube className="h-5 w-5" />
              </button> */}
              <button
                onClick={() => handleSocialClick("github")}
                className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer"
              >
                <Github className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleSocialClick("portfolio")}
                className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer"
              >
                <Briefcase className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavClick("/movies")}
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Popular Movies</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("/movies/now-playing")}
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
                >
                  <Film className="h-4 w-4" />
                  <span>Now Playing</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("/movies/upcoming")}
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Upcoming Movies</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("/movies/top-rated")}
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
                >
                  <Star className="h-4 w-4" />
                  <span>Top Rated</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("/genres")}
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-200 cursor-pointer"
                >
                  Browse by Genre
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("/people")}
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-200 cursor-pointer"
                >
                  Celebrities
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Support & Info</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavClick("/about")}
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-200 cursor-pointer"
                >
                  About FlickAura
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("/contact")}
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-200 cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("/privacy")}
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-200 cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("/terms")}
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-200 cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("/api")}
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-200 cursor-pointer"
                >
                  API Documentation
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("/help")}
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-200 cursor-pointer"
                >
                  Help Center
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Stay Connected</h3>
            <p className="text-gray-400 text-sm">
              Subscribe to our newsletter for the latest movie news and updates.
            </p>

            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button
                onClick={handleSubscribe}
                className="cursor-pointer w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors duration-200 font-medium"
              >
                Subscribe
              </button>
            </div>

            <div className="space-y-2 mt-6">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span className="text-sm">support@flickaura.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+94 (70) 213-1350</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Yakkala, SL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-gray-400 text-sm">
                © {currentYear} FlickAura. All rights reserved.
              </p>
              <div className="flex items-center space-x-1 text-gray-400">
                <span className="text-sm">Made with</span>
                <Heart className="h-4 w-4 text-pink-500 fill-current" />
                <span className="text-sm">for movie lovers</span>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-gray-400 text-sm">
                Powered by{" "}
                <span className="text-pink-400 font-medium">GAYAN Kav</span>
              </div>
              {/* Powered by <span className="text-pink-400 font-medium">TMDB API</span> */}
              <div className="flex space-x-4">
                <button
                  onClick={() => handleNavClick("/privacy")}
                  className="cursor-pointer text-gray-400 hover:text-pink-400 text-sm transition-colors duration-200"
                >
                  Privacy
                </button>
                <button
                  onClick={() => handleNavClick("/terms")}
                  className="cursor-pointer text-gray-400 hover:text-pink-400 text-sm transition-colors duration-200"
                >
                  Terms
                </button>
                <button
                  onClick={() => handleNavClick("/cookies")}
                  className="cursor-pointer text-gray-400 hover:text-pink-400 text-sm transition-colors duration-200"
                >
                  Cookies
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
