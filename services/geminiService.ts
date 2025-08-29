import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedApp } from "../types";

// This is a MOCK implementation. In a real environment, this would
// make a network request to the Gemini API. We simulate the API call
// and its response structure.

// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MOCK_RESPONSE: GeneratedApp = {
    appName: "TaskFlow",
    description: "A modern to-do list app with user authentication, categories, and due dates.",
    colorPalette: {
        primary: "#F97316", // orange-500
        secondary: "#FBBF24", // amber-400
        accent: "#10B981", // emerald-500
        neutral: "#4B5563", // gray-600
    },
    pages: [
        { name: "Dashboard", path: "/", description: "Main view showing all tasks, filterable by category." },
        { name: "Login", path: "/login", description: "User authentication page." },
        { name: "Settings", path: "/settings", description: "User profile and application settings." },
    ],
    components: [
        { name: "TaskCard", description: "Displays a single task with its details and actions.", code: "const TaskCard = ({ task }) => (\n  <div className='p-4 border rounded-lg'>\n    <h3>{task.title}</h3>\n    <p>{task.dueDate}</p>\n  </div>\n);" },
        { name: "Navbar", description: "Top navigation bar with links and user profile.", code: "const Navbar = () => (\n  <nav className='flex justify-between items-center p-4 bg-gray-100'>\n    {/* ... */}\n  </nav>\n);" },
        { name: "AddTaskModal", description: "A modal form for creating new tasks.", code: "const AddTaskModal = ({ isOpen, onClose }) => (\n  // ...\n);" },
    ],
};

export const generateApplication = async (prompt: string): Promise<GeneratedApp> => {
    console.log("Simulating Gemini API call with prompt:", prompt);
    
    // In a real application, you would construct the request like this:
    /*
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            appName: { type: Type.STRING },
            description: { type: Type.STRING },
            colorPalette: {
                type: Type.OBJECT,
                properties: {
                    primary: { type: Type.STRING, description: 'Hex code for primary color' },
                    secondary: { type: Type.STRING, description: 'Hex code for secondary color' },
                    accent: { type: Type.STRING, description: 'Hex code for accent color' },
                    neutral: { type: Type.STRING, description: 'Hex code for neutral/text color' },
                },
                required: ['primary', 'secondary', 'accent', 'neutral']
            },
            pages: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        path: { type: Type.STRING },
                        description: { type: Type.STRING },
                    },
                    required: ['name', 'path', 'description']
                }
            },
            components: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        code: { type: Type.STRING, description: 'A small React code snippet for the component' },
                    },
                    required: ['name', 'description', 'code']
                }
            }
        },
        required: ['appName', 'description', 'colorPalette', 'pages', 'components']
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following prompt, design a complete web application structure. Prompt: "${prompt}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonResult = JSON.parse(response.text);
        return jsonResult as GeneratedApp;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate application structure.");
    }
    */
    
    // For this mock, we just return a static response after a delay.
    return new Promise((resolve) => {
        setTimeout(() => {
            const modifiedResponse = { ...MOCK_RESPONSE };
            if (prompt.toLowerCase().includes("blog")) {
                modifiedResponse.appName = "Blogify";
                modifiedResponse.description = "A simple blog with posts and comments.";
                modifiedResponse.pages = [
                    { name: "Home", path: "/", description: "Lists all blog posts." },
                    { name: "Post Detail", path: "/posts/:id", description: "Shows a single blog post and its comments." },
                    { name: "Admin", path: "/admin", description: "Area to write and manage posts." },
                ];
                modifiedResponse.components = [
                    { name: "PostPreview", description: "A card showing a summary of a blog post.", code: `const PostPreview = ({ post }) => (<div>...</div>);` },
                    { name: "CommentSection", description: "Displays a list of comments and a form to add new ones.", code: `const CommentSection = ({ comments }) => (<div>...</div>);` },
                ];
            }
            resolve(modifiedResponse);
        }, 2500); // Simulate network latency
    });
};
