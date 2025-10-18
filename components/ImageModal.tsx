import React, { useState, useRef, useEffect } from 'react';

// --- Image Modal Component ---
export interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
    const [scale, setScale] = useState(1);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        // zoom in/out
        const newScale = scale - e.deltaY * 0.002;
        // Clamp scale between 0.5x and 4x
        setScale(Math.min(Math.max(newScale, 0.5), 4));
    };
    
    // Close modal on escape key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Close modal on background click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" 
            onClick={handleBackdropClick}
        >
            <div 
                ref={contentRef} 
                className="relative flex items-center justify-center w-full h-full"
                onWheel={handleWheel}
            >
                <img
                    src={imageUrl}
                    alt="高清预览"
                    className="max-w-[95vw] max-h-[95vh] object-contain transition-transform duration-150 ease-out"
                    style={{ transform: `scale(${scale})`, cursor: 'zoom-in' }}
                />
            </div>
            <button
                onClick={onClose}
                className="absolute top-4 right-5 text-white text-5xl font-light hover:text-gray-300 transition-colors"
                aria-label="关闭"
            >
                &times;
            </button>
        </div>
    );
};
