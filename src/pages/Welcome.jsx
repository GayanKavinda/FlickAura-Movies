import React, { useState, useEffect } from 'react';

const ModernMovieWelcome = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [glowIntensity, setGlowIntensity] = useState(0);

  const heroMovies = [
    {
      title: "CINEMATIC",
      subtitle: "EXPERIENCE",
      color: "from-red-500 to-orange-500",
      shadow: "shadow-red-500/20"
    },
    {
      title: "IMMERSIVE",
      subtitle: "STORYTELLING",
      color: "from-blue-500 to-cyan-500",
      shadow: "shadow-blue-500/20"
    },
    {
      title: "ENDLESS",
      subtitle: "DISCOVERY",
      color: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/20"
    }
  ];

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 200);
    
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroMovies.length);
    }, 4000);

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
      
      // Create glow effect based on mouse position
      const intensity = Math.sin(Date.now() * 0.001) * 0.5 + 0.5;
      setGlowIntensity(intensity);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(slideInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const currentMovie = heroMovies[currentSlide];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>

      {/* Dynamic Mouse Glow */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, 
            rgba(255, 255, 255, ${glowIntensity * 0.05}) 0%, 
            transparent 50%)`
        }}
      />

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-5 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          >
            <div className="w-32 h-32 border border-white/20 rotate-45 transform hover:rotate-90 transition-transform duration-1000"></div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        
        {/* Logo/Brand */}
        <div className={`transform transition-all duration-1000 ${
          isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}>
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-white to-gray-300 rounded-lg mr-4 flex items-center justify-center">
              <span className="text-black text-2xl font-black">M</span>
            </div>
            <h1 className="text-4xl font-light text-white tracking-wider">
              MOVIEVERSE
            </h1>
          </div>
        </div>

        {/* Dynamic Hero Text */}
        <div className={`text-center mb-12 transform transition-all duration-1000 delay-300 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="relative overflow-hidden h-32 mb-6">
            <div 
              className="absolute inset-0 transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateY(-${currentSlide * 100}%)` }}
            >
              {heroMovies.map((movie, index) => (
                <div key={index} className="h-32 flex flex-col justify-center">
                  <h2 className={`text-7xl md:text-8xl font-black mb-2 bg-gradient-to-r ${movie.color} bg-clip-text text-transparent ${movie.shadow} hover:scale-105 transition-transform duration-300`}>
                    {movie.title}
                  </h2>
                  <h3 className="text-2xl md:text-3xl font-light text-gray-300 tracking-widest">
                    {movie.subtitle}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Step into a world where every frame tells a story. Discover, explore, and experience cinema like never before.
          </p>
        </div>

        {/* CTA Button */}
        <div className={`transform transition-all duration-1000 delay-600 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <button 
            onClick={() => window.location.href = '/movies'}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-black bg-white rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 focus:outline-none focus:ring-4 focus:ring-white/50 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white to-gray-200 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            <span className="relative flex items-center">
              <span className="mr-3">▶</span>
              START EXPLORING
              <span className="ml-3 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </button>
        </div>

        {/* Feature Pills */}
        <div className={`mt-16 flex flex-wrap justify-center gap-4 transform transition-all duration-1000 delay-800 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`}>
          {[
            { icon: '🎬', text: 'Latest Releases' },
            { icon: '⭐', text: 'Top Rated' },
            { icon: '🔥', text: 'Trending Now' },
            { icon: '🎯', text: 'Curated' }
          ].map((feature, index) => (
            <div 
              key={index}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 cursor-default group"
            >
              <span className="mr-2 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </span>
              {feature.text}
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
};

export default ModernMovieWelcome;