import React, { useState, useEffect } from 'react';
import { Brain, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0B0B1A]/90 backdrop-blur-md py-3 shadow-lg' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2 text-xl font-bold">
          <Brain className="h-8 w-8 text-[#4DE8ED]" />
          <span className="bg-gradient-to-r from-[#4DE8ED] to-[#C14BEA] bg-clip-text text-transparent">
            NeuroCartographer
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8">
          <a href="#how-it-works" className="hover:text-[#4DE8ED] transition-colors">How It Works</a>
          <a href="#features" className="hover:text-[#4DE8ED] transition-colors">Features</a>
          <a href="#demo" className="hover:text-[#4DE8ED] transition-colors">Demo</a>
          <a href="#tech-stack" className="hover:text-[#4DE8ED] transition-colors">Technology</a>
          <Link to="/analyze" className="hover:text-[#4DE8ED] transition-colors">Analyze</Link>

        </nav>

        <div className="hidden md:flex gap-4">
          <a href="#explore" className="px-4 py-2 rounded-lg border border-[#4DE8ED] text-[#4DE8ED] hover:bg-[#4DE8ED]/10 transition-all">
            Explore a Model
          </a>
          <a href="#demo" className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4DE8ED] to-[#C14BEA] hover:opacity-90 transition-opacity">
            Watch Demo
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-[#0B0B1A]/95 backdrop-blur-md transition-all duration-300 ${
          isMenuOpen ? 'max-h-screen py-4' : 'max-h-0 overflow-hidden'
        }`}
      >
        <div className="container mx-auto px-4 flex flex-col gap-4">
          <a href="#how-it-works" className="py-2 hover:text-[#4DE8ED]" onClick={toggleMenu}>How It Works</a>
          <a href="#features" className="py-2 hover:text-[#4DE8ED]" onClick={toggleMenu}>Features</a>
          <a href="#demo" className="py-2 hover:text-[#4DE8ED]" onClick={toggleMenu}>Demo</a>
          <a href="#tech-stack" className="py-2 hover:text-[#4DE8ED]" onClick={toggleMenu}>Technology</a>
          <Link to="/analyze" className="py-2 hover:text-[#4DE8ED]" onClick={toggleMenu}>Analyze</Link>

          <div className="flex flex-col gap-3 pt-3">
            <a href="#explore" className="py-2 text-center rounded-lg border border-[#4DE8ED] text-[#4DE8ED]">
              Explore a Model
            </a>
            <a href="#demo" className="py-2 text-center rounded-lg bg-gradient-to-r from-[#4DE8ED] to-[#C14BEA]">
              Watch Demo
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
