import { Routes, Route, useLocation } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Navbar from "./components/Navbar";

import PopularMovies from "./pages/PopularMovies";
import NowPlaying from "./pages/NowPlaying";
import Upcoming from "./pages/Upcoming";
import TopRated from "./pages/TopRated";
import Genre from "./pages/Genre";
import FilteredByGenre from "./pages/FilteredByGenre";
import TVShows from "./pages/TVShows";
import People from "./pages/People";
import Watchlist from "./pages/Watchlist";
import Search from "./pages/Search";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/Login";
import MovieDetail from './components/MovieDetail';
import Footer from "./pages/Footer";

function App() {
  const location = useLocation();

  // Render extra sections only on these routes (example)
  const noExtraPages = ['/', '/search'];
  const showExtra = !noExtraPages.includes(location.pathname);

  return (
    <>
      {location.pathname !== '/' && <Navbar />}

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/movies" element={<PopularMovies />} />
        <Route path="/genres" element={<Genre />} />
        <Route path="/genres/:genreId" element={<FilteredByGenre />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/search" element={<Search />} />
        {/* add other routes here */}
      </Routes>

      {showExtra && (
        <div className="p-4 bg-gray-900 min-h-screen">
          <NowPlaying />
          <Upcoming />
          <TopRated />
          <Genre />
          <TVShows />
          <People />
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
