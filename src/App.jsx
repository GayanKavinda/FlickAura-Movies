import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ParticleCursor from "./components/ParticleCursor";
import MovieDetail from "./components/MovieDetail";
import Welcome from "./pages/Welcome";
import PopularMovies from "./pages/PopularMovies";
import NowPlaying from "./pages/NowPlaying";
import Upcoming from "./pages/Upcoming";
import TopRated from "./pages/TopRated";
import Genre from "./pages/Genre";
import TVShows from "./pages/TVShows";
import People from "./pages/People";
import Watchlist from "./pages/Watchlist";
import Search from "./pages/Search";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Footer from "./pages/Footer";

function App() {
  const location = useLocation(); // Get the current location

  return (
    <>
      {/* Particle cursor effect */}
      <ParticleCursor />

      {/* Only show Navbar if not on the Welcome page */}
      {location.pathname !== "/" && <Navbar />}
      {/* Only show Hero on /movies */}
      {location.pathname === "/movies" && <Hero />}
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/movies" element={<PopularMovies />} />
        <Route path="/genres" element={<Genre />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/contact" element={<Contact />} /> {/* Add Contact route */}
        <Route path="/about" element={<About />} /> {/* Add About route */}
      </Routes>

      {/* Only show Footer if not on the Welcome page */}
      {location.pathname === "/movies" && (
        <div className="p-4 bg-gray-900 overflow-hidden">
          <NowPlaying />
          <Upcoming />
          <TopRated />
          <People />
          <Footer />
        </div>
      )}
      {location.pathname !== "/" && location.pathname !== "/movies" && (
        <div className="p-4 bg-gray-900">
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;