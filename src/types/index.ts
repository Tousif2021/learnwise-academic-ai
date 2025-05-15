
// User related types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  institution?: {
    name: string;
    domain: string;
    department?: string;
  };
  academicDetails?: {
    level: 'undergraduate' | 'graduate' | 'phd';
    major: string;
    graduationYear: number;
  };
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: {
      assignmentDue: boolean;
      gradeUpdates: boolean;
      aiRecommendations: boolean;
    };
  };
  createdAt: Date;
  lastLogin: Date;
}

// Course related types
export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  institution: string;
  semester: 'fall' | 'spring' | 'summer' | 'winter';
  year: number;
  color?: string;
  coverImage?: string;
  instructors: {
    name: string;
    email: string;
    photoURL?: string;
  }[];
  schedule?: {
    days: string[];
    startTime: string;
    endTime: string;
    location: string;
  };
  enrolled: number;
  progress?: number;
  createdAt: Date;
}

// Course content types
export interface CourseContent {
  id: string;
  courseId: string;
  type: 'lecture' | 'lab' | 'assignment' | 'resource';
  title: string;
  description: string;
  dueDate?: Date;
  files?: {
    name: string;
    url: string;
    type: 'pdf' | 'pptx' | 'doc' | 'mp4' | 'other';
    size: number;
    uploadedAt: Date;
  }[];
  metadata?: {
    chapter?: string;
    topic?: string;
    keywords?: string[];
  };
}

// AI-generated content types
export interface AIContent {
  id: string;
  courseContentId: string;
  summary?: string;
  flashcards?: {
    question: string;
    answer: string;
  }[];
  mcqs?: {
    question: string;
    options: string[];
    correctOption: number;
    explanation?: string;
  }[];
  keyConcepts?: {
    concept: string;
    description: string;
  }[];
  generatedAt: Date;
}

// Analytics types
export interface UserEngagement {
  userId: string;
  courseId: string;
  metrics: {
    lastAccessed: Date;
    timeSpent: number; // in minutes
    resourcesViewed: string[]; // content IDs
    interactions: {
      type: 'view' | 'download' | 'quiz' | 'flashcard';
      contentId: string;
      timestamp: Date;
      duration?: number;
    }[];
  };
}
