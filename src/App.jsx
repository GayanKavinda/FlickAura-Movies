// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Navbar from "./components/Navbar"; // Ensure this line is present
import Hero from "./components/Hero"
import ParticleCursor from "./components/ParticleCursor"; // Add this import
// Import other components for new routes
import PopularMovies from "./pages/PopularMovies"; // Keep this
import NowPlaying from "./pages/NowPlaying"; // Placeholder
import Upcoming from "./pages/Upcoming"; // Placeholder
import TopRated from "./pages/TopRated"; // Placeholder
import Genre from "./pages/Genre"; // Placeholder
import TVShows from "./pages/TVShows"; // Placeholder
import People from "./pages/People"; // Placeholder
import Watchlist from "./pages/Watchlist"; // Placeholder
import Search from "./pages/Search"; // Placeholder
import Contact from "./pages/Contact"; // Placeholder
import About from "./pages/About"; // Placeholder
import Login from "./pages/Login"; // Placeholder
import MovieDetail from './components/MovieDetail';
import Footer from "./pages/Footer";

function App() {
  const location = useLocation(); // Get the current location

  return (
    <>
      {/* Particle cursor effect */}
      <ParticleCursor />
      
      {/* Only show Navbar if not on the Welcome page */}
      {location.pathname !== '/' && <Navbar />}
      {/* Only show Hero on /movies */}
      {location.pathname === '/movies' && <Hero />}
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/movies" element={<PopularMovies />} />
        <Route path="/genres" element={<Genre />} />
        <Route path="/movies/:id" element={<MovieDetail />} /> {/* New route for movie details */}
        <Route path="/search" element={<Search />} />
      </Routes>

      {/* Only show Footer if not on the Welcome page */}
      {location.pathname === '/movies' && (
        <div className="p-4 bg-gray-900 overflow-hidden">
          <NowPlaying />
          <Upcoming />
          <TopRated />
          {/* <TVShows /> */}
          <People />
          <Footer />
        </div>
      )}
      {location.pathname !== '/' && location.pathname !== '/movies' && (
        <div className="p-4 bg-gray-900">
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;