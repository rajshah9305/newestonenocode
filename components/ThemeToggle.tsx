import * as React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = React.useContext(ThemeContext);

    return (
        <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className={`relative w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
            }`}
        >
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                style={{
                    position: 'absolute',
                    left: theme === 'light' ? '4px' : 'calc(100% - 28px)',
                }}
            >
                {theme === 'light' ? (
                     <Sun className="w-4 h-4 text-orange-500" />
                ) : (
                     <Moon className="w-4 h-4 text-gray-700" />
                )}
            </motion.div>
        </button>
    );
};

export default ThemeToggle;