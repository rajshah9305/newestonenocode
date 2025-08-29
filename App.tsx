import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { View } from './types';
import GlowEffect from './components/GlowEffect';
import CommandPalette from './components/CommandPalette';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AIBuilder from './components/AIBuilder';

export default function App() {
    const [currentView, setCurrentView] = React.useState<View>('landing');
    const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);

    const renderCurrentView = () => {
        switch (currentView) {
            case 'landing':
                return <LandingPage setCurrentView={setCurrentView} />;
            case 'builder':
                return <AIBuilder setCurrentView={setCurrentView} />;
            case 'dashboard':
                return <Dashboard setCurrentView={setCurrentView} setCommandPaletteOpen={setCommandPaletteOpen} />;
            default:
                return <LandingPage setCurrentView={setCurrentView} />;
        }
    };

    return (
        <div className="font-sans antialiased">
            <GlowEffect />
            <CommandPalette open={commandPaletteOpen} setOpen={setCommandPaletteOpen} />
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentView}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderCurrentView()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}