import React from 'react';
import { Brain, Puzzle as PuzzlePiece, Search, Target } from 'lucide-react';

const featureItems = [
  {
    icon: Brain,
    title: 'Neuron Labeling with AI',
    description: 'Leverages Google Vertex AI to describe what neurons are doing — no more black box!',
    color: '#4DE8ED'
  },
  {
    icon: PuzzlePiece,
    title: 'Concept Clustering',
    description: 'TDA + CAVs automatically group neurons by high-level meaning and patterns.',
    color: '#6C5CE7'
  },
  {
    icon: Search,
    title: 'Semantic Search of Neural Activations',
    description: 'Find clusters using natural language with MongoDB Atlas Vector Search.',
    color: '#C14BEA'
  },
  {
    icon: Target,
    title: 'Bias & Safety Detection',
    description: 'Explore how AI systems encode potentially harmful or unwanted concepts.',
    color: '#FD79A8'
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#4DE8ED] to-[#C14BEA] bg-clip-text text-transparent">
              Powerful
            </span>{' '}
            Features
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            NeuroCartographer provides comprehensive tools to understand and visualize AI behavior.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {featureItems.map((feature, index) => (
            <div 
              key={index}
              className="rounded-xl p-6 transition-transform duration-300 hover:-translate-y-1"
              style={{ 
                backgroundColor: `${feature.color}10`, 
                borderLeft: `3px solid ${feature.color}` 
              }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Interactive Demo Placeholder */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#0D0E23] to-[#150F2E] rounded-xl overflow-hidden border border-[#1E184A]">
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-semibold mb-6">Live Interactive Demo</h3>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  Type a concept to explore matching neuron clusters from a preloaded model.
                </p>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Try: 'racism', 'gender bias', 'financial risk'..."
                    className="flex-1 bg-[#0B0B1A] border border-[#1E184A] rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4DE8ED]"
                  />
                  <button className="bg-gradient-to-r from-[#4DE8ED] to-[#6C5CE7] text-black font-semibold px-6 py-3 rounded-r-lg">
                    Search
                  </button>
                </div>
              </div>
              
              <div className="bg-[#0B0B1A] border border-[#1E184A] rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-[#4DE8ED] font-semibold">Concept: Racism</div>
                  <div className="text-gray-400 text-sm">3 matching clusters found</div>
                </div>
                
                <div className="space-y-4">
                  {/* Cluster Results */}
                  <div className="border border-[#1E184A] rounded-lg p-4 hover:bg-[#1E184A]/20 transition-colors cursor-pointer">
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">Cluster #128: Racial Stereotyping</div>
                      <div className="text-[#FD79A8]">83% match</div>
                    </div>
                    <p className="text-gray-400 text-sm">
                      This cluster activates when processing racial stereotypes and biased language patterns.
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="inline-block px-2 py-0.5 bg-[#FD79A8]/10 text-[#FD79A8] text-xs rounded-full">
                        high activation
                      </span>
                      <span className="inline-block px-2 py-0.5 bg-[#1E184A] text-gray-300 text-xs rounded-full">
                        layers 8-12
                      </span>
                    </div>
                  </div>
                  
                  <div className="border border-[#1E184A] rounded-lg p-4 hover:bg-[#1E184A]/20 transition-colors cursor-pointer">
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">Cluster #257: Group Discrimination</div>
                      <div className="text-[#6C5CE7]">67% match</div>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Neurons that respond to discriminatory language about racial and ethnic groups.
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="inline-block px-2 py-0.5 bg-[#6C5CE7]/10 text-[#6C5CE7] text-xs rounded-full">
                        medium activation
                      </span>
                      <span className="inline-block px-2 py-0.5 bg-[#1E184A] text-gray-300 text-xs rounded-full">
                        layers 4-7
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;