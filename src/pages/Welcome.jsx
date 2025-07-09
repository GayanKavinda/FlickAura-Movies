import React, { useState, useEffect } from 'react';

const FilmStripMovieSite = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [developingCard, setDevelopingCard] = useState(null);
  const [apertureOpen, setApertureOpen] = useState(false);

  const filmFrames = [
    { id: 1, title: "ACTION", color: "from-red-600 to-red-800", poster: "🎬" },
    { id: 2, title: "DRAMA", color: "from-blue-600 to-blue-800", poster: "🎭" },
    { id: 3, title: "COMEDY", color: "from-yellow-600 to-yellow-800", poster: "😄" },
    { id: 4, title: "HORROR", color: "from-purple-600 to-purple-800", poster: "👻" },
    { id: 5, title: "SCI-FI", color: "from-green-600 to-green-800", poster: "🚀" },
    { id: 6, title: "ROMANCE", color: "from-pink-600 to-pink-800", poster: "💕" }
  ];

  useEffect(() => {
    setIsLoaded(true);
    setApertureOpen(true);
    
    const frameInterval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % filmFrames.length);
    }, 3000);

    return () => clearInterval(frameInterval);
  }, []);

  const handleCardHover = (cardId) => {
    setDevelopingCard(cardId);
  };

  const handleCardLeave = () => {
    setTimeout(() => setDevelopingCard(null), 300);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Film Grain Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="w-full h-full bg-repeat animate-pulse" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
               backgroundSize: '200px 200px'
             }}>
        </div>
      </div>

      {/* Film Strip Border */}
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 flex items-center justify-center">
        <div className="flex space-x-2">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-black rounded-sm"></div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 flex items-center justify-center">
        <div className="flex space-x-2">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-black rounded-sm"></div>
          ))}
        </div>
      </div>

      {/* Camera Aperture Effect */}
      <div className={`fixed inset-0 z-50 pointer-events-none transition-all duration-2000 ${
        apertureOpen ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
      }`}>
        <div className="absolute inset-0 bg-black">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[50vw] border-r-[50vw] border-b-[50vh] border-l-transparent border-r-transparent border-b-black"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[50vw] border-r-[50vw] border-t-[50vh] border-l-transparent border-r-transparent border-t-black"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-16 pb-16">
        
        {/* Header */}
        <div className={`text-center mb-12 transform transition-all duration-1000 ${
          isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}>
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mr-4 animate-pulse">
              <span className="text-black text-2xl">🎞️</span>
            </div>
            <h1 className="text-6xl font-bold text-white tracking-wider" style={{ fontFamily: 'serif' }}>
              REEL<span className="text-yellow-500">CINEMA</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience movies like never before • Frame by frame • Story by story
          </p>
        </div>

        {/* Film Strip Navigation */}
        <div className="relative mb-16 overflow-hidden">
          <div className="flex items-center justify-center">
            <div className="relative">
              {/* Film Strip Background */}
              <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 p-4 rounded-lg shadow-2xl">
                <div className="flex space-x-2 overflow-hidden">
                  {filmFrames.map((frame, index) => (
                    <div
                      key={frame.id}
                      className={`relative w-32 h-48 bg-gradient-to-br ${frame.color} rounded-lg transform transition-all duration-500 cursor-pointer ${
                        index === currentFrame ? 'scale-110 shadow-2xl' : 'scale-95 opacity-70'
                      }`}
                      onClick={() => setCurrentFrame(index)}
                    >
                      {/* Film Frame Holes */}
                      <div className="absolute -left-1 top-4 w-2 h-2 bg-black rounded-full"></div>
                      <div className="absolute -left-1 bottom-4 w-2 h-2 bg-black rounded-full"></div>
                      <div className="absolute -right-1 top-4 w-2 h-2 bg-black rounded-full"></div>
                      <div className="absolute -right-1 bottom-4 w-2 h-2 bg-black rounded-full"></div>
                      
                      {/* Frame Content */}
                      <div className="flex flex-col items-center justify-center h-full text-white">
                        <div className="text-4xl mb-2">{frame.poster}</div>
                        <div className="text-sm font-bold tracking-wider">{frame.title}</div>
                      </div>
                      
                      {/* Active Frame Indicator */}
                      {index === currentFrame && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Film Strip Perforations */}
              <div className="absolute left-0 top-0 h-full w-2 flex flex-col justify-evenly">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-gray-600 rounded-full"></div>
                ))}
              </div>
              <div className="absolute right-0 top-0 h-full w-2 flex flex-col justify-evenly">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-gray-600 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Movie Cards - Polaroid Style */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((card) => (
              <div
                key={card}
                className={`relative bg-white p-4 rounded-lg shadow-xl transform transition-all duration-700 hover:scale-105 hover:rotate-1 cursor-pointer ${
                  developingCard === card ? 'animate-pulse' : ''
                }`}
                onMouseEnter={() => handleCardHover(card)}
                onMouseLeave={handleCardLeave}
                style={{
                  transform: `rotate(${Math.random() * 6 - 3}deg)`,
                  animation: developingCard === card ? 'develop 1s ease-in-out' : 'none'
                }}
              >
                {/* Polaroid Photo */}
                <div className={`w-full h-48 bg-gradient-to-br ${filmFrames[card % filmFrames.length].color} rounded-lg mb-4 flex items-center justify-center text-6xl transform transition-all duration-500 ${
                  developingCard === card ? 'grayscale-0' : 'grayscale'
                }`}>
                  {filmFrames[card % filmFrames.length].poster}
                </div>
                
                {/* Polaroid Caption */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Movie Title {card}</h3>
                  <p className="text-sm text-gray-600">Genre • 2024</p>
                </div>
                
                {/* Developing Effect */}
                {developingCard === card && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg pointer-events-none animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <button 
            onClick={() => window.location.href = '/movies'}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full hover:from-yellow-300 hover:to-yellow-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-yellow-500/25 focus:outline-none focus:ring-4 focus:ring-yellow-500/50"
          >
            <span className="mr-3">🎬</span>
            ENTER THE CINEMA
            <span className="ml-3 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes develop {
          0% { filter: sepia(100%) contrast(150%); }
          50% { filter: sepia(50%) contrast(125%); }
          100% { filter: sepia(0%) contrast(100%); }
        }
      `}</style>
    </div>
  );
};

export default FilmStripMovieSite;