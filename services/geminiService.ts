import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedApp } from "../types";

// This is a MOCK implementation. In a real environment, this would
// make a network request to the Gemini API. We simulate the API call
// and its response structure.

const MOCK_TODO_APP_CODE = {
    "App.tsx": `import React, { useState } from 'react';
import Header from './components/Header';
import TaskCard from './components/TaskCard';
import AddTaskForm from './components/AddTaskForm';

const initialTasks = [
  { id: 1, title: 'Design landing page', completed: true },
  { id: 2, title: 'Develop API endpoints', completed: false },
  { id: 3, title: 'Deploy to production', completed: false },
];

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);

  const addTask = (title) => {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className='bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans'>
      <Header appName='TaskFlow' />
      <main className='p-4 sm:p-6 max-w-2xl mx-auto'>
        <AddTaskForm onAddTask={addTask} />
        <div className='mt-6 space-y-3'>
          <h2 class="text-lg font-semibold">Tasks</h2>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onToggle={toggleTask} />
          ))}
        </div>
      </main>
    </div>
  );
}`,
    "components/Header.tsx": `import React from 'react';

export default function Header({ appName }) {
  return (
    <header className='flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm'>
      <h1 className='text-2xl font-bold text-orange-500'>{appName}</h1>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Welcome, User</span>
        <img src="https://i.pravatar.cc/32" alt="user avatar" className="w-8 h-8 rounded-full" />
      </div>
    </header>
  );
}`,
    "components/TaskCard.tsx": `import React from 'react';

export default function TaskCard({ task, onToggle }) {
  return (
    <div 
      onClick={() => onToggle(task.id)}
      className={'p-4 border rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-4 ' + 
        (task.completed 
          ? 'bg-white/60 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700' 
          : 'bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-800 ring-1 ring-orange-100 dark:ring-orange-900'
        )
      }
    >
      <div className={'w-5 h-5 rounded-full flex items-center justify-center transition-colors ' + (task.completed ? 'bg-green-500' : 'border-2 border-gray-300')}>
        {task.completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
      </div>
      <h3 className={'font-medium ' + (task.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200')}>{task.title}</h3>
    </div>
  );
}`,
    "components/AddTaskForm.tsx": `import React, { useState } from 'react';

export default function AddTaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask(title);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-grow p-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <button 
        type="submit"
        className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
        disabled={!title.trim()}
      >
        Add
      </button>
    </form>
  );
}`
};


const MOCK_TODO_APP: GeneratedApp = {
    appName: "TaskFlow",
    description: "A modern to-do list app with user authentication, categories, and due dates.",
    colorPalette: {
        primary: "#F97316", // orange-500
        secondary: "#FBBF24", // amber-400
        accent: "#10B981", // emerald-500
        neutral: "#4B5563", // gray-600
        background: "#F9FAFB", // gray-50
        text: "#1F2937" // gray-800
    },
    fileTree: [
        { name: 'src', type: 'folder', children: [
            { name: 'components', type: 'folder', children: [
                { name: 'Header.tsx', type: 'file', code: MOCK_TODO_APP_CODE["components/Header.tsx"] },
                { name: 'TaskCard.tsx', type: 'file', code: MOCK_TODO_APP_CODE["components/TaskCard.tsx"] },
                { name: 'AddTaskForm.tsx', type: 'file', code: MOCK_TODO_APP_CODE["components/AddTaskForm.tsx"] },
            ]},
            { name: 'App.tsx', type: 'file', code: MOCK_TODO_APP_CODE["App.tsx"] },
        ]},
        { name: 'package.json', type: 'file', code: JSON.stringify({ name: "taskflow", version: "0.1.0", dependencies: { react: "^18", "lucide-react": "^0.300.0" } }, null, 2) },
    ],
    dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "tailwindcss": "^3.4.1",
        "lucide-react": "^0.303.0"
    }
};

const conversationState = {
    askedForDetails: false,
};

const colorMap: Record<string, string> = {
    red: '#EF4444',
    blue: '#3B82F6',
    green: '#22C55E',
    purple: '#8B5CF6',
    orange: '#F97316',
};

export const getChatResponse = async (userMessage: string, chatHistory: any[]): Promise<{text: string, final?: boolean, suggestedReplies?: string[]}> => {
     console.log("Simulating AI chat response for:", userMessage);
     return new Promise((resolve, reject) => {
         setTimeout(() => {
            // Simulate a network error occasionally
            if (Math.random() < 0.1) {
                reject(new Error("Simulated network error"));
                return;
            }

            if (!conversationState.askedForDetails) {
                 conversationState.askedForDetails = true;
                 resolve({
                     text: `A to-do list app is a great choice! To make it perfect, could you tell me if you have any specific features in mind? For example, should tasks have due dates, priorities, or categories?`,
                     suggestedReplies: ["Just keep it simple for now", "Add due dates and priorities", "Let's add categories"],
                 });
             } else {
                 resolve({
                     text: `Excellent! I've analyzed your request for "${userMessage}" and incorporated your feedback. The plan includes a clean UI and state management for the tasks. I'm ready to start building the application blueprint. Shall we begin?`,
                     final: true,
                 });
             }
         }, 1500);
     });
}


export const getRefinementResponse = async (userMessage: string): Promise<{ text: string, newApp?: GeneratedApp }> => {
    console.log("Simulating AI refinement for:", userMessage);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.1) {
                reject(new Error("Simulated refinement error"));
                return;
            }
            const newApp = JSON.parse(JSON.stringify(MOCK_TODO_APP)); // deep copy
            let responseText = `I've noted your feedback: "${userMessage}". Let me know if you'd like me to refine the application further!`;
            let refined = false;

            // Check for name change
            const nameMatch = userMessage.match(/(?:name to|rename to) ['"](.*?)['"]/i);
            if (nameMatch && nameMatch[1]) {
                newApp.appName = nameMatch[1];
                responseText = `I've updated the application name to "${newApp.appName}". You can see the change in the live preview.`;
                refined = true;
            }

            // Check for color change
            const colorMatch = userMessage.match(/(?:color to|use color) (\w+)/i);
            if (colorMatch && colorMatch[1]) {
                const colorName = colorMatch[1].toLowerCase();
                const hex = colorMap[colorName] || colorMatch[1]; // Use hex directly if not in map
                newApp.colorPalette.primary = hex;
                responseText = `I've changed the primary color to ${colorName}. Check out the updated preview!`;
                refined = true;
            }

            resolve({ text: responseText, newApp: refined ? newApp : undefined });

        }, 2000);
    });
}


export const generateApplication = async (prompt: string): Promise<GeneratedApp> => {
    console.log("Simulating Gemini API call with prompt:", prompt);
    // Reset conversation state for next generation
    conversationState.askedForDetails = false;

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_TODO_APP);
        }, 3500); // Simulate generation time
    });
};