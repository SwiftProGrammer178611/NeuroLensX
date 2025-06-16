import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    quote: "This is like Google Maps for neural networks. It's revolutionized how we understand our models.",
    author: "Dr. Sarah Chen",
    role: "AI Researcher",
    image: "https://images.pexels.com/photos/5905902/pexels-photo-5905902.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    quote: "Finally, a way to see AI bias instead of guessing. We've caught issues we never would have found otherwise.",
    author: "Marcus Johnson",
    role: "ML Engineer",
    image: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    quote: "My team cut debugging time by 50%. We can pinpoint exactly where our model is getting things wrong.",
    author: "Aisha Patel",
    role: "DevOps Lead",
    image: "https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    quote: "When regulators asked us to explain our model, NeuroCartographer gave us the transparency we needed.",
    author: "James Wilson",
    role: "AI Ethics Officer",
    image: "https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=100"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval: number | null = null;
    
    if (isAutoPlaying) {
      interval = window.setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why <span className="bg-gradient-to-r from-[#4DE8ED] to-[#C14BEA] bg-clip-text text-transparent">NeuroCartographer</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Hear from teams already using our platform to transform their AI understanding.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Carousel */}
          <div className="relative overflow-hidden rounded-xl bg-[#0D0E23]/60 backdrop-blur-md border border-[#1E184A]">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#4DE8ED] shrink-0">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <blockquote className="text-xl md:text-2xl italic mb-4">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button 
            className="absolute top-1/2 left-2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-[#0B0B1A]/80 border border-[#1E184A] flex items-center justify-center text-white"
            onClick={handlePrev}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            className="absolute top-1/2 right-2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-[#0B0B1A]/80 border border-[#1E184A] flex items-center justify-center text-white"
            onClick={handleNext}
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          {/* Dots */}
          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-[#4DE8ED] w-6' 
                    : 'bg-[#1E184A]'
                }`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;