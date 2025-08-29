import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
    Plus, Command, ExternalLink, Code
} from 'lucide-react';
import type { View, Project, Stat } from '../types';
import { sampleProjects, dashboardStats } from '../constants';

interface DashboardProps {
  setCurrentView: (view: View) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

const statusConfig = {
    deployed: { bg: 'bg-green-100', text: 'text-green-800' },
    building: { bg: 'bg-blue-100', text: 'text-blue-800' },
    draft: { bg: 'bg-gray-100', text: 'text-gray-800' },
    error: { bg: 'bg-red-100', text: 'text-red-800' },
};

const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => {
    const changeColor = stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600';
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <p className="text-gray-500">{stat.title}</p>
                <stat.icon className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            {stat.change && <p className={`text-sm mt-1 ${changeColor}`}>{stat.change} this month</p>}
        </div>
    );
};

const ProjectItem: React.FC<{ project: Project }> = ({ project }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        borderColor: "rgba(249, 115, 22, 0.5)",
        boxShadow: "0 0 15px rgba(249, 115, 22, 0.2)"
      }}
      className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <project.icon className="h-6 w-6 text-orange-500" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">{project.name}</h3>
            <span className={`px-2 py-0.5 text-xs rounded-full font-medium capitalize ${statusConfig[project.status].bg} ${statusConfig[project.status].text}`}>
              {project.status}
            </span>
          </div>
          <p className="text-sm text-gray-500">{project.description}</p>
        </div>
      </div>
      <div className="hidden lg:flex items-center gap-6">
        <div className="w-40 h-10">
            <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={project.performanceData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{fontSize: '12px', padding: '2px 8px', border: '1px solid #ddd', borderRadius: '4px'}}/>
                    <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
        <div className="text-center">
          <p className="font-bold">{project.performance}%</p>
          <p className="text-xs text-gray-500">Perf.</p>
        </div>
        <div className="text-center">
          <p className="font-bold">{project.uptime}%</p>
          <p className="text-xs text-gray-500">Uptime</p>
        </div>
        {project.deployUrl ? (
            <a href={`https://${project.deployUrl}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 hover:text-black transition-colors">
                <ExternalLink className="h-5 w-5" />
            </a>
        ) : (
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Code className="h-5 w-5" />
            </button>
        )}
      </div>
    </motion.div>
  );

const Dashboard: React.FC<DashboardProps> = ({ setCurrentView, setCommandPaletteOpen }) => {
  return (
    <div className="min-h-screen w-full bg-white text-black">
      <div className="absolute inset-0 z-0 bg-grid-gray-100 [mask-image:linear-gradient(to_bottom,white_1%,transparent_50%)]"></div>
      <div className="relative z-10">
        <header className="p-6 max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => setCommandPaletteOpen(true)} className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-black hover:border-gray-300 transition-colors">
              <Command className="h-4 w-4" />
              <span className="text-sm hidden md:inline">Search...</span>
              <kbd className="text-xs bg-gray-200 rounded px-1.5 py-0.5 hidden md:inline">⌘K</kbd>
            </button>
            <button onClick={() => setCurrentView('builder')} className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold">
              <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
              New Project
            </button>
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map(stat => (
              <StatCard key={stat.title} stat={stat} />
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4">My Projects</h2>
          <div className="space-y-4">
            {sampleProjects.map(project => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
