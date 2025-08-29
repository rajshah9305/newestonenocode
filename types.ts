import type { LucideIcon } from 'lucide-react';

export type View = 'landing' | 'dashboard' | 'builder';

export type Theme = 'light' | 'dark';

export interface Agent {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

export type ProjectStatus = 'deployed' | 'building' | 'draft' | 'error';

export interface ActivityLog {
    id: string;
    timestamp: string;
    text: string;
    icon: LucideIcon;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  views: number;
  performance: number;
  uptime: number;
  framework: string;
  deployUrl?: string;
  icon: LucideIcon;
  performanceData: { month: string; value: number }[];
  activity: ActivityLog[];
}

export interface Stat {
    title: string;
    value: string;
    icon: LucideIcon;
    change: string;
    changeType: 'increase' | 'decrease' | 'neutral';
}

export interface ChatMessage {
    id: number;
    sender: 'user' | 'ai';
    text: string;
    suggestedReplies?: string[];
    final?: boolean; 
}

// --- Generated App Structure ---

export interface FileNode {
    name: string;
    type: 'file' | 'folder';
    code?: string;
    children?: FileNode[];
}

export interface GeneratedApp {
    appName: string;
    description: string;
    colorPalette: {
        primary: string;
        secondary: string;
        accent: string;
        neutral: string;
        background: string;
        text: string;
    };
    fileTree: FileNode[];
    dependencies: Record<string, string>;
}