import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Brain, Layers, Rocket, Menu, X } from 'lucide-react';
import type { View } from '../types';

interface LandingPageProps {
  setCurrentView: (view: View) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setCurrentView }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
  
  const navLinks = (
      <>
          <button onClick={() => { setCurrentView('dashboard'); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors md:w-auto md:text-center">Dashboard</button>
          <motion.button
            onClick={() => { setCurrentView('builder'); setIsMenuOpen(false); }}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(249, 115, 22, 0.4)" }}
            className="w-full md:w-auto mt-4 md:mt-0 px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold transition-all"
          >
            Get Started
          </motion.button>
      </>
  );

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900 text-black dark:text-white overflow-x-hidden">
      <nav className="flex items-center justify-between p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg text-white">
            <span className="text-2xl font-bold">R</span>
          </div>
          <h1 className="text-xl font-bold">RAJAI</h1>
        </div>
        <div className="hidden md:flex items-center gap-4">
          {navLinks}
        </div>
        <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden absolute top-[68px] left-0 right-0 bg-white dark:bg-gray-900 z-50 p-6 border-b border-gray-200 dark:border-gray-700"
            >
                <div className="flex flex-col items-start gap-4">
                    {navLinks}
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 text-center px-4 sm:px-6">
        <motion.div 
            className="py-20 md:py-32"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6">
            Build & Deploy Apps with
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-400 mt-2">
              AI Precision
            </span>
          </motion.h1>
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-10">
            Our multi-agent AI system transforms your ideas into production-ready applications in minutes. Design, code, test, and deploy seamlessly.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={() => setCurrentView('builder')}
              whileHover={{ scale: 1.05 }}
              className="group flex items-center justify-center w-full sm:w-auto gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-lg"
            >
              Start Building
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} className="flex items-center justify-center w-full sm:w-auto gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-lg">
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
                        className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 text-left"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                        <div className="w-12 h-12 mb-4 bg-gradient-to-br from-orange-100 to-amber-100 text-orange-500 rounded-lg flex items-center justify-center">
                            <feature.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;