import React from 'react';
import { Brain, ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-20 bg-[#080815]/60">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#0D0E23] to-[#150F2E] rounded-xl overflow-hidden border border-[#1E184A] relative">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#4DE8ED]/20 to-[#C14BEA]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#6C5CE7]/10 to-[#FD79A8]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          {/* Content */}
          <div className="p-8 md:p-12 relative z-10">
            <div className="text-center mb-10">
              <div className="inline-block mb-4">
                <Brain className="w-14 h-14 text-[#4DE8ED] mx-auto" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to explore the mind of your AI?
              </h2>
              
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Upload your model and discover what it's really thinking. 
                Start mapping neural concepts today.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-xl mx-auto">
              <a 
                href="#" 
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-[#4DE8ED] to-[#6C5CE7] text-black font-semibold text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </a>
              
              <a 
                href="#" 
                className="px-8 py-4 rounded-lg border border-[#C14BEA] hover:bg-[#C14BEA]/10 transition-all text-center"
              >
                Book a Demo
              </a>
            </div>
            
            {/* Testimonial Quote */}
            <div className="mt-12 text-center">
              <blockquote className="text-xl italic text-gray-300">
                "Finally, a window into the black box of AI."
              </blockquote>
              <div className="mt-2 text-[#4DE8ED]">— AI Transparency Journal</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;