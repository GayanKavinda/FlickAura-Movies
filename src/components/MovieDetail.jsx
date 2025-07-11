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
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  const backdropImageRef = useRef(null);

  // Scroll to top on component mount/ID change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

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
            trigger: videoSectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Parallax effect for backdrop image (only on desktop)
      if (backdropImageRef.current && window.innerWidth > 768) {
        gsap.to(backdropImageRef.current, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-20">
        <div className="text-center px-4">
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-20">
        <div className="text-center px-4">
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
        className="relative min-h-screen md:h-screen overflow-hidden flex items-end pb-6 md:pb-12"
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-gray-900/70 to-gray-900"></div>

        {/* Navigation */}
        <div className="absolute top-24 md:top-28 left-4 md:left-6 z-20">
          <Link
            to="/movies"
            className="bg-black/50 backdrop-blur-sm text-white px-3 py-2 md:px-4 md:py-2 rounded-full hover:bg-black/70 transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
          >
            <FaArrowLeft className="text-xs md:text-sm" />
            <span className="hidden sm:inline">Back to Movies</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-24 md:top-28 right-4 md:right-6 z-20 flex gap-2 md:gap-3">
          <button className="bg-black/50 backdrop-blur-sm text-white p-2 md:p-3 rounded-full hover:bg-black/70 transition-all duration-300 text-sm md:text-lg cursor-pointer">
            <FaHeart />
          </button>
          <button className="bg-black/50 backdrop-blur-sm text-white p-2 md:p-3 rounded-full hover:bg-black/70 transition-all duration-300 text-sm md:text-lg cursor-pointer">
            <FaBookmark />
          </button>
          <button className="bg-black/50 backdrop-blur-sm text-white p-2 md:p-3 rounded-full hover:bg-black/70 transition-all duration-300 text-sm md:text-lg cursor-pointer">
            <FaShare />
          </button>
        </div>

        {/* Movie Info Overlay - Now positioned higher */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10 pt-32 md:pt-20 pb-12">
          {" "}
          {/* Reduced top padding */}
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:items-start">
            {/* Poster - Moved up with everything else */}
            <div className="flex-shrink-0 order-1 lg:order-1 ref={posterRef} flex justify-center cursor-pointer">
              {" "}
              {/* Adjusted margin */}
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-40 h-60 sm:w-48 sm:h-72 md:w-56 md:h-84 lg:w-64 lg:h-96 object-cover rounded-xl md:rounded-2xl shadow-2xl border-2 md:border-4 border-gray-800"
              />
            </div>

            {/* Movie Details - Entire block moved up */}
            <div className="flex-1 text-white text-center lg:text-left order-2 lg:order-2">
              <div className="lg:-mt-[0.1rem]">
                {" "}
                {/* Fine-tuned alignment */}
                <h1
                  ref={titleRef}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 leading-tight"
                >
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p
                    ref={taglineRef}
                    className="text-lg sm:text-xl md:text-2xl text-yellow-400 italic mb-3 md:mb-4 opacity-90"
                  >
                    {movie.tagline}
                  </p>
                )}
              </div>

              {/* All content below moves up together */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 md:gap-4 mb-4 md:mb-6">
                <div className="flex items-center gap-1 md:gap-2 bg-yellow-400 text-black px-2 md:px-4 py-1 md:py-2 rounded-full font-bold text-xs md:text-lg">
                  <FaStar className="text-xs md:text-sm" />
                  <span>{movie.vote_average?.toFixed(1)}</span>
                  <span className="text-xs opacity-75 hidden sm:inline">
                    ({movie.vote_count?.toLocaleString()} votes)
                  </span>
                </div>
                <div className="flex items-center gap-1 md:gap-2 text-gray-300 text-xs md:text-base">
                  <FaCalendarAlt className="text-xs md:text-sm" />
                  <span>
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-1 md:gap-2 text-gray-300 text-xs md:text-base">
                  <FaClock className="text-xs md:text-sm" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4 md:mb-6">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-gray-700/80 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm text-gray-200"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <p
                ref={overviewRef}
                className="text-sm md:text-base lg:text-lg leading-relaxed max-w-4xl mb-4 md:mb-6 opacity-90 mx-auto lg:mx-0"
              >
                {movie.overview || "No overview available."}
              </p>

              {selectedVideo && (
                <button
                  ref={playButtonRef}
                  onClick={() => {
                    /* Logic to open modal or play video directly */
                  }}
                  className="bg-yellow-400 text-black px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-base hover:bg-yellow-300 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto lg:mx-0 cursor-pointer"
                >
                  <FaPlay className="text-sm md:text-md" />
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
          className="w-full bg-gray-800 py-8 md:py-12 px-4 md:px-8 shadow-inner"
          ref={videoSectionRef}
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center md:text-left">
              Featured Trailer
            </h2>
            <div className="mb-6 md:mb-8 bg-gray-900 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-xl">
              <div className="relative aspect-video rounded-lg md:rounded-xl overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=0&rel=0&modestbranding=1`}
                  title={selectedVideo.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg md:rounded-xl"
                ></iframe>
              </div>
              <h3 className="text-white text-lg md:text-xl font-semibold mt-3 md:mt-4">
                {selectedVideo.name}
              </h3>
              <p className="text-gray-400 text-sm">{selectedVideo.type}</p>
            </div>
          </div>
        </section>
      )}

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
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
                    src={`http://img.youtube.com/vi/${video.key}/mqdefault.jpg`} // Corrected YouTube thumbnail URL
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
        <section className="mb-12 md:mb-16" ref={infoSectionRef}>
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-6 md:mb-8 border-b-2 border-gray-700 pb-4">
            Movie Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-gray-800 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg flex flex-col items-start movie-stat-card">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <FaDollarSign className="text-yellow-400 text-lg md:text-xl" />
                <h3 className="text-white font-semibold text-sm md:text-base">
                  Budget
                </h3>
              </div>
              <p className="text-lg md:text-2xl font-bold text-yellow-400">
                {formatCurrency(movie.budget)}
              </p>
            </div>
            <div className="bg-gray-800 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg flex flex-col items-start movie-stat-card">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <FaDollarSign className="text-green-400 text-lg md:text-xl" />
                <h3 className="text-white font-semibold text-sm md:text-base">
                  Revenue
                </h3>
              </div>
              <p className="text-lg md:text-2xl font-bold text-green-400">
                {formatCurrency(movie.revenue)}
              </p>
            </div>
            <div className="bg-gray-800 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg flex flex-col items-start movie-stat-card">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <FaGlobe className="text-blue-400 text-lg md:text-xl" />
                <h3 className="text-white font-semibold text-sm md:text-base">
                  Countries
                </h3>
              </div>
              <p className="text-gray-300 text-sm md:text-lg">
                {movie.production_countries
                  ?.map((c) => c.iso_3166_1)
                  .join(", ") || "N/A"}
              </p>
            </div>
            <div className="bg-gray-800 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg flex flex-col items-start movie-stat-card">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <FaGlobe className="text-purple-400 text-lg md:text-xl" />
                <h3 className="text-white font-semibold text-sm md:text-base">
                  Languages
                </h3>
              </div>
              <p className="text-gray-300 text-sm md:text-lg">
                {movie.spoken_languages
                  ?.map((l) => l.english_name)
                  .join(", ") || "N/A"}
              </p>
            </div>
            {movie.imdb_id && (
              <div className="bg-gray-800 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg flex flex-col items-start movie-stat-card">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <FaImdb className="text-orange-400 text-lg md:text-xl" />
                  <h3 className="text-white font-semibold text-sm md:text-base">
                    IMDb Link
                  </h3>
                </div>
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline text-sm md:text-lg"
                >
                  View on IMDb
                </a>
              </div>
            )}
            {movie.homepage && (
              <div className="bg-gray-800 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg flex flex-col items-start movie-stat-card">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <FaGlobe className="text-teal-400 text-lg md:text-xl" />
                  <h3 className="text-white font-semibold text-sm md:text-base">
                    Homepage
                  </h3>
                </div>
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline text-sm md:text-lg truncate w-full"
                >
                  {movie.homepage.replace(/(^\w+:|^)\/\//, "")}
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Cast & Crew */}
        <section className="mb-12 md:mb-16" ref={castCrewSectionRef}>
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-6 md:mb-8 border-b-2 border-gray-700 pb-4">
            Cast & Crew
          </h2>

          {/* Cast */}
          {credits.cast.length > 0 && (
            <div className="mb-8 md:mb-12">
              <h3 className="text-white text-xl md:text-2xl font-semibold mb-4 md:mb-6">
                Top Cast
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
                {credits.cast.slice(0, 12).map((person) => (
                  <div
                    key={person.id}
                    className="text-center group bg-gray-800 rounded-lg md:rounded-xl p-2 md:p-3 shadow-md cast-crew-item"
                  >
                    <div className="relative mb-2 md:mb-4 overflow-hidden rounded-lg md:rounded-xl">
                      <img
                        src={
                          person.profile_path
                            ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                            : "https://via.placeholder.com/300x450?text=No+Image"
                        }
                        alt={person.name}
                        className="w-full h-32 sm:h-40 md:h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <h4 className="text-white font-semibold text-xs md:text-sm mb-1 truncate">
                      {person.name}
                    </h4>
                    <p className="text-gray-400 text-xs truncate">
                      {person.character}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Crew */}
          {credits.crew.length > 0 && (
            <div>
              <h3 className="text-white text-xl md:text-2xl font-semibold mb-4 md:mb-6">
                Key Crew
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
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
                      className="bg-gray-800 p-3 md:p-4 rounded-lg md:rounded-xl shadow-md cast-crew-item"
                    >
                      <h4 className="text-white font-semibold text-xs md:text-sm mb-1 truncate">
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
