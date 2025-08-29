import * as React from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const GlowEffect: React.FC = () => {
    const [mousePosition, setMousePosition] = React.useState({ x: -200, y: -200 });
    const { theme } = React.useContext(ThemeContext);

    const glowColor = theme === 'dark' 
        ? 'rgba(249, 115, 22, 0.15)' // Orange for dark mode
        : 'rgba(249, 115, 22, 0.1)';   // Slightly subtler orange for light mode

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-30 transition-colors duration-300"
            style={{
                background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 80%)`,
            }}
        />
    );
};

export default GlowEffect;