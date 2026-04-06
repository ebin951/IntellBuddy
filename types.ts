
import type React from 'react';

export type View =
  | 'Dashboard'
  | 'Study Guide'
  | 'Auto Quiz'
  | 'Doubt Solver'
  | 'Mindmap AI'
  | 'Flashcards'
  | 'Coding Lab'
  | 'Courses'
  | 'Career AI'
  | 'Resume AI'
  | 'CGPA Calculator'
  | 'Aptitude AI'
  | 'English AI'
  | 'AI Planner'
  | 'Interview AI'
  | 'Live Mentor'
  | 'Checkout';

export interface NavItem {
  name: View;
  icon: (props: { className?: string }) => React.ReactElement;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
  type: 'MCQ' | 'True/False';
}

export interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
    sources?: { title: string; uri: string }[];
}

export interface StudyGuideContent {
    summary: string;
    keyPoints: string[];
    examQuestions: string[];
}

export interface MindmapNode {
    name: string;
    description?: string;
    children?: MindmapNode[];
}

export interface MindmapResponse {
    root: MindmapNode;
    explanations: { point: string; detail: string }[];
}

export interface Flashcard {
    front: string;
    back: string;
}

export interface Course {
    id: number | string;
    title: string;
    instructor: string;
    duration: string;
    progress: number;
    image: string;
    videoId?: string;
}

export interface CareerRecommendation {
    careerPath: string;
    description: string;
    recommendedCourses: string[];
    whyItFits: string;
}

export interface CodeReviewResult {
    summary: string;
    score: number;
    categories: {
        name: string;
        severity: 'high' | 'medium' | 'low';
        feedback: string;
    }[];
}

export interface ResumeAnalysis {
    score: number;
    improvements: string[];
    keywords: string[];
}

export interface Notification {
    id: number;
    title: string;
    message: string;
    read: boolean;
    type?: 'update' | 'reminder';
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  totalHours: number;
  nextLevelXp: number;
  studyCycle: { day: string; hours: number }[];
}

export interface UserProfile {
    id: string;
    username: string;
    fullName: string; 
    phoneNumber: string; 
    email: string; 
    joinedAt: string; 
    xp: number; 
    level: number; 
    streak: number; 
    totalHours: number; 
    authSource: 'email' | 'google' | 'mock'; 
}

// Fix: Add missing 'Order' interface for Supabase service
export interface Order {
    id: string;
    user_id: string;
    product_name: string;
    quantity: number;
    price_per_unit: number;
    total_amount: number;
    order_date: string; // ISO string
    status: 'pending' | 'completed' | 'failed' | string; 
}
