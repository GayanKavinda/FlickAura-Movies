import React from 'react';

const Watchlist = () => {
  // Placeholder for watchlist data
  const watchlist = []; // Replace with actual watchlist data

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h2 className="text-white text-3xl font-bold mb-6">My Watchlist</h2>
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {watchlist.map((movie) => (
            <div key={movie.id} className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-white">{movie.title}</h3>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-300">Your watchlist is empty.</p>
      )}
    </div>
  );
}

export default Watchlist;