import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { sampleProjects } from '../constants';

interface CommandPaletteProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ open, setOpen }) => {
    React.useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(!open);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, setOpen]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-start justify-center pt-20"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: -20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-2xl bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                            <input
                                type="text"
                                placeholder="Search for projects, actions, or documentation..."
                                className="w-full bg-transparent text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                            />
                        </div>
                        <div className="p-4 max-h-[400px] overflow-y-auto">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">Recent Projects</p>
                            <div className="space-y-1">
                                {sampleProjects.slice(0, 4).map(p => (
                                    <div key={p.id} className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                                        <div className="flex items-center gap-3">
                                            <p.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                            <span className="text-black dark:text-white">{p.name}</span>
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Project</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;