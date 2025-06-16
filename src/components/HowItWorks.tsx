import React from 'react';
import { Upload, Network, Tag, Search, BarChart3 } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Upload Your AI Model',
    description: 'Upload a PyTorch or TensorFlow model. The system extracts and indexes neuron activations, storing clusters in MongoDB Vector Search.',
    icon: Upload,
    accent: '#4DE8ED',
  },
  {
    id: 2,
    title: 'Cluster & Analyze Neurons',
    description: 'Uses Topological Data Analysis (TDA) to group neurons into meaningful clusters, compressing each into an "activation fingerprint."',
    icon: Network,
    accent: '#6C5CE7',
  },
  {
    id: 3,
    title: 'Label Concepts with AI',
    description: 'We send activation clusters to Google Vertex AI to generate human-readable descriptions for what each cluster "means."',
    icon: Tag,
    accent: '#C14BEA',
  },
  {
    id: 4,
    title: 'Ask Natural Language Questions',
    description: 'Type queries like "Which neurons are biased toward gender?" and NeuroCartographer retrieves the most semantically similar neuron clusters.',
    icon: Search,
    accent: '#E84393',
  },
  {
    id: 5,
    title: 'Visualize and Intervene',
    description: 'PCA plots, heatmaps, and neuron traces let users see activation patterns and disable, edit, or retrain problematic regions.',
    icon: BarChart3,
    accent: '#FD79A8',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-[#080815]/60">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="bg-gradient-to-r from-[#4DE8ED] to-[#C14BEA] bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            NeuroCartographer follows a systematic approach to reveal and map the inner workings of AI models.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="relative mb-16 last:mb-0">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div 
                  className="absolute left-6 top-16 bottom-0 w-0.5 hidden md:block" 
                  style={{ background: `linear-gradient(to bottom, ${step.accent}, ${steps[index + 1].accent})` }}
                ></div>
              )}
              
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Icon Circle */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10"
                  style={{ backgroundColor: `${step.accent}15`, borderColor: step.accent }}
                >
                  <step.icon className="w-6 h-6" style={{ color: step.accent }} />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div 
                    className="p-6 rounded-xl backdrop-blur-sm"
                    style={{ backgroundColor: `${step.accent}10`, borderColor: `${step.accent}30` }}
                  >
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <span 
                        className="w-6 h-6 rounded-full text-sm flex items-center justify-center"
                        style={{ backgroundColor: step.accent }}
                      >
                        {step.id}
                      </span>
                      {step.title}
                    </h3>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Example */}
        <div className="mt-20 max-w-4xl mx-auto bg-[#0D0E23]/60 backdrop-blur-md rounded-xl overflow-hidden border border-[#1E184A]">
          <div className="bg-[#0F0F2B] p-4 border-b border-[#1E184A]">
            <h4 className="text-[#4DE8ED] font-mono">// Example: Neuron Activation Map</h4>
          </div>
          <div className="p-6 overflow-x-auto">
            <div className="min-w-[700px] h-[300px] bg-gradient-to-br from-[#0B0B1A] to-[#150F2E] rounded-lg border border-[#1E184A] flex items-center justify-center relative">
              {/* Simulated Neural Network Visualization */}
              <div className="absolute inset-0 flex items-center justify-center opacity-60">
                {Array(20).fill(0).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: i % 3 === 0 ? '#4DE8ED' : i % 3 === 1 ? '#6C5CE7' : '#C14BEA',
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      boxShadow: i % 3 === 0 
                        ? '0 0 15px #4DE8ED' 
                        : i % 3 === 1 
                          ? '0 0 15px #6C5CE7' 
                          : '0 0 15px #C14BEA'
                    }}
                  ></div>
                ))}
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4DE8ED" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#C14BEA" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  {Array(30).fill(0).map((_, i) => {
                    const x1 = Math.random() * 100;
                    const y1 = Math.random() * 100;
                    const x2 = Math.random() * 100;
                    const y2 = Math.random() * 100;
                    return (
                      <line 
                        key={i}
                        x1={`${x1}%`} 
                        y1={`${y1}%`} 
                        x2={`${x2}%`} 
                        y2={`${y2}%`} 
                        stroke="url(#line-gradient)"
                        strokeWidth="1"
                      />
                    );
                  })}
                </svg>
              </div>
              
              {/* Labels */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-[#4DE8ED]/10 text-[#4DE8ED] text-sm rounded-full">
                Gender Bias Cluster
              </div>
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-[#C14BEA]/10 text-[#C14BEA] text-sm rounded-full">
                Financial Risk Neurons
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-[#6C5CE7]/10 text-[#6C5CE7] text-sm rounded-full">
                Empathy Detection
              </div>
            </div>
          </div>
          <div className="bg-[#0F0F2B] p-4 border-t border-[#1E184A] text-gray-400 font-mono text-sm">
            Model: GPT-2 Small • Neuron Clusters: 248 • Labeled Concepts: 72
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;