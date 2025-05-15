
import { Course, CourseContent, User, AIContent } from "@/types";

// Mock user data
export const currentUser: User = {
  id: "user123",
  email: "student@university.edu",
  displayName: "Alex Johnson",
  photoURL: "https://i.pravatar.cc/300",
  institution: {
    name: "State University",
    domain: "university.edu",
    department: "Computer Science",
  },
  academicDetails: {
    level: "undergraduate",
    major: "Computer Science",
    graduationYear: 2025,
  },
  preferences: {
    theme: "system",
    notifications: {
      assignmentDue: true,
      gradeUpdates: true,
      aiRecommendations: true,
    },
  },
  createdAt: new Date("2023-09-01"),
  lastLogin: new Date(),
};

// Mock course data
export const mockCourses: Course[] = [
  {
    id: "course1",
    title: "Introduction to Machine Learning",
    code: "CS-301",
    description: "Fundamentals of machine learning algorithms and applications",
    institution: "State University",
    semester: "fall",
    year: 2023,
    color: "#2563eb",
    coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop",
    instructors: [
      {
        name: "Dr. Sarah Chen",
        email: "schen@university.edu",
        photoURL: "https://i.pravatar.cc/300?img=28",
      },
    ],
    schedule: {
      days: ["Monday", "Wednesday"],
      startTime: "10:00",
      endTime: "11:30",
      location: "Science Building, Room 305",
    },
    enrolled: 68,
    progress: 0.65,
    createdAt: new Date("2023-08-15"),
  },
  {
    id: "course2",
    title: "Data Structures and Algorithms",
    code: "CS-202",
    description: "Advanced data structures and algorithm analysis techniques",
    institution: "State University",
    semester: "fall",
    year: 2023,
    color: "#0d9488",
    coverImage: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&auto=format&fit=crop",
    instructors: [
      {
        name: "Prof. Michael Rodriguez",
        email: "rodriguez@university.edu",
        photoURL: "https://i.pravatar.cc/300?img=11",
      },
    ],
    schedule: {
      days: ["Tuesday", "Thursday"],
      startTime: "13:00",
      endTime: "14:30",
      location: "Engineering Hall, Room 122",
    },
    enrolled: 94,
    progress: 0.42,
    createdAt: new Date("2023-08-12"),
  },
  {
    id: "course3",
    title: "Advanced Artificial Intelligence",
    code: "CS-401",
    description: "Graduate level coverage of modern AI techniques",
    institution: "State University",
    semester: "fall",
    year: 2023,
    color: "#9333ea",
    coverImage: "https://images.unsplash.com/photo-1655720828018-edd2daec9169?w=800&auto=format&fit=crop",
    instructors: [
      {
        name: "Dr. James Wilson",
        email: "jwilson@university.edu",
        photoURL: "https://i.pravatar.cc/300?img=15",
      },
    ],
    schedule: {
      days: ["Monday", "Thursday"],
      startTime: "15:00",
      endTime: "16:30",
      location: "Research Center, Room 401",
    },
    enrolled: 42,
    progress: 0.28,
    createdAt: new Date("2023-08-18"),
  },
  {
    id: "course4",
    title: "Web Development Fundamentals",
    code: "CS-210",
    description: "Introduction to web technologies and frameworks",
    institution: "State University",
    semester: "fall",
    year: 2023,
    color: "#f59e0b",
    coverImage: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=800&auto=format&fit=crop",
    instructors: [
      {
        name: "Prof. Lisa Montgomery",
        email: "lmontgomery@university.edu",
        photoURL: "https://i.pravatar.cc/300?img=27",
      },
    ],
    schedule: {
      days: ["Wednesday", "Friday"],
      startTime: "09:00",
      endTime: "10:30",
      location: "Innovation Hall, Room 208",
    },
    enrolled: 112,
    progress: 0.82,
    createdAt: new Date("2023-08-10"),
  },
];

// Mock course content data
export const mockCourseContents: Record<string, CourseContent[]> = {
  "course1": [
    {
      id: "content1",
      courseId: "course1",
      type: "lecture",
      title: "Introduction to Machine Learning Concepts",
      description: "Overview of basic machine learning concepts and methodologies",
      files: [
        {
          name: "ml_intro_slides.pdf",
          url: "#",
          type: "pdf",
          size: 2400000,
          uploadedAt: new Date("2023-09-05"),
        },
        {
          name: "ml_reading_week1.pdf",
          url: "#",
          type: "pdf",
          size: 1500000,
          uploadedAt: new Date("2023-09-05"),
        },
      ],
      metadata: {
        chapter: "1",
        topic: "Machine Learning Fundamentals",
        keywords: ["ML", "supervised", "unsupervised", "introduction"],
      },
    },
    {
      id: "content2",
      courseId: "course1",
      type: "assignment",
      title: "Assignment 1: Linear Regression",
      description: "Implement and analyze various linear regression methods",
      dueDate: new Date("2023-09-20"),
      files: [
        {
          name: "linear_regression_assignment.pdf",
          url: "#",
          type: "pdf",
          size: 850000,
          uploadedAt: new Date("2023-09-10"),
        },
      ],
      metadata: {
        chapter: "2",
        topic: "Linear Regression",
        keywords: ["regression", "linear model", "gradient descent"],
      },
    },
  ],
  "course2": [
    {
      id: "content3",
      courseId: "course2",
      type: "lecture",
      title: "Advanced Tree Structures",
      description: "Detailed analysis of balanced tree implementations",
      files: [
        {
          name: "advanced_trees.pptx",
          url: "#",
          type: "pptx",
          size: 3200000,
          uploadedAt: new Date("2023-09-07"),
        },
      ],
      metadata: {
        chapter: "3",
        topic: "Tree Data Structures",
        keywords: ["AVL", "red-black", "B-tree", "tree balancing"],
      },
    },
  ],
};

