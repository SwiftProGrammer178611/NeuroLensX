import React, { useState } from 'react';
import { Brain } from 'lucide-react';

const atlasItems = [
  {
    id: 1,
    title: 'Metaphor Processing',
    description: 'This cluster activates when processing figurative language and metaphors.',
    model: 'GPT-2',
    layers: '8-12',
    color: '#4DE8ED'
  },
  {
    id: 2,
    title: 'Empathy Detection',
    description: 'Neurons that respond to emotional context and empathetic language patterns.',
    model: 'BERT-large',
    layers: '16-20',
    color: '#6C5CE7'
  },
  {
    id: 3,
    title: 'Political Bias',
    description: 'This region encodes political leaning and ideological framing of content.',
    model: 'RoBERTa',
    layers: '10-14',
    color: '#C14BEA'
  },
  {
    id: 4,
    title: 'Toxicity Assessment',
    description: 'Neurons that activate strongly when processing potentially harmful content.',
    model: 'T5-large',
    layers: '12-16',
    color: '#FD79A8'
  }
];

const BrainAtlas = () => {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <section id="demo" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#4DE8ED] to-[#C14BEA] bg-clip-text text-transparent">
              AI Brain Atlas
            </span> Gallery
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore labeled neuron clusters from famous models and discover what they're really detecting.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {atlasItems.map((item) => (
            <div 
              key={item.id}
              className={`rounded-xl overflow-hidden transition-all duration-300 cursor-pointer border ${
                activeId === item.id 
                  ? 'border-2' 
                  : 'border'
              }`}
              style={{ borderColor: activeId === item.id ? item.color : '#1E184A' }}
              onClick={() => setActiveId(activeId === item.id ? null : item.id)}
            >
              <div 
                className="h-40 relative bg-gradient-to-br from-[#0B0B1A] to-[#150F2E]"
                style={{ 
                  backgroundColor: `${item.color}05`,
                  borderBottom: activeId === item.id ? `2px solid ${item.color}` : '1px solid #1E184A'
                }}
              >
                {/* Brain Visualization */}
                <div 
                  className="absolute inset-0 flex items-center justify-center opacity-60"
                  style={{ color: item.color }}
                >
                  <Brain className="w-16 h-16" />
                  
                  {/* Glowing Effect */}
                  <div 
                    className="absolute w-16 h-16 rounded-full blur-xl"
                    style={{ backgroundColor: `${item.color}30` }}
                  ></div>
                  
                  {/* Neuron Points */}
                  {Array(12).fill(0).map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{
                        backgroundColor: item.color,
                        left: `${30 + Math.random() * 40}%`,
                        top: `${30 + Math.random() * 40}%`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    ></div>
                  ))}
                </div>
                
                {/* Title Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="px-4 py-2 rounded-lg backdrop-blur-sm text-lg font-semibold"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    {item.title}
                  </div>
                </div>
              </div>
              
              <div 
                className="p-4 bg-[#0D0E23]"
                style={{ 
                  height: activeId === item.id ? 'auto' : '100px',
                  overflow: 'hidden'
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-300 text-sm">Model: {item.model}</div>
                  <div 
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{ backgroundColor: `${item.color}20`, color: item.color }}
                  >
                    Layers {item.layers}
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm">
                  {item.description}
                </p>
                
                {activeId === item.id && (
                  <div className="mt-4 pt-4 border-t border-[#1E184A]">
                    <h4 className="font-medium mb-2">Example Triggering Prompts:</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#1E184A] flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        </div>
                        <span>"Life is a journey, not a destination."</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#1E184A] flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        </div>
                        <span>"She's drowning in a sea of paperwork."</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#1E184A] flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        </div>
                        <span>"His heart was a stone inside his chest."</span>
                      </li>
                    </ul>
                    
                    <button 
                      className="mt-4 w-full py-2 rounded-lg text-sm"
                      style={{ backgroundColor: `${item.color}20`, color: item.color }}
                    >
                      View Full Analysis
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrainAtlas;