import React, { useState, useEffect } from 'react';

const GlowEffect: React.FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-30 transition duration-300"
            style={{
                background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(249, 115, 22, 0.1), transparent 80%)`,
            }}
        />
    );
};

export default GlowEffect;
