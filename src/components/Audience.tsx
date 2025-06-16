import React from 'react';
import { Users, Shield, Code, GraduationCap } from 'lucide-react';

const audienceItems = [
  {
    icon: Users,
    title: 'AI Researchers',
    description: 'Understand what your models are really learning and identify hidden patterns.',
    color: '#4DE8ED'
  },
  {
    icon: Shield,
    title: 'Ethics Teams',
    description: 'Uncover and fix hidden model bias by directly examining neural activations.',
    color: '#6C5CE7'
  },
  {
    icon: Code,
    title: 'Developers',
    description: 'Debug, prune, and improve neural networks faster with direct concept visualization.',
    color: '#C14BEA'
  },
  {
    icon: GraduationCap,
    title: 'Educators',
    description: 'Use it to teach students about how AI "thinks" and processes information.',
    color: '#FD79A8'
  }
];

const Audience = () => {
  return (
    <section className="py-20 bg-[#080815]/60">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Who It's <span className="bg-gradient-to-r from-[#4DE8ED] to-[#C14BEA] bg-clip-text text-transparent">For</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            NeuroCartographer serves diverse needs across the AI ecosystem.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {audienceItems.map((item, index) => (
            <div 
              key={index}
              className="rounded-xl p-6 bg-[#0D0E23]/60 border border-[#1E184A] transition-all duration-300 hover:shadow-lg hover:shadow-[#1E184A]/30 hover:-translate-y-1"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${item.color}15`, color: item.color }}
              >
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Use Case */}
        <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-[#0D0E23] to-[#150F2E] rounded-xl overflow-hidden border border-[#1E184A]">
          <div className="p-6 md:p-8">
            <h3 className="text-2xl font-semibold mb-4">Real-World Application</h3>
            <div className="space-y-4">
              <p className="text-gray-300">
                An AI ethics team at a major tech company used NeuroCartographer to identify why 
                their financial assessment model was making biased lending decisions against certain demographic groups.
              </p>
              <div className="bg-[#0B0B1A] border border-[#1E184A] rounded-lg p-4">
                <div className="font-medium text-[#4DE8ED] mb-2">Results:</div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#4DE8ED]/20 text-[#4DE8ED] flex items-center justify-center shrink-0 mt-0.5">✓</div>
                    <span>Identified 3 neuron clusters that activated differently for minority applicants</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#4DE8ED]/20 text-[#4DE8ED] flex items-center justify-center shrink-0 mt-0.5">✓</div>
                    <span>Traced activation patterns to specific input features that caused bias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#4DE8ED]/20 text-[#4DE8ED] flex items-center justify-center shrink-0 mt-0.5">✓</div>
                    <span>Reduced model discrimination by 78% after targeted retraining</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Audience;