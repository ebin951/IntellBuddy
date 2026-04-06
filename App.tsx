import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Layout } from './components/layout/Layout';
import Spinner from './components/shared/Spinner';
import { useAppStore } from './store/useAppStore';
import { getFromLocalStorage, saveToLocalStorage } from './utils/localStorage';

// Core imports (non-lazy for stability)
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import FocusGame from './components/game/FocusGame';

// Feature imports (lazy for performance)
const StudyGuideGenerator = lazy(() => import('./components/study/StudyGuideGenerator'));
const AutoQuiz = lazy(() => import('./components/study/AutoQuiz'));
const DoubtSolver = lazy(() => import('./components/study/DoubtSolver'));
const MindmapGenerator = lazy(() => import('./components/study/MindmapGenerator'));
const Flashcards = lazy(() => import('./components/study/Flashcards'));
const CodingLab = lazy(() => import('./components/coding/CodingLab'));
const Courses = lazy(() => import('./components/courses/Courses'));
const CareerAI = lazy(() => import('./components/career/CareerAI'));
const ResumeAnalyzer = lazy(() => import('./components/career/ResumeAnalyzer'));
const CGPACalculator = lazy(() => import('./components/tools/CGPACalculator'));
const AptitudeTrainer = lazy(() => import('./components/training/AptitudeTrainer'));
const EnglishTrainer = lazy(() => import('./components/training/EnglishTrainer'));
const Planner = lazy(() => import('./components/planner/Planner'));
const InterviewCoach = lazy(() => import('./components/training/InterviewCoach'));
const LiveMentor = lazy(() => import('./components/study/LiveMentor'));
const CheckoutForm = lazy(() => import('./components/checkout/CheckoutForm'));

const App: React.FC = () => {
  const { 
    user, 
    activeView, 
    isGameActive, 
    setUser, 
    endGame,
  } = useAppStore();

  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    // Simulate checking session by looking for user in local storage
    const storedUser = getFromLocalStorage('current_user', null);
    if (storedUser) {
      setUser(storedUser);
    }
    setIsCheckingSession(false);
  }, [setUser]);

  const handleLogin = (loggedInUser: any) => {
    setUser(loggedInUser);
    saveToLocalStorage('current_user', loggedInUser);
  };

  if (isCheckingSession) {
    return (
        <div className="bg-primary min-h-screen flex items-center justify-center">
            <div className="text-brand animate-pulse font-black uppercase tracking-widest text-xs">Establishing Neural Link...</div>
        </div>
    );
  }

  // If user is not logged in, show the Login component
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'Dashboard': return <Dashboard userName={user.username} />;
      case 'Study Guide': return <StudyGuideGenerator />;
      case 'Auto Quiz': return <AutoQuiz />;
      case 'Doubt Solver': return <DoubtSolver />;
      case 'Mindmap AI': return <MindmapGenerator />;
      case 'Flashcards': return <Flashcards />;
      case 'Coding Lab': return <CodingLab />;
      case 'Courses': return <Courses userName={user.username} />;
      case 'Career AI': return <CareerAI />;
      case 'Resume AI': return <ResumeAnalyzer />;
      case 'CGPA Calculator': return <CGPACalculator />;
      case 'Aptitude AI': return <AptitudeTrainer />;
      case 'English AI': return <EnglishTrainer />;
      case 'AI Planner': return <Planner />;
      case 'Interview AI': return <InterviewCoach />;
      case 'Live Mentor': return <LiveMentor />;
      case 'Checkout': return <CheckoutForm userId={user.id} />;
      default: return <Dashboard userName={user.username} />;
    }
  };

  return (
    <div className="bg-primary text-text-primary min-h-screen font-sans selection:bg-brand selection:text-primary">
      {isGameActive ? (
        <FocusGame onGameEnd={endGame} />
      ) : (
        <Layout>
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <Suspense fallback={
               <div className="flex flex-col items-center justify-center h-64">
                  <Spinner size="md" />
                  <p className="text-[9px] font-black text-brand uppercase tracking-widest mt-4 opacity-40">Syncing Module...</p>
               </div>
            }>
              {renderContent()}
            </Suspense>
          </div>
        </Layout>
      )}
    </div>
  );
};

export default App;