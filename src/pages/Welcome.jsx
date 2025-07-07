import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
    
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    const createParticle = () => {
      const id = Math.random();
      const newParticle = {
        id,
        left: Math.random() * 100,
        animationDelay: Math.random() * 6,
        animationDuration: 4 + Math.random() * 4
      };
      
      setParticles(prev => [...prev, newParticle]);
      
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== id));
      }, (newParticle.animationDuration + 2) * 1000);
    };

    for (let i = 0; i < 15; i++) {
      setTimeout(createParticle, i * 200);
    }

    const particleInterval = setInterval(createParticle, 500);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(particleInterval);
    };
  }, []);

  const handleButtonClick = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.className = 'absolute bg-yellow-300 opacity-25 rounded-full animate-ping pointer-events-none';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.4); }
          50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.3); }
        }
        
        @keyframes particle-float {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        
        .float-animation { animation: float 3s ease-in-out infinite; }
        .glow-animation { animation: glow-pulse 2s ease-in-out infinite; }
        .particle { animation: particle-float 6s infinite linear; }
        
        .bg-grid {
          background-image: 
            linear-gradient(rgba(251, 191, 36, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 191, 36, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
      
      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 bg-grid">
        
        {/* Animated Background Gradient */}
        <div 
          className="absolute inset-0 opacity-20 transition-all duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(251, 191, 36, 0.2) 0%, transparent 70%)`
          }}
        />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="particle absolute w-2 h-2 bg-yellow-400 opacity-20 rounded-full pointer-events-none"
              style={{
                left: `${particle.left}%`,
                animationDelay: `${particle.animationDelay}s`,
                animationDuration: `${particle.animationDuration}s`
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className={`relative z-10 text-center transform transition-all duration-1000 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          
          {/* Movie Icon with Glow Effect */}
          <div className="mb-8 relative">
            <div className="text-8xl filter drop-shadow-2xl float-animation">🎬</div>
            <div className="absolute inset-0 text-8xl blur-xl opacity-50 animate-pulse text-yellow-400">🎬</div>
          </div>

          {/* Title with Gradient Text */}
          <h1 className={`text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent transform transition-all duration-1000 delay-300 ${
            isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}>
            FlickAura
          </h1>
          
          <h2 className={`text-3xl md:text-4xl font-bold text-yellow-100 mb-4 transform transition-all duration-1000 delay-500 ${
            isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
          }`}>
            Movies
          </h2>

          {/* Subtitle */}
          <p className={`text-xl text-gray-300 mb-12 max-w-md mx-auto leading-relaxed transform transition-all duration-1000 delay-700 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            Discover cinematic masterpieces and explore the world of entertainment
          </p>

          {/* CTA Button */}
          <div className={`transform transition-all duration-1000 delay-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Link 
              to="/movies"
              onClick={handleButtonClick}
              className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-black transition-all duration-300 ease-out bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full hover:from-yellow-300 hover:to-orange-400 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 overflow-hidden glow-animation"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center">
                <span className="mr-2">🎭</span>
                Explore Movies
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </Link>
          </div>

          {/* Feature Tags */}
          <div className={`mt-12 flex flex-wrap justify-center gap-4 transform transition-all duration-1000 delay-1200 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            {['Popular', 'Trending', 'Reviews', 'Favorites'].map((tag) => (
              <span 
                key={tag}
                className="px-4 py-2 text-sm font-medium text-yellow-200 bg-yellow-400/10 backdrop-blur-sm rounded-full border border-yellow-400/30 hover:bg-yellow-400/20 hover:scale-105 transition-all duration-300 cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
    </>
  );
};

export default Welcome;