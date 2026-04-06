

import React from 'react';
import type { NavItem } from './types';

const HomeIcon = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const BookOpenIcon = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
  </svg>
);

const QuestionMarkCircleIcon = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
  </svg>
);

const SparklesIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.812 6.024a.75.75 0 0 1 1.06.018L12 7.252l1.128-1.21a.75.75 0 0 1 1.078 1.044l-1.5 1.625a.75.75 0 0 1-1.078 0L9.812 7.086a.75.75 0 0 1-.001-1.062ZM3.75 12c0 1.699 1.092 3.14 2.628 3.654a.75.75 0 0 1 .536 1.041l-1.128 1.21a.75.75 0 0 1-1.078-1.044l1.5-1.625a.75.75 0 0 1 1.078 0L9.812 17.086a.75.75 0 0 1 .001 1.062ZM6.024 14.188a.75.75 0 0 1 .018-1.06l1.21-1.128a.75.75 0 0 1 1.044 1.078l-1.625 1.5a.75.75 0 0 1-1.078 0L6.024 13.128a.75.75 0 0 1 0-1.062Zm11.952-3.382a.75.75 0 0 1 .018-1.06l1.21-1.128a.75.75 0 0 1 1.044 1.078l-1.625 1.5a.75.75 0 0 1-1.078 0L17.976 10.806a.75.75 0 0 1 0-1.062ZM4.5 12a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Zm11.25 0a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75ZM12 4.5a.75.75 0 0 1-.75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75Zm0 11.25a.75.75 0 0 1-.75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75Z"/>
    </svg>
);

const CodeBracketIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"/>
    </svg>
);

const AcademicCapIcon = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
  </svg>
);

const BriefcaseIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075a2.25 2.25 0 0 1-2.25 2.25h-12a2.25 2.25 0 0 1-2.25-2.25V14.15M12 3v10.5M16.5 6.75l-4.5 4.5-4.5-4.5" />
    </svg>
);

const CalculatorIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-3-2.25V18m-3-2.25V18M6.75 12h.008v.008H6.75V12Zm0 2.25h.008v.008H6.75v-.008Zm0 2.25h.008v.008H6.75V16.5Zm3-4.5h.008v.008H9.75V12Zm0 2.25h.008v.008H9.75v-.008Zm3-2.25h.008v.008h-.008V12Zm0 2.25h.008v.008h-.008v-.008Zm3-2.25h.008v.008H15.75V12Zm0 2.25h.008v.008H15.75v-.008Zm3-2.25h.008v.008H18.75V12Zm0 2.25h.008v.008H18.75v-.008ZM2.25 6.75c0-.828.672-1.5 1.5-1.5h16.5c.828 0 1.5.672 1.5 1.5v10.5c0 .828-.672 1.5-1.5 1.5H3.75c-.828 0-1.5-.672-1.5-1.5V6.75ZM6.75 8.25h10.5v1.5H6.75v-1.5Z" />
    </svg>
);

const LanguageIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
    </svg>
);

const CalculatorPlusIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-3-2.25V18m-3-2.25V18M6.75 12h.008v.008H6.75V12Zm0 2.25h.008v.008H6.75v-.008Zm0 2.25h.008v.008H6.75V16.5Zm3-4.5h.008v.008H9.75V12Zm0 2.25h.008v.008H9.75v-.008Zm3-2.25h.008v.008h-.008V12Zm0 2.25h.008v.008h-.008v-.008Zm3-2.25h.008v.008H15.75V12Zm0 2.25h.008v.008H15.75v-.008Zm3-2.25h.008v.008H18.75V12Zm0 2.25h.008v.008H18.75v-.008ZM2.25 6.75c0-.828.672-1.5 1.5-1.5h16.5c.828 0 1.5.672 1.5 1.5v10.5c0 .828-.672 1.5-1.5 1.5H3.75c-.828 0-1.5-.672-1.5-1.5V6.75ZM6.75 8.25h10.5v1.5H6.75v-1.5Z" />
    </svg>
);

// New/Moved Icons for Navigation
export const DocumentTextIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

export const LayersIcon = ({ className = 'w-6 h-6' }) => ( // For Mindmap AI
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0M3.75 18H7.5m3-6h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0M3.75 12H7.5" />
    </svg>
);

