import React, { useEffect, useRef } from 'react';
import { Play, Braces } from 'lucide-react';

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Neural network animation
    let particles: {x: number, y: number, size: number, speedX: number, speedY: number}[] = [];
    const particleCount = 100;
    const maxDistance = 150;
    const connectionOpacity = 0.15;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = '#4DE8ED';
        ctx.fill();
        
        // Connect particles
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(77, 232, 237, ${connectionOpacity * (1 - distance / maxDistance)})`;
            ctx.stroke();
          }
        });
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center pt-16 overflow-hidden">
      {/* Background Animation */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 opacity-30"
      />
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center relative">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-[#4DE8ED] to-[#C14BEA] bg-clip-text text-transparent">
            Map the Mind of AI
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Explore the hidden inner workings of neural networks with powerful interpretability tools — 
          and unlock transparency like never before.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a 
            href="#explore" 
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#4DE8ED] to-[#4DE8ED]/70 text-black font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Braces className="h-5 w-5" />
            Explore a Model
          </a>
          <a 
            href="#demo" 
            className="px-8 py-3 rounded-lg border border-[#C14BEA] hover:bg-[#C14BEA]/10 transition-all flex items-center justify-center gap-2"
          >
            <Play className="h-5 w-5" />
            Watch Demo
          </a>
        </div>
        
        <div className="max-w-2xl mx-auto bg-[#0D0E23]/60 backdrop-blur-md p-6 rounded-xl border border-[#1E184A]">
          <p className="text-gray-300 mb-3">
            NeuroCartographer is an AI interpretability platform that turns complex neural activations into 
            clear, labeled concept maps. It uses advanced techniques to reveal what concepts live where 
            in an AI model's "brain."
          </p>
          <div className="flex justify-center gap-3">
            <span className="inline-block px-3 py-1 bg-[#4DE8ED]/10 text-[#4DE8ED] text-sm rounded-full">Topological Data Analysis</span>
            <span className="inline-block px-3 py-1 bg-[#C14BEA]/10 text-[#C14BEA] text-sm rounded-full">Concept Activation Vectors</span>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-[#4DE8ED] flex justify-center">
          <div className="w-1 h-3 bg-[#4DE8ED] rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;