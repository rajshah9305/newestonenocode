import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import { Plus, Command, ExternalLink, Code, ChevronDown } from 'lucide-react';
import type { View, Project, Stat, ActivityLog } from '../types';
import { sampleProjects, dashboardStats } from '../constants';
import ThemeToggle from './ThemeToggle';

interface DashboardProps {
  setCurrentView: (view: View) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

const statusConfig: Record<Project['status'], { bg: string, text: string, border: string, hover: string }> = {
    deployed: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-300', border: 'border-green-300 dark:border-green-700', hover: '' },
    building: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700', hover: '' },
    draft: { bg: 'bg-gray-100 dark:bg-gray-700/50', text: 'text-gray-800 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-600', hover: '' },
    error: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-300', border: 'border-red-300 dark:border-red-700', hover: 'hover:ring-2 hover:ring-red-500/50' },
};

const StatCard: React.FC<{ stat: Stat }> = React.memo(({ stat }) => {
    const changeColor = stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    return (
        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 md:p-6 transition-colors">
            <div className="flex items-center justify-between mb-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">{stat.title}</p>
                <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
            {stat.change && <p className={`text-sm mt-1 ${changeColor}`}>{stat.change}</p>}
        </div>
    );
});

const ProjectItem: React.FC<{ project: Project }> = React.memo(({ project }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const status = statusConfig[project.status];

    const PerformanceChart = () => (
      <div className="h-16 -ml-4 -mr-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={project.performanceData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <Tooltip
              contentStyle={{
                background: "rgba(255, 255, 255, 0.8)",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#333",
              }}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Area type="monotone" dataKey="value" stroke="#f97316" fill="rgba(249, 115, 22, 0.2)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );

    return (
        <motion.div layout className={`bg-white dark:bg-gray-800/50 border ${status.border} rounded-2xl transition-all ${status.hover}`}>
            <div className="p-4 md:p-6 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <project.icon className={`h-8 w-8 mt-1 flex-shrink-0 ${status.text}`} />
                        <div>
                            <h3 className="font-bold text-lg">{project.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{project.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                         <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.bg} ${status.text}`}>{project.status}</span>
                         <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
                <AnimatePresence>
                    {isOpen && (
                         <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: '24px' }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                         >
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
                                <div><p className="text-xs text-gray-500">Views</p><p className="font-semibold">{project.views.toLocaleString()}</p></div>
                                <div><p className="text-xs text-gray-500">Performance</p><p className="font-semibold">{project.performance}%</p></div>
                                <div><p className="text-xs text-gray-500">Uptime</p><p className="font-semibold">{project.uptime}%</p></div>
                                <div><p className="text-xs text-gray-500">Framework</p><p className="font-semibold">{project.framework}</p></div>
                             </div>
                             <div className="mt-4 hidden md:block">
                                <p className="text-xs text-gray-500 mb-1">Performance (3 months)</p>
                                <PerformanceChart />
                             </div>
                             <div className="mt-6 flex items-center justify-end gap-3">
                                <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><Code size={14}/> View Source</button>
                                {project.deployUrl && <a href={`https://${project.deployUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"><ExternalLink size={14}/> Visit Site</a>}
                             </div>
                         </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
});

const ActivityFeedItem: React.FC<{ log: ActivityLog }> = React.memo(({ log }) => (
    <div className="flex items-start gap-3">
        <div className="w-8 h-8 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <log.icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
        <div>
            <p className="text-sm text-gray-800 dark:text-gray-200">{log.text}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{log.timestamp}</p>
        </div>
    </div>
));

const Dashboard: React.FC<DashboardProps> = ({ setCurrentView, setCommandPaletteOpen }) => {
    const allActivity = React.useCallback(() => sampleProjects.flatMap(p => p.activity).slice(0, 5), []);
    
    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-black dark:text-white pb-16">
            <header className="flex items-center justify-between p-4 sm:p-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg text-white">
                        <span className="text-2xl font-bold">R</span>
                    </div>
                    <h1 className="text-xl font-bold">Dashboard</h1>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <button onClick={() => setCurrentView('builder')} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm">
                        <Plus size={16} /> New Project
                    </button>
                     <button onClick={() => setCommandPaletteOpen(true)} className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Command size={20} />
                    </button>
                    <ThemeToggle />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ staggerChildren: 0.1 }}
                >
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {dashboardStats.map(stat => <StatCard key={stat.title} stat={stat} />)}
                    </div>

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                             <h2 className="text-xl font-bold mb-4">Recent Projects</h2>
                             <div className="space-y-4">
                                {sampleProjects.map(p => <ProjectItem key={p.id} project={p} />)}
                             </div>
                        </div>
                        <div>
                             <h2 className="text-xl font-bold mb-4">Activity Feed</h2>
                             <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-6">
                                {allActivity().map(log => <ActivityFeedItem key={log.id} log={log} />)}
                             </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Dashboard;