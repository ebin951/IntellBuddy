
import React from 'react';
import { createPortal } from 'react-dom';
import Button from '../shared/Button';

interface VideoPlayerModalProps {
    videoId: string;
    onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ videoId, onClose }) => {
    // Use the current window origin for the YouTube embed to satisfy security policies
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100] animate-fade-in p-4" onClick={onClose}>
            <div className="bg-secondary rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="relative pt-[56.25%] w-full bg-black">
                     <iframe 
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&origin=${origin}`}
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                    ></iframe>
                </div>
                <div className="p-4 flex justify-between items-center bg-secondary border-t border-accent">
                    <span className="text-text-secondary text-sm">Click outside to close</span>
                    <Button onClick={onClose} variant="secondary">Close Player</Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default VideoPlayerModal;
