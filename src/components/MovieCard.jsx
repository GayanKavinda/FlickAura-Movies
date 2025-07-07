// src/components/MovieCard.jsx
import React from "react";
import { FaStar, FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link

const MovieCard = ({ movie }) => {
  const { id, title, poster_path, vote_average, release_date, overview } = movie;

  return (
    <Link to={`/movies/${id}`} className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-lg group hover:scale-105 transform transition duration-300">
      {/* Poster Image */}
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500${poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image"
        }
        alt={title}
        className="w-full h-80 object-cover"
      />

      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
        <button className="bg-yellow-400 text-black p-2 rounded-full shadow-md hover:bg-yellow-300 transition">
          <FaPlay />
        </button>
      </div>

      {/* Details */}
      <div className="p-3 text-white">
        <h3 className="text-lg font-bold truncate" title={title}>
          {title}
        </h3>
        <div className="text-sm text-gray-300 mb-1">
          {release_date ? release_date.split("-")[0] : "N/A"}
        </div>
        <div className="flex items-center gap-1 text-yellow-400 text-sm mb-2">
          <FaStar className="text-sm" /> {vote_average?.toFixed(1) || "N/A"}
        </div>
        <p className="text-gray-400 text-xs line-clamp-3">
          {overview || "No description available."}
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;