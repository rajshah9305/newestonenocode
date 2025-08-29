import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Download, Rocket, Folder, File, Bot, User, CornerDownLeft, RefreshCw, Code as CodeIcon, Eye } from 'lucide-react';
import { agents, initialChatMessages } from '../constants';
import type { View, GeneratedApp, ChatMessage, FileNode } from '../types';
import { generateApplication, getChatResponse, getRefinementResponse } from '../services/geminiService';
import { ThemeContext } from '../contexts/ThemeContext';
import CodeBlock from './CodeBlock';

// --- Sub-components ---

const ChatMessageBubble: React.FC<{ message: ChatMessage, onReplyClick: (reply: string) => void }> = React.memo(({ message, onReplyClick }) => {
    const isUser = message.sender === 'user';
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 w-full ${isUser ? 'justify-end' : ''}`}
        >
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 text-white">
                    <Bot size={18} />
                </div>
            )}
            <div className={`max-w-md md:max-w-lg p-3 rounded-2xl ${isUser ? 'bg-orange-500 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-800 rounded-bl-none'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                {message.suggestedReplies && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestedReplies.map(reply => (
                            <button
                                key={reply}
                                onClick={() => onReplyClick(reply)}
                                className="px-3 py-1.5 text-xs bg-white/80 dark:bg-gray-700/80 text-orange-600 dark:text-orange-300 border border-orange-200 dark:border-orange-700 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                            >
                                {reply}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {isUser && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <User size={18} />
                </div>
            )}
        </motion.div>
    );
});

const FileTree: React.FC<{ node: FileNode, selectedFile: FileNode | null, onSelect: (file: FileNode) => void, level?: number }> = ({ node, selectedFile, onSelect, level = 0 }) => {
    const [isOpen, setIsOpen] = React.useState(level < 2); // Auto-expand first few levels
    const isFile = node.type === 'file';
    const isSelected = isFile && selectedFile?.name === node.name && selectedFile?.code === node.code;

    if (isFile) {
        return (
            <div
                onClick={() => onSelect(node)}
                style={{ paddingLeft: `${level * 1.25}rem` }}
                className={`flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer text-sm transition-colors ${isSelected ? 'bg-orange-500/10 text-orange-600 dark:text-orange-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
            >
                <File size={14} className="flex-shrink-0" />
                <span>{node.name}</span>
            </div>
        );
    }

    return (
        <div>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{ paddingLeft: `${level * 1.25}rem` }}
                className="flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-gray-700/50"
            >
                <Folder size={14} className={`flex-shrink-0 transition-transform ${isOpen ? 'text-orange-500' : ''}`} />
                <span className="font-medium">{node.name}</span>
            </div>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        {node.children?.map(child => <FileTree key={child.name} node={child} selectedFile={selectedFile} onSelect={onSelect} level={level + 1} />)}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const LivePreview: React.FC<{ app: GeneratedApp | null }> = ({ app }) => {
    const { theme } = React.useContext(ThemeContext);
    const iframeContent = React.useMemo(() => {
        if (!app) return '';
        
        let appTsx = '';
        const srcFolder = app.fileTree.find(f => f.name === 'src' && f.type === 'folder');
        if (srcFolder && srcFolder.children) {
            const appFile = srcFolder.children.find(f => f.name === 'App.tsx');
            if (appFile) appTsx = appFile.code || '';
        }
        
        const components: Record<string, string> = {};
        const componentsFolder = srcFolder?.children?.find(f => f.name === 'components' && f.type === 'folder');
        if (componentsFolder && componentsFolder.children) {
            componentsFolder.children.forEach(c => {
                if (c.type === 'file') {
                    components[c.name.replace('.tsx', '')] = c.code || '';
                }
            });
        }


        // Basic transpilation (this is a simplified example)
        let processedCode = appTsx
            .replace(/import React, \{.*\} from 'react';/g, '')
            .replace(/export default function App\(\) \{/, 'const App = () => {')
            .replace(/className=/g, 'class=');

        Object.keys(components).forEach(compName => {
            const compCode = components[compName]
                .replace(/import React(?:, \{.*\})? from 'react';/g, '')
                .replace(new RegExp(`export default function ${compName}\\((.*?)\\) \\{`), `const ${compName} = ($1) => {`)
                .replace(/className=/g, 'class=');
            processedCode = `${compCode}\n${processedCode}`;
        });
        
        return `
            <!DOCTYPE html>
            <html lang="en" class="${theme}">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale-1.0">
                <script src="https://cdn.tailwindcss.com"></script>
                 <script>
                    tailwind.config = {
                        theme: {
                            extend: {
                                colors: {
                                    orange: {
                                        500: '${app.colorPalette.primary}'
                                    }
                                }
                            }
                        }
                    }
                </script>
                <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                <style>
                    body {
                         background-color: ${app.colorPalette.background};
                         color: ${app.colorPalette.text};
                         /* Add dark mode styles for preview */
                    }
                    html.dark body {
                        background-color: #111827; /* A generic dark bg */
                        color: #f9fafb;
                    }
                </style>
            </head>
            <body>
                <div id="root"></div>
                <script type="text/babel">
                    ${processedCode}
                    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
                </script>
            </body>
            </html>
        `;
    }, [app, theme]);

    if (!app) {
        return <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg">Loading Preview...</div>;
    }
    
    return (
        <iframe
            srcDoc={iframeContent}
            title="Live Preview"
            className="w-full h-full border-0 rounded-lg shadow-inner"
            sandbox="allow-scripts allow-same-origin"
        />
    );
};

const AIBuilder: React.FC<{ setCurrentView: (view: View) => void }> = ({ setCurrentView }) => {
    const [stage, setStage] = React.useState<'chat' | 'generating' | 'preview'>('chat');
    const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>(initialChatMessages);
    const [userInput, setUserInput] = React.useState('');
    const [isAiTyping, setIsAiTyping] = React.useState(false);
    const [generationProgress, setGenerationProgress] = React.useState(0);
    const [generatedApp, setGeneratedApp] = React.useState<GeneratedApp | null>(null);
    const [selectedFile, setSelectedFile] = React.useState<FileNode | null>(null);
    const [viewMode, setViewMode] = React.useState<'preview' | 'code'>('preview');
    const [refinementInput, setRefinementInput] = React.useState('');
    const [isRefining, setIsRefining] = React.useState(false);
    
    const chatEndRef = React.useRef<HTMLDivElement>(null);
    
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    React.useEffect(scrollToBottom, [chatMessages]);

    const handleSendMessage = async (messageText: string) => {
        const text = messageText.trim();
        if (!text || isAiTyping) return;

        const newUserMessage: ChatMessage = { id: Date.now(), sender: 'user', text };
        setChatMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsAiTyping(true);

        try {
            const response = await getChatResponse(text, chatMessages);
            const newAiMessage: ChatMessage = { id: Date.now() + 1, sender: 'ai', text: response.text, suggestedReplies: response.suggestedReplies };
            setChatMessages(prev => [...prev, newAiMessage]);

            if (response.final) {
                setTimeout(() => handleStartGeneration(text), 1000);
            }
        } catch (error) {
            const errorMessage: ChatMessage = { id: Date.now() + 1, sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
            setChatMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsAiTyping(false);
        }
    };
    
    const handleStartGeneration = (prompt: string) => {
        setStage('generating');
        const interval = setInterval(() => {
            setGenerationProgress(prev => {
                if (prev >= agents.length - 1) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, 1200);

        generateApplication(prompt).then(app => {
            clearInterval(interval);
            setGenerationProgress(agents.length -1);
            setTimeout(() => {
                setGeneratedApp(app);
                // Select the main App.tsx file by default
                const srcFolder = app.fileTree.find(f => f.name === 'src' && f.type === 'folder');
                if (srcFolder?.children) {
                    const mainFile = srcFolder.children.find(c => c.name === 'App.tsx');
                    if (mainFile) setSelectedFile(mainFile);
                }
                setStage('preview');
            }, 1500);
        });
    };

    const handleRefine = async () => {
        const text = refinementInput.trim();
        if (!text || isRefining) return;

        setIsRefining(true);
        setRefinementInput('');
        try {
            const { newApp } = await getRefinementResponse(text);
            if (newApp) {
                setGeneratedApp(newApp);
            }
        } catch (error) {
            console.error("Refinement failed:", error);
        } finally {
            setIsRefining(false);
        }
    };

    const renderChatStage = () => (
        <div className="flex flex-col h-full max-w-3xl mx-auto">
            <div ref={chatEndRef} className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
                {chatMessages.map(msg => <ChatMessageBubble key={msg.id} message={msg} onReplyClick={(reply) => handleSendMessage(reply)} />)}
                {isAiTyping && <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-sm text-gray-500">AI is typing...</motion.div>}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(userInput); } }}
                        placeholder="Describe the app you want to build..."
                        className="w-full p-3 pr-12 bg-gray-100 dark:bg-gray-800 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                        rows={1}
                    />
                    <button
                        onClick={() => handleSendMessage(userInput)}
                        disabled={isAiTyping || !userInput.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                        <CornerDownLeft size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
    
    const renderGeneratingStage = () => (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold mb-4">Crafting your application...</motion.h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">{agents[generationProgress]?.description}</p>
            <div className="w-full max-w-2xl flex items-center justify-between relative mb-8">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2" />
                <motion.div
                    className="absolute top-1/2 left-0 h-0.5 bg-orange-500 -translate-y-1/2"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(generationProgress / (agents.length - 1)) * 100}%` }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                />
                {agents.map((agent, index) => (
                    <div key={agent.id} className="z-10 flex flex-col items-center">
                        <motion.div
                             animate={{
                                scale: index === generationProgress ? 1.2 : 1,
                                borderColor: index <= generationProgress ? '#F97316' : '#E5E7EB',
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white dark:bg-gray-800 border-2 flex items-center justify-center"
                        >
                            <agent.icon className={`transition-colors ${index <= generationProgress ? 'text-orange-500' : 'text-gray-400'}`} size={24}/>
                        </motion.div>
                        <p className={`mt-2 text-xs md:text-sm font-medium transition-colors ${index <= generationProgress ? 'text-black dark:text-white' : 'text-gray-400'}`}>{agent.name}</p>
                    </div>
                ))}
            </div>
            <AnimatePresence mode="wait">
                 <motion.div
                    key={generationProgress}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-green-500"
                >
                    <CheckCircle size={18} />
                    <span className="font-semibold">{agents[generationProgress]?.name} agent complete.</span>
                 </motion.div>
            </AnimatePresence>
        </div>
    );
    
    const renderPreviewStage = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-full">
            <div className="md:col-span-1 lg:col-span-1 bg-gray-50 dark:bg-gray-800/50 p-4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                <h3 className="text-sm font-bold mb-3 px-2">File Structure</h3>
                {generatedApp?.fileTree.map(node => (
                    <FileTree key={node.name} node={node} selectedFile={selectedFile} onSelect={setSelectedFile} />
                ))}
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex flex-col h-full">
                 <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-900">
                    <div className="text-sm px-2">
                        {selectedFile ? selectedFile.name : 'Select a file to view code'}
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        <button onClick={() => setViewMode('preview')} className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-md ${viewMode === 'preview' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-white/50 dark:hover:bg-black/20'}`}>
                            <Eye size={14} /> Preview
                        </button>
                        <button onClick={() => setViewMode('code')} className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-md ${viewMode === 'code' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-white/50 dark:hover:bg-black/20'}`}>
                            <CodeIcon size={14} /> Code
                        </button>
                    </div>
                </div>

                <div className="flex-grow bg-gray-100 dark:bg-gray-800/50 overflow-auto relative">
                     <AnimatePresence mode="wait">
                        <motion.div
                            key={viewMode}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="h-full w-full p-4"
                        >
                            {viewMode === 'preview' ? (
                                <LivePreview app={generatedApp} />
                            ) : (
                                selectedFile?.code ? <CodeBlock code={selectedFile.code} language="tsx" /> : <div className="text-center p-8 text-gray-500">No file selected.</div>
                            )}
                        </motion.div>
                     </AnimatePresence>
                </div>

                 <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <div className="relative">
                        <input
                            type="text"
                            value={refinementInput}
                            onChange={(e) => setRefinementInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleRefine(); }}
                            placeholder="Refine your app, e.g., 'change the primary color to blue'"
                            className="w-full p-3 pr-24 bg-gray-100 dark:bg-gray-800 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button
                            onClick={handleRefine}
                            disabled={isRefining || !refinementInput.trim()}
                            className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-1.5 text-sm"
                        >
                            {isRefining ? <RefreshCw size={14} className="animate-spin" /> : 'Refine'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-screen w-full bg-white dark:bg-gray-900 text-black dark:text-white">
            <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <button onClick={() => setCurrentView('dashboard')} className="flex items-center gap-2 text-sm hover:text-orange-500 transition-colors">
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <div className="flex items-center gap-4">
                    {stage === 'preview' && (
                        <>
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><Download size={14}/> Download Code</button>
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"><Rocket size={14}/> Deploy</button>
                        </>
                    )}
                </div>
            </header>

            <main className="flex-grow overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={stage}
                        initial={{ opacity: 0, x: stage === 'chat' ? 0 : 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                        {stage === 'chat' && renderChatStage()}
                        {stage === 'generating' && renderGeneratingStage()}
                        {stage === 'preview' && renderPreviewStage()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AIBuilder;
