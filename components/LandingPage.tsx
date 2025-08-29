import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Brain, Layers, Rocket } from 'lucide-react';
import type { View } from '../types';

interface LandingPageProps {
  setCurrentView: (view: View) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setCurrentView }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };
  
  const features = [
      { icon: Brain, title: "Multi-Agent AI", description: "Our coordinated AI agents handle everything from UI design to deployment." },
      { icon: Layers, title: "Interactive Previews", description: "Visualize your application and provide feedback before a line of code is written." },
      { icon: Rocket, title: "One-Click Deployment", description: "Go from idea to live application on global infrastructure in minutes." }
  ];

  return (
    <div className="min-h-screen w-full bg-white text-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(251,146,60,0.2),transparent)]"></div>
      </div>
      <nav className="relative z-20 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg text-white">
            <span className="text-2xl font-bold">R</span>
          </div>
          <h1 className="text-xl font-bold text-black">RAJAI</h1>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => setCurrentView('dashboard')} className="text-gray-600 hover:text-black transition-colors">Dashboard</button>
          <motion.button
            onClick={() => setCurrentView('builder')}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(249, 115, 22, 0.4)" }}
            className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold transition-all"
          >
            Get Started
          </motion.button>
        </div>
      </nav>

      <main className="relative z-10 text-center px-4">
        <motion.div 
            className="py-24 md:py-32"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold mb-6">
            Build & Deploy Apps with
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-400 mt-2">
              AI Precision
            </span>
          </motion.h1>
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg text-gray-600 mb-10">
            Our multi-agent AI system transforms your ideas into production-ready applications in minutes. Design, code, test, and deploy seamlessly.
          </motion.p>
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-4">
            <motion.button
              onClick={() => setCurrentView('builder')}
              whileHover={{ scale: 1.05 }}
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-lg"
            >
              Start Building
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-8 py-4 bg-gray-100 border border-gray-200 text-black rounded-xl font-bold text-lg">
              <Play className="h-5 w-5" />
              Watch Demo
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div 
            className="pb-24 md:pb-32"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className="text-3xl font-bold mb-12">An Entire Development Team, As One AI</h2>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <motion.div 
                        key={index} 
                        className="bg-gray-50/50 p-8 rounded-2xl border border-gray-200 text-left"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                        <div className="w-12 h-12 mb-4 bg-gradient-to-br from-orange-100 to-amber-100 text-orange-500 rounded-lg flex items-center justify-center">
                            <feature.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;
