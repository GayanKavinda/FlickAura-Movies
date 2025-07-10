import React, { useState, useEffect, Suspense, useCallback } from "react";
import Spline from "@splinetool/react-spline";

const ModernMovieWelcome = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const heroMovies = [
    {
      title: "CINEMATIC",
      subtitle: "EXPERIENCE",
      color: "from-red-500 to-orange-500",
      shadow: "shadow-red-500/20",
    },
    {
      title: "IMMERSIVE",
      subtitle: "STORYTELLING",
      color: "from-blue-500 to-cyan-500",
      shadow: "shadow-blue-500/20",
    },
    {
      title: "ENDLESS",
      subtitle: "DISCOVERY",
      color: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/20",
    },
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

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearInterval(slideInterval);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const onSplineLoad = (splineApp) => {
    setSplineLoaded(true);
    // Enable mouse interaction with the Spline scene
    if (splineApp) {
      splineApp.setZoom(1);
    }
  };

  const currentMovie = heroMovies[currentSlide];

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(
        navigator.userAgent
      );
      setIsMobile(isMobileDevice);
    };

    checkMobile();
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Spline 3D Background */}
      <div className="absolute inset-0 z-0" style={{ pointerEvents: "auto" }}>
        <Suspense
          fallback={
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
              <div className="text-white text-xl animate-pulse">
                Loading 3D Scene...
              </div>
            </div>
          }
        >
          {!isMobile ? (
            <Spline
              scene="https://prod.spline.design/0g2plNMYWcepFCAE/scene.splinecode"
              onLoad={onSplineLoad}
              className="w-full h-full"
              style={{
                background: "transparent",
                opacity: splineLoaded ? 0.8 : 0,
                transition: "opacity 1s ease-in-out",
                pointerEvents: "auto",
              }}
            />
          ) : (
            <img
              src="/static/3d-scene-placeholder.webp"
              alt="3D Preview"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          )}
        </Suspense>
      </div>

      {/* Interactive overlay - allows mouse events to pass through to Spline */}
      <div
        className="absolute inset-0 z-5 bg-black/40 backdrop-blur-[1px]"
        style={{ pointerEvents: "none" }}
      />

      {/* Main Content */}
      <div
        className="relative z-30 flex flex-col items-center justify-center min-h-screen px-6"
        style={{ pointerEvents: "none" }}
      >
        {/* Logo/Brand */}
        <div
          className={`transform transition-all duration-1000 ${
            isLoaded ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
          }`}
          style={{ pointerEvents: "auto" }}
        >
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-white to-gray-300 rounded-lg mr-4 flex items-center justify-center shadow-lg shadow-white/20">
              <span className="text-black text-2xl font-black">M</span>
            </div>
            <h1 className="text-4xl font-light text-white tracking-wider drop-shadow-lg">
              MOVIEVERSE
            </h1>
          </div>
        </div>

        {/* Dynamic Hero Text */}
        <div
          className={`text-center mb-12 transform transition-all duration-1000 delay-300 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ pointerEvents: "auto" }}
        >
<div className="relative overflow-hidden min-h-[140px] sm:min-h-[180px] mb-6">
<div
              className="absolute inset-0 transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateY(-${currentSlide * 100}%)` }}
            >
              {heroMovies.map((movie, index) => (
                <div key={index} className="h-32 flex flex-col justify-center">
                  <h2
                    className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-2 bg-gradient-to-r ${movie.color} bg-clip-text text-transparent ${movie.shadow} hover:scale-105 transition-transform duration-300 drop-shadow-2xl`}
                  >
                    {movie.title}
                  </h2>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-light text-gray-200 tracking-widest drop-shadow-lg">
                    {movie.subtitle}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            Step into a world where every frame tells a story. Discover,
            explore, and experience cinema like never before.
          </p>
        </div>

        {/* CTA Button */}
        <div
          className={`transform transition-all duration-1000 delay-600 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ pointerEvents: "auto" }}
        >
          <button
            onClick={() => (window.location.href = "/movies")}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-black bg-white rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/30 focus:outline-none focus:ring-4 focus:ring-white/50 overflow-hidden backdrop-blur-sm"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white to-gray-200 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            <span className="relative flex items-center">
              <span className="mr-3">▶</span>
              START EXPLORING
              <span className="ml-3 transform group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </span>
          </button>
        </div>

        {/* Feature Pills */}
        <div
          className={`mt-16 flex flex-wrap justify-center gap-4 transform transition-all duration-1000 delay-800 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
          style={{ pointerEvents: "auto" }}
        >
          {[
            { icon: "🎬", text: "Latest Releases" },
            { icon: "⭐", text: "Top Rated" },
            { icon: "🔥", text: "Trending Now" },
            { icon: "🎯", text: "Curated" },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-200 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-default group shadow-lg"
            >
              <span className="mr-2 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </span>
              {feature.text}
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2"
          style={{ pointerEvents: "auto" }}
        >
          {heroMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 backdrop-blur-sm ${
                index === currentSlide
                  ? "bg-white w-8 shadow-lg shadow-white/30"
                  : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
  @keyframes grid-move {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(50px, 50px);
    }
  }
`}</style>
    </div>
  );
};

export default ModernMovieWelcome;
