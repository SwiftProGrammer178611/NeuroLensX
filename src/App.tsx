import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Audience from './components/Audience';
import Testimonials from './components/Testimonials';
import TechStack from './components/TechStack';
import BrainAtlas from './components/BrainAtlas';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import AnalyzePage from './components/AnalyzePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-[#0B0B1A] to-[#150F2E] text-white overflow-hidden">
        <Header />
        <Routes>
          <Route path="/" element={
            <main>
              <Hero />
              <HowItWorks />
              <Features />
              <Audience />
              <Testimonials />
              <TechStack />
              <BrainAtlas />
              <CallToAction />
            </main>
          } />
          <Route path="/analyze" element={<AnalyzePage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;