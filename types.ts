import type { LucideIcon } from 'lucide-react';

export type View = 'landing' | 'dashboard' | 'builder';

export interface Agent {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

export type ProjectStatus = 'deployed' | 'building' | 'draft' | 'error';

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
}

export interface Stat {
    title: string;
    value: string;
    icon: LucideIcon;
    change: string;
    changeType: 'increase' | 'decrease' | 'neutral';
}

// Gemini API Response Structure
export interface GeneratedComponent {
    name: string;
    description: string;
    code: string;
}

export interface GeneratedPage {
    name: string;
    path: string;
    description: string;
}

export interface GeneratedApp {
    appName: string;
    description: string;
    colorPalette: {
        primary: string;
        secondary: string;
        accent: string;
        neutral: string;
    };
    pages: GeneratedPage[];
    components: GeneratedComponent[];
}
