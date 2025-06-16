import React from 'react';
import { Brain, Github, Youtube, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#06060F] border-t border-[#1E184A]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-xl font-bold mb-4">
              <Brain className="h-6 w-6 text-[#4DE8ED]" />
              <span className="bg-gradient-to-r from-[#4DE8ED] to-[#C14BEA] bg-clip-text text-transparent">
                NeuroCartographer
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Map the Mind of AI. Explore the hidden inner workings of neural networks with 
              powerful interpretability tools.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-[#4DE8ED] transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#4DE8ED] transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#4DE8ED] transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#4DE8ED] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-[#4DE8ED] transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#4DE8ED] transition-colors">How It Works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#4DE8ED] transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#4DE8ED] transition-colors">Use Cases</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#4DE8ED] transition-colors">Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-[#4DE8ED] transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#4DE8ED] transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#4DE8ED] transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#4DE8ED] transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#1E184A] mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; 2025 NeuroCartographer. All rights reserved.
          </div>
          
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-[#4DE8ED] transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-[#4DE8ED] transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-[#4DE8ED] transition-colors">Cookie Policy</a>
          </div>
        </div>
        
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <span className="text-xs px-3 py-1 bg-[#0B0B1A] rounded-full text-gray-400">Google Cloud Partner</span>
          <span className="text-xs px-3 py-1 bg-[#0B0B1A] rounded-full text-gray-400">MongoDB Atlas Certified</span>
          <span className="text-xs px-3 py-1 bg-[#0B0B1A] rounded-full text-gray-400">GitLab Partner</span>
          <span className="text-xs px-3 py-1 bg-[#0B0B1A] rounded-full text-gray-400">ISO 27001 Certified</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;