// Mock AI content
export const mockAIContent: Record<string, AIContent> = {
  "content1": {
    id: "ai1",
    courseContentId: "content1",
    summary: "Machine Learning is a field of study that gives computers the ability to learn without being explicitly programmed. It focuses on developing algorithms that can access data, learn from it, and make predictions or decisions. There are primarily three types of machine learning: supervised learning (where the model is trained on labeled data), unsupervised learning (where the model finds patterns in unlabeled data), and reinforcement learning (where the model learns through trial and error interactions with an environment).\n\nKey algorithms include linear regression, decision trees, support vector machines, neural networks, and clustering algorithms. The field has applications in various domains such as healthcare, finance, marketing, and autonomous vehicles.",
    flashcards: [
      {
        question: "What is Machine Learning?",
        answer: "Machine Learning is a field of study that gives computers the ability to learn without being explicitly programmed.",
      },
      {
        question: "What are the three primary types of machine learning?",
        answer: "Supervised learning, unsupervised learning, and reinforcement learning.",
      },
      {
        question: "What is supervised learning?",
        answer: "A type of machine learning where the model is trained on labeled data.",
      },
    ],
    mcqs: [
      {
        question: "Which of the following is NOT a type of machine learning?",
        options: ["Supervised learning", "Unsupervised learning", "Deterministic learning", "Reinforcement learning"],
        correctOption: 2,
        explanation: "The three main types of machine learning are supervised, unsupervised, and reinforcement learning. 'Deterministic learning' is not a standard category of machine learning.",
      },
      {
        question: "In which type of learning does the model learn through trial and error interactions with an environment?",
        options: ["Supervised learning", "Unsupervised learning", "Semi-supervised learning", "Reinforcement learning"],
        correctOption: 3,
        explanation: "Reinforcement learning involves an agent learning to make decisions by taking actions in an environment to maximize some notion of cumulative reward.",
      },
    ],
    keyConcepts: [
      {
        concept: "Supervised Learning",
        description: "Training a model using labeled examples, such as input-output pairs. The model learns to predict the output from the input data.",
      },
      {
        concept: "Unsupervised Learning",
        description: "Using machine learning algorithms to analyze and cluster unlabeled datasets. These algorithms discover hidden patterns without the need for human intervention.",
      },
      {
        concept: "Feature Engineering",
        description: "The process of selecting and transforming variables to increase the effectiveness of machine learning models.",
      },
    ],
    generatedAt: new Date("2023-09-06"),
  },
};

// Mock API functions
export const fetchCourses = async (): Promise<Course[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCourses), 500);
  });
};

export const fetchCourseById = async (courseId: string): Promise<Course | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCourses.find(course => course.id === courseId)), 300);
  });
};

export const fetchCourseContents = async (courseId: string): Promise<CourseContent[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCourseContents[courseId] || []), 400);
  });
};

export const fetchAIContent = async (contentId: string): Promise<AIContent | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAIContent[contentId]), 700);
  });
};

export const fetchCurrentUser = async (): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(currentUser), 300);
  });
};

// Generate AI Content (mock)
export const generateAIContent = async (text: string, options?: { type: string[] }): Promise<AIContent> => {
  console.log("Generating AI content for text:", text.substring(0, 50) + "...");
  
  // In a real application, this would call an API endpoint to process the text
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `ai${Math.random().toString(36).substring(7)}`,
        courseContentId: "dynamic",
        summary: "This is a dynamically generated AI summary from the provided document...",
        flashcards: [
          {
            question: "What is the main topic of the document?",
            answer: "The document appears to cover key concepts from the course material.",
          },
          {
            question: "What methodology is discussed?",
            answer: "The document discusses various methodologies relevant to the course subject.",
          },
        ],
        mcqs: [
          {
            question: "Which of the following best describes the content?",
            options: ["A theoretical overview", "A practical guide", "A case study", "A research paper"],
            correctOption: 0,
            explanation: "The content appears to be primarily a theoretical overview of the subject matter.",
          },
        ],
        keyConcepts: [
          {
            concept: "Key Concept 1",
            description: "Description of the first key concept extracted from the document.",
          },
          {
            concept: "Key Concept 2",
            description: "Description of the second key concept extracted from the document.",
          },
        ],
        generatedAt: new Date(),
      });
    }, 2000);
  });
};
