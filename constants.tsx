import * as React from 'react';
import {
    Brain, Palette, Workflow, Database, TestTube, Cloud, CheckCircle,
    Zap, BarChart3, FolderOpen, Rocket, Users, Activity, Code, ExternalLink, GitCommit, AlertCircle
} from 'lucide-react';
import type { Agent, Project, Stat, ChatMessage } from './types';

export const agents: Agent[] = [
    { id: 'orchestrator', name: 'AI Orchestrator', icon: Brain, description: 'Analyzing requirements and architecting the application.' },
    { id: 'ui', name: 'UI/UX Architect', icon: Palette, description: 'Generating a design system and pixel-perfect interfaces.' },
    { id: 'backend', name: 'API Engineer', icon: Workflow, description: 'Building scalable APIs and serverless functions.' },
    { id: 'database', name: 'Data Architect', icon: Database, description: 'Designing optimal data structures and schemas.' },
    { id: 'tester', name: 'Quality Engineer', icon: TestTube, description: 'Writing unit, integration, and end-to-end tests.' },
    { id: 'deployment', name: 'DevOps Specialist', icon: Cloud, description: 'Deploying to global edge infrastructure.' },
];

export const promptSuggestions: string[] = [
    'A simple blog with posts and comments',
    'A project management tool with boards',
    'An e-commerce site for custom t-shirts',
];

export const initialChatMessages: ChatMessage[] = [
    { id: 1, sender: 'ai', text: "Hello! I'm the AI Orchestrator. What kind of application would you like to build today?", suggestedReplies: ["A to-do list app", "A personal portfolio", "A photo gallery"] }
];

export const sampleProjects: Project[] = [
    { id: 1, name: 'TaskMaster Pro', description: 'Enterprise task management with real-time collaboration.', status: 'deployed', views: 12847, performance: 98, uptime: 99.9, framework: 'Next.js 14', deployUrl: 'taskmaster-pro.vercel.app', icon: CheckCircle, performanceData: [{month: 'Jan', value: 95}, {month: 'Feb', value: 96}, {month: 'Mar', value: 98}], activity: [
        { id: 'a1', text: 'Deployment successful to production.', timestamp: '2 hours ago', icon: Rocket },
        { id: 'a2', text: 'Merged PR #24: "Feat: Add real-time sync"', timestamp: '1 day ago', icon: GitCommit },
    ]},
    { id: 2, name: 'Commerce Edge', description: 'High-performance e-commerce with AI recommendations.', status: 'building', views: 8521, performance: 94, uptime: 99.7, framework: 'React 18', icon: Zap, performanceData: [{month: 'Jan', value: 90}, {month: 'Feb', value: 92}, {month: 'Mar', value: 94}], activity: [
        { id: 'b1', text: 'Build started for preview deployment.', timestamp: '5 minutes ago', icon: Workflow },
        { id: 'b2', text: 'Pushed commit "Refactor checkout flow"', timestamp: '30 minutes ago', icon: GitCommit },
    ]},
    { id: 3, name: 'Portfolio Studio', description: 'Interactive portfolio with 3D elements.', status: 'draft', views: 3426, performance: 96, uptime: 99.8, framework: 'Vite', icon: Palette, performanceData: [{month: 'Jan', value: 92}, {month: 'Feb', value: 94}, {month: 'Mar', value: 96}], activity: [
         { id: 'c1', text: 'Project initialized.', timestamp: '3 days ago', icon: CheckCircle },
    ]},
    { id: 4, name: 'DataViz AI', description: 'Real-time data visualization and analytics dashboard.', status: 'error', views: 25098, performance: 99, uptime: 99.99, framework: 'Next.js 14', deployUrl: 'dataviz-ai.vercel.app', icon: BarChart3, performanceData: [{month: 'Jan', value: 97}, {month: 'Feb', value: 98}, {month: 'Mar', value: 99}], activity: [
        { id: 'd1', text: 'Build failed: "Type error in Dashboard.tsx"', timestamp: '15 minutes ago', icon: AlertCircle },
        { id: 'd2', text: 'Deployment successful to production.', timestamp: '4 hours ago', icon: Rocket },
    ]},
];

export const dashboardStats: Stat[] = [
    { title: 'Total Projects', value: '12', icon: FolderOpen, change: '+2', changeType: 'increase' },
    { title: 'Apps Deployed', value: '8', icon: Rocket, change: '+1', changeType: 'increase' },
    { title: 'Team Members', value: '4', icon: Users, change: '', changeType: 'neutral' },
    { title: 'Avg. Uptime', value: '99.92%', icon: Activity, change: '+0.02%', changeType: 'increase' },
];