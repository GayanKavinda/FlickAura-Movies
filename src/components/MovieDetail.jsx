import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaStar,
  FaPlay,
  FaCalendarAlt,
  FaClock,
  FaGlobe,
  FaDollarSign,
  FaArrowLeft,
  FaHeart,
  FaBookmark,
  FaShare,
  FaImdb,
} from "react-icons/fa";
import { tmdb } from "../api/tmdb";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Import ScrollTrigger

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Refs for GSAP animations
  const heroRef = useRef(null);
  const posterRef = useRef(null);
  const titleRef = useRef(null);
  const taglineRef = useRef(null);
  const overviewRef = useRef(null);
  const playButtonRef = useRef(null);
  const videoSectionRef = useRef(null);
  const infoSectionRef = useRef(null);
  const castCrewSectionRef = useRef(null);
  const backdropImageRef = useRef(null); // Ref for the backdrop image itself for parallax

  // --- FIX: Scroll to top on component mount/ID change ---
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, [id]); // Rerun when the movie ID changes

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const [movieRes, videosRes, creditsRes] = await Promise.all([
          tmdb.get(`/movie/${id}`),
          tmdb.get(`/movie/${id}/videos`),
          tmdb.get(`/movie/${id}/credits`),
        ]);

        setMovie(movieRes.data);
        setVideos(
          videosRes.data.results.filter((video) => video.site === "YouTube")
        );
        setCredits(creditsRes.data);

        const trailer = videosRes.data.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        setSelectedVideo(
          trailer ||
            videosRes.data.results.find((video) => video.site === "YouTube")
        );
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // GSAP Animations
  useEffect(() => {
    if (!loading && movie) {
      // Clear any existing ScrollTriggers to prevent duplicates on ID change
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());

      // Hero section entrance animation
      gsap.fromTo(
        heroRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.out" }
      );

      gsap.fromTo(
        posterRef.current,
        { y: 100, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)",
          delay: 0.3,
        }
      );

      gsap.fromTo(
        [
          titleRef.current,
          taglineRef.current,
          overviewRef.current,
          playButtonRef.current,
        ],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          delay: 0.5,
        }
      );

      // Section titles fade-in with a slight upward movement
      gsap.fromTo(
        [
          videoSectionRef.current,
          infoSectionRef.current,
          castCrewSectionRef.current,
        ],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.2,
          delay: 1,
          scrollTrigger: {
            trigger: videoSectionRef.current, // Use the first section as trigger
            start: "top 85%", // When the top of the trigger hits 85% of viewport
            toggleActions: "play none none none",
            // markers: true, // For debugging
          },
        }
      );

      // Parallax effect for backdrop image
      if (backdropImageRef.current) {
        gsap.to(backdropImageRef.current, {
          yPercent: 20, // Move background 20% of its height relative to scroll
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true, // Smoothly animate on scroll
          },
        });
      }

      // Advanced effect for movie stats cards
      gsap.from(".movie-stat-card", {
        opacity: 0,
        y: 50,
        scale: 0.9,
        stagger: 0.1,
        duration: 0.6,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: infoSectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      // Advanced effect for cast/crew members
      gsap.from(".cast-crew-item", {
        opacity: 0,
        y: 30,
        stagger: 0.05,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: castCrewSectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }
  }, [loading, movie]);

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-red-500 text-2xl mb-4">Error: {error}</h2>
          <Link to="/" className="text-yellow-400 hover:text-yellow-300">
            <FaArrowLeft className="inline mr-2" />
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl mb-4">Movie not found</h2>
          <Link to="/" className="text-yellow-400 hover:text-yellow-300">
            <FaArrowLeft className="inline mr-2" />
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "https://via.placeholder.com/1920x1080?text=No+Backdrop+Available";

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster+Available";

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      {/* Hero Section with Backdrop */}
      <div
        ref={heroRef}
        className="relative h-screen overflow-hidden flex items-end pb-12"
      >
        {/* Parallax Backdrop Image */}
        <div
          ref={backdropImageRef}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backdropUrl})`,
          }}
        ></div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/70 to-gray-900"></div>

        {/* Navigation - Moved down */}
        <div className="absolute top-20 left-6 z-10"> {/* Adjusted top-6 to top-20 */}
          <Link
            to="/movies/popular"
            className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-black/70 transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
          >
            <FaArrowLeft />
            Back to Movies
          </Link>
        </div>

        {/* Action Buttons - Moved down */}
        <div className="absolute top-20 right-6 z-10 flex gap-3"> {/* Adjusted top-6 to top-20 */}
          <button className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-300 text-lg">
            <FaHeart />
          </button>
          <button className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-300 text-lg">
            <FaBookmark />
          </button>
          <button className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-300 text-lg">
            <FaShare />
          </button>
        </div>

        {/* Movie Info Overlay */}
        <div className="max-w-7xl mx-auto px-8 w-full relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-end">
            {/* Poster */}
            <div className="flex-shrink-0" ref={posterRef}>
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-48 h-72 md:w-64 md:h-96 object-cover rounded-2xl shadow-2xl transform -translate-y-16 lg:translate-y-0 border-4 border-gray-800"
              />
            </div>

            {/* Movie Details */}
            <div className="flex-1 text-white text-center lg:text-left -mt-16 lg:mt-0">
              <h1
                ref={titleRef}
                className="text-4xl md:text-5xl font-bold mb-2 leading-tight"
              >
                {movie.title}
              </h1>
              {movie.tagline && (
                <p
                  ref={taglineRef}
                  className="text-xl md:text-2xl text-yellow-400 italic mb-4 opacity-90"
                >
                  {movie.tagline}
                </p>
              )}

              {/* Rating and Meta Info */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 md:gap-6 mb-6">
                <div className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-sm md:text-lg">
                  <FaStar />
                  <span>{movie.vote_average?.toFixed(1)}</span>
                  <span className="text-xs md:text-sm opacity-75">
                    ({movie.vote_count?.toLocaleString()} votes)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm md:text-base">
                  <FaCalendarAlt />
                  <span>
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm md:text-base">
                  <FaClock />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
                <div className="flex gap-2">
                  {movie.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-gray-700/80 px-3 py-1 rounded-full text-xs md:text-sm text-gray-200"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Overview */}
              <p
                ref={overviewRef}
                className="text-base md:text-lg leading-relaxed max-w-4xl mb-6 opacity-90 mx-auto lg:mx-0"
              >
                {movie.overview || "No overview available."}
              </p>

              {/* Play Button (Reduced Size) */}
              {selectedVideo && (
                <button
                  ref={playButtonRef}
                  onClick={() => {
                    /* Logic to open modal or play video directly */
                  }}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-base hover:bg-yellow-300 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto lg:mx-0"
                >
                  <FaPlay className="text-md" />
                  Watch Trailer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Main Video Player Section */}
      {selectedVideo && (
        <section
          className="w-full bg-gray-800 py-12 px-4 md:px-8 shadow-inner"
          ref={videoSectionRef}
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-white text-3xl font-bold mb-8 text-center md:text-left">
              Featured Trailer
            </h2>
            <div className="mb-8 bg-gray-900 rounded-2xl p-4 shadow-xl">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  // --- IMPORTANT FIX: Correct YouTube URL structure ---
                  src={`http://www.youtube.com/embed/${selectedVideo.key}?autoplay=0&rel=0&modestbranding=1`}
                  title={selectedVideo.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-xl"
                ></iframe>
              </div>
              <h3 className="text-white text-xl font-semibold mt-4">
                {selectedVideo.name}
              </h3>
              <p className="text-gray-400 text-sm">{selectedVideo.type}</p>
            </div>
          </div>
        </section>
      )}

      {/* Content Sections (remaining within max-width) */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Other Videos Section (Thumbnails) */}
        {videos.length > 0 && (
          <section className="mb-16">
            <h2 className="text-white text-3xl font-bold mb-8 border-b-2 border-gray-700 pb-4">
              More Videos & Clips
            </h2>

            {/* Video Thumbnails */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`relative aspect-video rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 group ${
                    selectedVideo?.id === video.id
                      ? "ring-4 ring-yellow-400"
                      : ""
                  }`}
                >
                  <img
                    // --- IMPORTANT FIX: Correct YouTube thumbnail URL structure ---
                    src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                    alt={video.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <FaPlay className="text-white text-3xl" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                    <p className="text-white text-sm font-medium truncate">
                      {video.name}
                    </p>
                    <p className="text-gray-300 text-xs">{video.type}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Movie Stats */}
        <section className="mb-16" ref={infoSectionRef}>
          <h2 className="text-white text-3xl font-bold mb-8 border-b-2 border-gray-700 pb-4">
            Movie Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-start movie-stat-card">
              <div className="flex items-center gap-3 mb-2">
                <FaDollarSign className="text-yellow-400 text-xl" />
                <h3 className="text-white font-semibold">Budget</h3>
              </div>
              <p className="text-2xl font-bold text-yellow-400">
                {formatCurrency(movie.budget)}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-start movie-stat-card">
              <div className="flex items-center gap-3 mb-2">
                <FaDollarSign className="text-green-400 text-xl" />
                <h3 className="text-white font-semibold">Revenue</h3>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(movie.revenue)}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-start movie-stat-card">
              <div className="flex items-center gap-3 mb-2">
                <FaGlobe className="text-blue-400 text-xl" />
                <h3 className="text-white font-semibold">Countries</h3>
              </div>
              <p className="text-gray-300 text-lg">
                {movie.production_countries
                  ?.map((c) => c.iso_3166_1)
                  .join(", ") || "N/A"}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-start movie-stat-card">
              <div className="flex items-center gap-3 mb-2">
                <FaGlobe className="text-purple-400 text-xl" />
                <h3 className="text-white font-semibold">Languages</h3>
              </div>
              <p className="text-gray-300 text-lg">
                {movie.spoken_languages
                  ?.map((l) => l.english_name)
                  .join(", ") || "N/A"}
              </p>
            </div>
            {movie.imdb_id && (
              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-start movie-stat-card">
                <div className="flex items-center gap-3 mb-2">
                  <FaImdb className="text-orange-400 text-xl" />
                  <h3 className="text-white font-semibold">IMDb Link</h3>
                </div>
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline text-lg"
                >
                  View on IMDb
                </a>
              </div>
            )}
            {movie.homepage && (
              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-start movie-stat-card">
                <div className="flex items-center gap-3 mb-2">
                  <FaGlobe className="text-teal-400 text-xl" />
                  <h3 className="text-white font-semibold">Homepage</h3>
                </div>
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline text-lg truncate w-full"
                >
                  {movie.homepage.replace(/(^\w+:|^)\/\//, "")}
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Cast & Crew */}
        <section className="mb-16" ref={castCrewSectionRef}>
          <h2 className="text-white text-3xl font-bold mb-8 border-b-2 border-gray-700 pb-4">
            Cast & Crew
          </h2>

          {/* Cast */}
          {credits.cast.length > 0 && (
            <div className="mb-12">
              <h3 className="text-white text-2xl font-semibold mb-6">
                Top Cast
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {credits.cast.slice(0, 12).map((person) => (
                  <div
                    key={person.id}
                    className="text-center group bg-gray-800 rounded-xl p-3 shadow-md cast-crew-item"
                  >
                    <div className="relative mb-4 overflow-hidden rounded-xl">
                      <img
                        src={
                          person.profile_path
                            ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                            : "https://via.placeholder.com/300x450?text=No+Image"
                        }
                        alt={person.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1 truncate">
                      {person.name}
                    </h4>
                    <p className="text-gray-400 text-xs">{person.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Crew */}
          {credits.crew.length > 0 && (
            <div>
              <h3 className="text-white text-2xl font-semibold mb-6">
                Key Crew
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {credits.crew
                  .filter((person) =>
                    [
                      "Director",
                      "Producer",
                      "Original Music Composer",
                      "Director of Photography",
                      "Screenplay",
                    ].includes(person.job)
                  )
                  .map((person) => (
                    <div
                      key={`${person.id}-${person.job}`}
                      className="bg-gray-800 p-4 rounded-xl shadow-md cast-crew-item"
                    >
                      <h4 className="text-white font-semibold text-sm mb-1 truncate">
                        {person.name}
                      </h4>
                      <p className="text-gray-400 text-xs">{person.job}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MovieDetail;