import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Download, Rocket, Layers, Code, Palette, AlertTriangle, Copy } from 'lucide-react';
import { agents, promptSuggestions } from '../constants';
import type { View, Agent, GeneratedApp } from '../types';
import { generateApplication } from '../services/geminiService';

// --- Sub-components defined outside the main component ---

interface GenerationPipelineProps {
    currentStep: number;
    isGenerating: boolean;
}
const GenerationPipeline: React.FC<GenerationPipelineProps> = ({ currentStep, isGenerating }) => (
    <div className="w-full">
        <h3 className="text-2xl font-bold text-center mb-6">AI Generation Pipeline</h3>
        <div className="flex items-start justify-center">
            {agents.map((agent, index) => {
                const isCompleted = currentStep > index;
                const isActive = isGenerating && currentStep === index;
                return (
                    <React.Fragment key={agent.id}>
                        <div className="flex flex-col items-center gap-2 text-center w-28">
                            <motion.div
                                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                                transition={isActive ? { repeat: Infinity, duration: 1.2 } : {}}
                                className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all duration-300 ${isActive ? 'bg-orange-500 shadow-lg shadow-orange-500/50' : isCompleted ? 'bg-green-500' : 'bg-gray-200 text-black'}`}
                            >
                                {isCompleted ? <CheckCircle className="h-8 w-8" /> : <agent.icon className="h-8 w-8" />}
                            </motion.div>
                            <p className={`text-sm font-semibold transition-colors ${isActive ? 'text-orange-600' : 'text-black'}`}>{agent.name}</p>
                            <p className="text-xs text-gray-500 h-10">{isActive ? agent.description : ''}</p>
                        </div>
                        {index < agents.length - 1 && (
                            <div className="w-12 h-1.5 rounded-full mx-2 mt-7 transition-colors duration-500 relative overflow-hidden bg-gray-200">
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-green-500"
                                    initial={{ width: '0%' }}
                                    animate={{ width: isCompleted ? '100%' : '0%' }}
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    </div>
);

interface AppPreviewProps {
    app: GeneratedApp;
}
const AppPreview: React.FC<AppPreviewProps> = ({ app }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const tabs = ['Overview', 'Pages & Components', 'Code Snippets'];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Add toast notification logic here if desired
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
            className="w-full"
        >
            <h3 className="text-3xl font-bold text-center mb-6">Your Application Blueprint is Ready!</h3>
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <h4 className="text-2xl font-bold">{app.appName}</h4>
                    <p className="text-gray-600">{app.description}</p>
                </div>
                <div className="p-2 bg-gray-100">
                    <div className="flex items-center justify-center gap-2">
                        {tabs.map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-white shadow text-orange-600' : 'text-gray-600 hover:bg-gray-200'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-6 min-h-[300px]">
                    {activeTab === 'Overview' && (
                        <div>
                             <h5 className="font-bold text-lg mb-4">Color Palette</h5>
                             <div className="flex gap-4">
                                {Object.entries(app.colorPalette).map(([name, color]) => (
                                    <div key={name} className="text-center">
                                        <div className="w-16 h-16 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: color }}></div>
                                        <p className="text-sm font-medium capitalize mt-2">{name}</p>
                                        <p className="text-xs text-gray-500">{color}</p>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                    {activeTab === 'Pages & Components' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h5 className="font-bold text-lg mb-2 flex items-center gap-2"><Layers className="w-5 h-5 text-orange-500" /> Pages</h5>
                                <ul className="space-y-2">
                                    {app.pages.map(page => <li key={page.name} className="p-2 bg-gray-50 rounded-md"><strong className="font-semibold">{page.name}</strong>: <span className="text-gray-600">{page.description}</span></li>)}
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-bold text-lg mb-2 flex items-center gap-2"><Palette className="w-5 h-5 text-orange-500" /> Components</h5>
                                <ul className="space-y-2">
                                    {app.components.map(comp => <li key={comp.name} className="p-2 bg-gray-50 rounded-md"><strong className="font-semibold">{comp.name}</strong>: <span className="text-gray-600">{comp.description}</span></li>)}
                                </ul>
                            </div>
                        </div>
                    )}
                    {activeTab === 'Code Snippets' && (
                        <div>
                             <h5 className="font-bold text-lg mb-4">Core Component: {app.components[0].name}</h5>
                             <div className="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm relative">
                                <button onClick={() => copyToClipboard(app.components[0].code)} className="absolute top-2 right-2 p-1.5 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                                    <Copy className="w-4 h-4" />
                                </button>
                                <pre><code>{app.components[0].code}</code></pre>
                             </div>
                        </div>
                    )}
                </div>
                <div className="bg-gray-50 p-4 flex items-center justify-center gap-4 border-t border-gray-200">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition-colors"><Download className="h-4 w-4" /> Download Code</button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"><Rocket className="h-4 w-4" /> Deploy</button>
                </div>
            </div>
        </motion.div>
    );
};

// --- Main Builder Component ---

const AIBuilder: React.FC<{ setCurrentView: (view: View) => void }> = ({ setCurrentView }) => {
    const [prompt, setPrompt] = useState('');
    const [generationState, setGenerationState] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
    const [currentStep, setCurrentStep] = useState(-1);
    const [generatedApp, setGeneratedApp] = useState<GeneratedApp | null>(null);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<number | null>(null);

    const cleanupInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        if (generationState === 'generating' && currentStep < agents.length) {
            intervalRef.current = window.setInterval(() => {
                setCurrentStep(prev => {
                    if (prev < agents.length - 1) {
                        return prev + 1;
                    }
                    cleanupInterval();
                    return prev;
                });
            }, 1200);
        } else if(generationState !== 'generating') {
            cleanupInterval();
        }

        return cleanupInterval;
    }, [generationState, currentStep]);


    const handleGenerate = async () => {
        if (!prompt.trim() || generationState === 'generating') return;

        setGenerationState('generating');
        setCurrentStep(0);
        setGeneratedApp(null);
        setError(null);

        try {
            const result = await generateApplication(prompt);
            setGeneratedApp(result);
            setGenerationState('success');
            setCurrentStep(agents.length);
        } catch (err) {
            setError('An error occurred while generating the application. Please try again.');
            setGenerationState('error');
        }
    };
    
    const isGenerating = generationState === 'generating';

    return (
        <div className="min-h-screen w-full bg-white text-black flex flex-col builder-bg">
            <header className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
                <button onClick={() => setCurrentView('dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </button>
                <h2 className="text-xl font-bold">AI Application Builder</h2>
                <div className="w-40"></div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto flex flex-col items-center gap-12">
                    
                    <div className="w-full text-center">
                        <h3 className="text-3xl font-bold mb-2">Let's start with your idea</h3>
                        <p className="text-gray-500 mb-6">Describe the application you want to build, or try one of our suggestions.</p>
                        <div className="relative max-w-2xl mx-auto">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., A modern to-do list app with user authentication, categories, and due dates..."
                                className="w-full h-36 p-4 pr-16 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
                            />
                            <motion.button
                                onClick={handleGenerate}
                                disabled={!prompt.trim() || isGenerating}
                                whileHover={!isGenerating ? { scale: 1.05 } : {}}
                                whileTap={!isGenerating ? { scale: 0.95 } : {}}
                                className="absolute bottom-4 right-4 group flex items-center justify-center gap-2 w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                            >
                                <ArrowRight className="h-6 w-6" />
                            </motion.button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4 justify-center">
                            {promptSuggestions.map(suggestion => (
                                <button key={suggestion} onClick={() => setPrompt(suggestion)} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors">
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence>
                        {generationState !== 'idle' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full flex justify-center"
                            >
                               {isGenerating && <GenerationPipeline currentStep={currentStep} isGenerating={isGenerating} />}
                               {generationState === 'success' && generatedApp && <AppPreview app={generatedApp} />}
                               {generationState === 'error' && (
                                   <div className="flex flex-col items-center gap-4 p-8 bg-red-50 border-2 border-red-200 rounded-xl text-red-800">
                                       <AlertTriangle className="w-12 h-12" />
                                       <h4 className="text-xl font-bold">Generation Failed</h4>
                                       <p>{error}</p>
                                       <button onClick={() => setGenerationState('idle')} className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">Try Again</button>
                                   </div>
                               )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
};

export default AIBuilder;
