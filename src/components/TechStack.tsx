import React from 'react';
import { CloudCog as CloudComputing, Database, Code, LineChart } from 'lucide-react';

const technologies = [
  {
    icon: CloudComputing,
    title: 'Google Cloud Vertex AI',
    description: 'Powers our concept labeling with state-of-the-art language models.',
    color: '#4DE8ED'
  },
  {
    icon: Database,
    title: 'MongoDB Atlas Vector Search',
    description: 'Enables semantic search across neuron activation patterns.',
    color: '#6C5CE7'
  },
  {
    icon: Code,
    title: 'PyTorch/TensorFlow',
    description: 'Compatible with major deep learning frameworks for model analysis.',
    color: '#C14BEA'
  },
  {
    icon: LineChart,
    title: 'Topological Data Analysis',
    description: 'Advanced mathematical techniques to identify meaningful patterns.',
    color: '#FD79A8'
  }
];

const TechStack = () => {
  return (
    <section id="tech-stack" className="py-20 bg-[#080815]/60">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Technology <span className="bg-gradient-to-r from-[#4DE8ED] to-[#C14BEA] bg-clip-text text-transparent">Stack</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            NeuroCartographer leverages cutting-edge technologies to make AI interpretability possible.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {technologies.map((tech, index) => (
            <div 
              key={index}
              className="rounded-xl p-6 bg-[#0D0E23]/60 border border-[#1E184A] transition-all duration-300 hover:shadow-lg hover:shadow-[#1E184A]/30 text-center"
            >
              <div 
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
                style={{ backgroundColor: `${tech.color}15`, color: tech.color }}
              >
                <tech.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{tech.title}</h3>
              <p className="text-gray-300">{tech.description}</p>
            </div>
          ))}
        </div>

        {/* Architecture Diagram */}
        <div className="mt-16 max-w-4xl mx-auto bg-[#0D0E23]/60 backdrop-blur-md rounded-xl overflow-hidden border border-[#1E184A]">
          <div className="p-6 md:p-8">
            <h3 className="text-2xl font-semibold mb-6 text-center">System Architecture</h3>
            
            <div className="relative bg-[#0B0B1A] border border-[#1E184A] rounded-lg p-6 h-[300px] overflow-hidden">
              {/* Architecture Components */}
              <div className="absolute top-6 left-6 w-[140px] h-[80px] rounded-lg bg-[#4DE8ED]/10 border border-[#4DE8ED]/30 flex flex-col items-center justify-center">
                <div className="text-[#4DE8ED] font-medium">Model Input</div>
                <div className="text-xs text-gray-400">PyTorch/TensorFlow</div>
              </div>
              
              <div className="absolute top-6 right-6 w-[140px] h-[80px] rounded-lg bg-[#C14BEA]/10 border border-[#C14BEA]/30 flex flex-col items-center justify-center">
                <div className="text-[#C14BEA] font-medium">Activation Extraction</div>
                <div className="text-xs text-gray-400">Neuron Fingerprinting</div>
              </div>
              
              <div className="absolute bottom-6 left-6 w-[140px] h-[80px] rounded-lg bg-[#6C5CE7]/10 border border-[#6C5CE7]/30 flex flex-col items-center justify-center">
                <div className="text-[#6C5CE7] font-medium">MongoDB Atlas</div>
                <div className="text-xs text-gray-400">Vector Search</div>
              </div>
              
              <div className="absolute bottom-6 right-6 w-[140px] h-[80px] rounded-lg bg-[#FD79A8]/10 border border-[#FD79A8]/30 flex flex-col items-center justify-center">
                <div className="text-[#FD79A8] font-medium">Google Vertex AI</div>
                <div className="text-xs text-gray-400">Concept Labeling</div>
              </div>
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[160px] h-[90px] rounded-lg bg-gradient-to-br from-[#4DE8ED]/20 to-[#C14BEA]/20 border border-[#4DE8ED]/30 flex flex-col items-center justify-center">
                <div className="text-white font-medium">NeuroCartographer</div>
                <div className="text-xs text-gray-400">Core Engine</div>
              </div>
              
              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="line1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4DE8ED" />
                    <stop offset="100%" stopColor="#C14BEA" />
                  </linearGradient>
                </defs>
                {/* Top Left to Center */}
                <path d="M120,86 L230,150" stroke="url(#line1)" strokeWidth="2" fill="none" />
                
                {/* Top Right to Center */}
                <path d="M280,86 L250,150" stroke="#C14BEA" strokeWidth="2" fill="none" />
                
                {/* Center to Bottom Left */}
                <path d="M180,195 L120,214" stroke="#6C5CE7" strokeWidth="2" fill="none" />
                
                {/* Center to Bottom Right */}
                <path d="M240,195 L280,214" stroke="#FD79A8" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;