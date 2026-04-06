
import React from 'react';
import type { Notification } from '../../types';

interface NotificationPanelProps {
    onClose: () => void;
}

const mockNotifications: Notification[] = [
    { id: 1, title: "Streak at Risk!", message: "You haven't studied today. Keep your 12-day streak alive!", read: false },
    { id: 2, title: "Daily Quest Update", message: "Just one quest left for today! Generate a study guide to complete your goal.", read: false },
    { id: 3, title: "New Feature!", message: "Try out the new Flashcards generator in the study tools section.", read: true },
    { id: 4, title: "Feeling Stuck?", message: "The Doubt Solver chatbot is available 24/7 to help you with tough questions.", read: true },
];

const XMarkIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);


const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={onClose}
        >
            <div 
                className="absolute top-20 right-6 w-80 max-w-sm bg-secondary rounded-lg shadow-2xl border border-accent animate-fade-in z-50"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-accent">
                    <h3 className="font-semibold text-text-primary">Notifications</h3>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="py-2 max-h-80 overflow-y-auto">
                    {mockNotifications.map(notif => (
                        <div key={notif.id} className={`p-4 border-l-4 ${notif.read ? 'border-transparent' : 'border-brand'}`}>
                            <p className={`font-semibold ${notif.read ? 'text-text-secondary' : 'text-text-primary'}`}>{notif.title}</p>
                            <p className="text-sm text-text-secondary">{notif.message}</p>
                        </div>
                    ))}
                </div>
                 <div className="p-2 border-t border-accent text-center">
                    <button className="text-sm text-brand hover:text-brand-hover font-semibold">
                        Mark all as read
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationPanel;
