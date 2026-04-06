
import React, { useState } from 'react';
import type { Course } from '../../types';
import Card from '../shared/Card';
import Button from '../shared/Button';
import CertificateModal from './CertificateModal';
import VideoPlayerModal from './VideoPlayerModal';

const MOCK_COURSES: Course[] = [
    { id: 101, title: 'MongoDB Full Course', instructor: 'FreeCodeCamp', duration: '12h', progress: 0, image: '', videoId: 'oY-0v7w-Ac8' },
    { id: 102, title: 'Dev Roadmap 2025', instructor: 'Tech with Tim', duration: '2h', progress: 45, image: '', videoId: '_uQrJ0TkZlc' },
    { id: 104, title: 'Aptitude Training', instructor: 'Talent Battle', duration: '5h', progress: 0, image: '', videoId: 'L-EFQ5q6RvM' },
    { id: 105, title: 'Group Discussion', instructor: 'Career Launcher', duration: '1h', progress: 0, image: '', videoId: '3w32jIsRlsw' },
    { id: 106, title: 'Ultimate Group Discussion', instructor: 'GD King', duration: '1h', progress: 0, image: '', videoId: 'gXId9M2w5LU' },
    { id: 107, title: 'Project Management', instructor: 'Course Hero', duration: '2h', progress: 0, image: '', videoId: 'QISvmiwOIYI' },
    { id: 108, title: 'Project Planning', instructor: 'Build Fast', duration: '1.5h', progress: 0, image: '', videoId: '4C5LYI1DLR4' },
    { id: 109, title: 'Agile Projects', instructor: 'Scrum Master', duration: '3h', progress: 0, image: '', videoId: 'kGxSyqKbzsc' },
    { id: 110, title: 'Startup Basics', instructor: 'YC', duration: '2h', progress: 0, image: '', videoId: 'vzqDTSZOTic' },
];

const Courses: React.FC<{ userName: string }> = ({ userName }) => {
    const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
    const [playingCourse, setPlayingCourse] = useState<Course | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [showCertificate, setShowCertificate] = useState(false);

    const markComplete = (id: number | string) => {
        setCourses(prev => prev.map(c => c.id === id ? { ...c, progress: 100 } : c));
    };

    return (
        <div className="animate-reveal space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center bg-brand/10 p-6 rounded-2xl border border-brand/20">
                <div>
                    <h2 className="text-3xl font-black text-text-primary">KNOWLEDGE HUB</h2>
                    <p className="text-text-secondary">AI-selected essentials for career mastery.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <Card key={course.id} className="p-6 border-white/5 bg-secondary/80 hover:border-brand/40 transition-all flex flex-col justify-between group">
                        <div className="mb-4">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-lg font-black text-text-primary group-hover:text-brand transition-colors">{course.title}</h3>
                                <span className="text-[9px] font-bold text-text-secondary bg-white/5 px-2 py-0.5 rounded border border-white/5">{course.duration}</span>
                            </div>
                            <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">{course.instructor}</p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                                <div className="bg-brand h-full transition-all duration-1000 shadow-[0_0_10px_#38bdf8]" style={{ width: `${course.progress}%` }}></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Button onClick={() => setPlayingCourse(course)} variant="secondary" className="w-full py-2.5 text-xs font-bold border border-white/10 hover:border-brand/50">
                                    WATCH
                                </Button>
                                {course.progress === 100 ? (
                                    <Button onClick={() => { setSelectedCourse(course); setShowCertificate(true); }} className="w-full py-2.5 text-xs font-black shadow-lg">
                                        CLAIM CERT
                                    </Button>
                                ) : (
                                    <Button onClick={() => markComplete(course.id)} className="w-full py-2.5 text-xs font-bold opacity-60 hover:opacity-100">
                                        FINISH
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {playingCourse?.videoId && <VideoPlayerModal videoId={playingCourse.videoId} onClose={() => setPlayingCourse(null)} />}
            {showCertificate && selectedCourse && <CertificateModal courseName={selectedCourse.title} studentName={userName} onClose={() => setShowCertificate(false)} />}
        </div>
    );
};

export default Courses;