export const CreditCardIcon = ({ className = 'w-6 h-6' }) => ( // For Flashcards (like a knowledge card)
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9H12v6.75l-4.125-3.938A1.125 1.125 0 0 1 7.5 9h-.75M2.25 15.75h19.5V18a2.25 2.25 0 0 1-2.25 2.25H4.5A2.25 2.25 0 0 1 2.25 18v-2.25Z" />
    </svg>
);

export const FileMagnifyingGlassIcon = ({ className = 'w-6 h-6' }) => ( // For Resume AI
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.25 9A1.5 1.5 0 0 1 12 10.5H9.75m5.25 9A1.5 1.5 0 0 1 12 16.5H9.75m-1.5-9.75h4.5m-4.5 9h4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const UsersIcon = ({ className = 'w-6 h-6' }) => ( // For Interview AI
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.75c0-1.036-.84-1.875-1.875-1.875h-3.75a1.875 1.875 0 0 0-1.875 1.875m7.5 0H21a2.25 2.25 0 0 0 2.25-2.25v-3.75a2.25 2.25 0 0 0-2.25-2.25H18.75m-7.5 0H3.75A2.25 2.25 0 0 0 1.5 12v3.75C1.5 17.16 2.34 18 3.375 18H6m0 0v-3.75m0 0H3.375C2.34 15 1.5 14.16 1.5 13.125v-3.75C1.5 8.84 2.34 8 3.375 8h.375a2.25 2.25 0 0 1 2.25 2.25v3.75M6 18h.008v.008H6ZM12 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM15 9.75a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75V7.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25ZM9 9.75h.008v.008H9V9.75ZM15 9.75h.008v.008H15V9.75ZM12 9.75a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1 0-1.5h3a.75.75 0 0 1 .75.75Z" />
    </svg>
);

export const CalendarDaysIcon = ({ className = 'w-6 h-6' }) => ( // For AI Planner
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5m18 7.5v-7.5m-9 5.25h.008v.008H12v-.008ZM12 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
);

export const MicrophoneIcon = ({ className = 'w-6 h-6' }) => ( // For Live Mentor
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
    </svg>
);

// New: Shopping Cart Icon for Checkout
export const ShoppingCartIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25v2.25m-3-3h.008v.008H4.5v-.008Zm0 3h.008v.008H4.5v-.008Zm0 3h.008v.008H4.5v-.008Zm3-6h.008v.008H7.5v-.008Zm0 3h.008v.008H7.5v-.008Zm0 3h.008v.008H7.5v-.008Zm3-6h.008v.008H10.5v-.008Zm0 3h.008v.008H10.5v-.008Zm0 3h.008v.008H10.5v-.008Zm3-6h.008v.008H13.5v-.008Zm0 3h.008v.008H13.5v-.008Zm0 3h.008v.008H13.5v-.008Zm3-6h.008v.008H16.5v-.008Zm0 3h.008v.008H16.5v-.008Zm0 3h.008v.008H16.5v-.008Zm3-6h.008v.008H19.5v-.008Zm0 3h.008v.008H19.5v-.008Zm0 3h.008v.008H19.5v-.008Zm3-6h.008v.008H22.5v-.008Zm0 3h.008v.008H22.5v-.008Zm0 3h.008v.008H22.5v-.008Zm3-6h.008v.008H25.5v-.008Zm0 3h.008v.008H25.5v-.008Zm0 3h.008v.008H25.5v-.008Z" />
    </svg>
);


export const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', icon: HomeIcon },
  { name: 'Study Guide', icon: BookOpenIcon },
  { name: 'Auto Quiz', icon: QuestionMarkCircleIcon },
  { name: 'Doubt Solver', icon: SparklesIcon }, // Renamed from AI Mentor
  { name: 'Mindmap AI', icon: LayersIcon }, // New
  { name: 'Flashcards', icon: CreditCardIcon }, // New
  { name: 'Coding Lab', icon: CodeBracketIcon },
  { name: 'Courses', icon: AcademicCapIcon },
  { name: 'Career AI', icon: BriefcaseIcon },
  { name: 'Resume AI', icon: FileMagnifyingGlassIcon }, // New
  { name: 'CGPA Calculator', icon: CalculatorPlusIcon },
  { name: 'Aptitude AI', icon: CalculatorIcon },
  { name: 'English AI', icon: LanguageIcon },
  { name: 'AI Planner', icon: CalendarDaysIcon }, // New
  { name: 'Interview AI', icon: UsersIcon }, // New
  { name: 'Live Mentor', icon: MicrophoneIcon }, // New
  { name: 'Checkout', icon: ShoppingCartIcon }, // New
];
    