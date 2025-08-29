import * as React from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
    code: string;
    language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
    const [hasCopied, setHasCopied] = React.useState(false);
    const [animatedCode, setAnimatedCode] = React.useState('');

    React.useEffect(() => {
        setAnimatedCode(''); // Reset on code change
        let i = 0;
        const interval = setInterval(() => {
            setAnimatedCode(code.substring(0, i));
            i++;
            if (i > code.length) {
                clearInterval(interval);
            }
        }, 10);
        return () => clearInterval(interval);
    }, [code]);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <div className="bg-gray-800/80 dark:bg-black/50 text-white p-4 rounded-lg font-mono text-xs h-full overflow-y-auto relative group">
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-1.5 bg-gray-700/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
                {hasCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
            <pre>
                <code>{animatedCode}</code>
                <span className="inline-block w-2 h-3 bg-white animate-pulse" />
            </pre>
        </div>
    );
};

export default CodeBlock;