import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaPlay, FaCalendarAlt, FaClock, FaGlobe, FaDollarSign, FaArrowLeft, FaHeart, FaBookmark, FaShare } from 'react-icons/fa';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    // Mock data for demonstration - replace with actual API calls
    const fetchMovieDetails = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock movie data
        const mockMovie = {
          id: id,
          title: "Inception",
          tagline: "Your mind is the scene of the crime",
          overview: "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb's rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive and cost him everything he has ever loved.",
          poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
          backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
          release_date: "2010-07-16",
          runtime: 148,
          vote_average: 8.8,
          vote_count: 35147,
          budget: 160000000,
          revenue: 836836967,
          genres: [
            { id: 28, name: "Action" },
            { id: 878, name: "Science Fiction" },
            { id: 53, name: "Thriller" }
          ],
          production_countries: [
            { name: "United States" },
            { name: "United Kingdom" }
          ],
          spoken_languages: [
            { name: "English" },
            { name: "Japanese" },
            { name: "French" }
          ],
          homepage: "https://www.inceptionmovie.com"
        };

        const mockVideos = [
          {
            id: "1",
            key: "YoHD9XEInc0",
            name: "Official Trailer",
            type: "Trailer",
            site: "YouTube"
          },
          {
            id: "2",
            key: "8hP9D6kZseM",
            name: "Behind the Scenes",
            type: "Behind the Scenes",
            site: "YouTube"
          },
          {
            id: "3",
            key: "Qwe6qIbFOcs",
            name: "Featurette",
            type: "Featurette",
            site: "YouTube"
          }
        ];

        const mockCredits = {
          cast: [
            { id: 1, name: "Leonardo DiCaprio", character: "Dom Cobb", profile_path: "/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg" },
            { id: 2, name: "Marion Cotillard", character: "Mal", profile_path: "/g3HJjj8ZjG2bUmVZjLbHMd8s7Of.jpg" },
            { id: 3, name: "Tom Hardy", character: "Eames", profile_path: "/d81K0RH8UX7tZj49tZaQhZ9ewH.jpg" },
            { id: 4, name: "Elliot Page", character: "Ariadne", profile_path: "/eCeFgzS8dYHnMfWQT0oQitCrsSz.jpg" }
          ],
          crew: [
            { id: 5, name: "Christopher Nolan", job: "Director", profile_path: "/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg" },
            { id: 6, name: "Emma Thomas", job: "Producer", profile_path: null },
            { id: 7, name: "Hans Zimmer", job: "Original Music Composer", profile_path: "/1g2fJu1FpsZxdcAXyFfwqfRjmgN.jpg" }
          ]
        };

        setMovie(mockMovie);
        setVideos(mockVideos);
        setCredits(mockCredits);
        setSelectedVideo(mockVideos[0]); // Set first video as default
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

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

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section with Backdrop */}
      <div 
        className="relative h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(17,24,39,0.8) 70%, rgba(17,24,39,1) 100%), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
        }}
      >
        {/* Navigation */}
        <div className="absolute top-6 left-6 z-10">
          <Link 
            to="/movies/popular" 
            className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-black/70 transition-all duration-300 flex items-center gap-2"
          >
            <FaArrowLeft />
            Back to Movies
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 z-10 flex gap-3">
          <button className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-300">
            <FaHeart />
          </button>
          <button className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-300">
            <FaBookmark />
          </button>
          <button className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-300">
            <FaShare />
          </button>
        </div>

        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 items-end">
              {/* Poster */}
              <div className="flex-shrink-0">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-64 h-96 object-cover rounded-2xl shadow-2xl"
                />
              </div>

              {/* Movie Details */}
              <div className="flex-1 text-white">
                <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
                {movie.tagline && (
                  <p className="text-xl text-yellow-400 italic mb-6">{movie.tagline}</p>
                )}
                
                {/* Rating and Meta Info */}
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold">
                    <FaStar />
                    <span className="text-lg">{movie.vote_average}</span>
                    <span className="text-sm opacity-75">({movie.vote_count.toLocaleString()} votes)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaCalendarAlt />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaClock />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                  <div className="flex gap-2">
                    {movie.genres.map((genre) => (
                      <span 
                        key={genre.id} 
                        className="bg-gray-700/80 px-3 py-1 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Overview */}
                <p className="text-lg leading-relaxed max-w-4xl mb-6 opacity-90">
                  {movie.overview}
                </p>

                {/* Play Button */}
                <button 
                  onClick={() => setSelectedVideo(videos[0])}
                  className="bg-yellow-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FaPlay />
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Videos Section */}
        {videos.length > 0 && (
          <section className="mb-16">
            <h2 className="text-white text-3xl font-bold mb-8">Videos & Trailers</h2>
            
            {/* Main Video Player */}
            {selectedVideo && (
              <div className="mb-8">
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=0&rel=0&modestbranding=1`}
                    title={selectedVideo.name}
                    frameBorder="0"
                    allowFullScreen
                    className="rounded-2xl"
                  ></iframe>
                </div>
                <h3 className="text-white text-xl font-semibold mt-4">{selectedVideo.name}</h3>
              </div>
            )}

            {/* Video Thumbnails */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`relative aspect-video rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                    selectedVideo?.id === video.id ? 'ring-4 ring-yellow-400' : ''
                  }`}
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                    alt={video.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <FaPlay className="text-white text-2xl" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white text-sm font-medium truncate">{video.name}</p>
                    <p className="text-gray-300 text-xs">{video.type}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Movie Stats */}
        <section className="mb-16">
          <h2 className="text-white text-3xl font-bold mb-8">Movie Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <FaDollarSign className="text-yellow-400 text-xl" />
                <h3 className="text-white font-semibold">Budget</h3>
              </div>
              <p className="text-2xl font-bold text-yellow-400">{formatCurrency(movie.budget)}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <FaDollarSign className="text-green-400 text-xl" />
                <h3 className="text-white font-semibold">Revenue</h3>
              </div>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(movie.revenue)}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <FaGlobe className="text-blue-400 text-xl" />
                <h3 className="text-white font-semibold">Countries</h3>
              </div>
              <p className="text-gray-300">{movie.production_countries.map(c => c.name).join(', ')}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <FaGlobe className="text-purple-400 text-xl" />
                <h3 className="text-white font-semibold">Languages</h3>
              </div>
              <p className="text-gray-300">{movie.spoken_languages.map(l => l.name).join(', ')}</p>
            </div>
          </div>
        </section>

        {/* Cast & Crew */}
        <section className="mb-16">
          <h2 className="text-white text-3xl font-bold mb-8">Cast & Crew</h2>
          
          {/* Cast */}
          <div className="mb-12">
            <h3 className="text-white text-2xl font-semibold mb-6">Top Cast</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {credits.cast.slice(0, 12).map((person) => (
                <div key={person.id} className="text-center group">
                  <div className="relative mb-4 overflow-hidden rounded-2xl">
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
                  <h4 className="text-white font-semibold text-sm mb-1">{person.name}</h4>
                  <p className="text-gray-400 text-xs">{person.character}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Crew */}
          <div>
            <h3 className="text-white text-2xl font-semibold mb-6">Key Crew</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {credits.crew.filter(person => ['Director', 'Producer', 'Original Music Composer', 'Director of Photography'].includes(person.job)).map((person) => (
                <div key={`${person.id}-${person.job}`} className="bg-gray-800 p-4 rounded-xl">
                  <h4 className="text-white font-semibold text-sm mb-1">{person.name}</h4>
                  <p className="text-gray-400 text-xs">{person.job}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MovieDetail;