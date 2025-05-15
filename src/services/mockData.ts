
import { User, Course, AIContent } from "@/types";

// Mock function to simulate fetching current user data
export const fetchCurrentUser = async (): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    id: "user-1",
    displayName: "John Doe",
    email: "john.doe@example.com",
    photoURL: "https://i.pravatar.cc/150?img=3",
    institution: {
      name: "EduGenius University",
      domain: "edugenius.edu",
    },
    createdAt: new Date(),
    lastLogin: new Date()
  };
};

// Mock function to simulate fetching courses data
export const fetchCourses = async (): Promise<Course[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return [
    {
      id: "course-1",
      code: "CS101",
      title: "Introduction to Computer Science",
      description: "An introductory course to the fundamental concepts of computer science.",
      institution: "EduGenius University",
      semester: "fall",
      year: 2025,
      enrolled: 120,
      progress: 0.6,
      instructors: [
        {
          name: "Dr. Alan Turing",
          email: "alan.turing@edugenius.edu",
          photoURL: "https://i.pravatar.cc/150?img=11"
        }
      ],
      schedule: {
        days: ["Monday", "Wednesday", "Friday"],
        startTime: "9:00 AM",
        endTime: "10:00 AM",
        location: "Building A, Room 101"
      },
      color: "#2563eb",
      createdAt: new Date(),
    },
    {
      id: "course-2",
      code: "MATH201",
      title: "Calculus II",
      description: "A continuation of Calculus I, covering integration, series, and applications.",
      institution: "EduGenius University",
      semester: "spring",
      year: 2025,
      enrolled: 85,
      progress: 0.8,
      instructors: [
        {
          name: "Dr. Ada Lovelace",
          email: "ada.lovelace@edugenius.edu",
          photoURL: "https://i.pravatar.cc/150?img=5"
        }
      ],
      schedule: {
        days: ["Tuesday", "Thursday"],
        startTime: "10:30 AM",
        endTime: "12:00 PM",
        location: "Building B, Room 202"
      },
      color: "#db2777",
      createdAt: new Date(),
    },
    {
      id: "course-3",
      code: "ENG102",
      title: "College Writing",
      description: "A course focused on improving writing skills for academic and professional purposes.",
      institution: "EduGenius University",
      semester: "fall",
      year: 2025,
      enrolled: 95,
      progress: 0.4,
      instructors: [
        {
          name: "Prof. Emily Dickinson",
          email: "emily.dickinson@edugenius.edu",
          photoURL: "https://i.pravatar.cc/150?img=9"
        }
      ],
      schedule: {
        days: ["Monday", "Wednesday"],
        startTime: "1:30 PM",
        endTime: "2:45 PM",
        location: "Liberal Arts Hall, Room 305"
      },
      coverImage: "https://images.unsplash.com/photo-1507842214779-87a4e9056b2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGl0ZXJhdHVyZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      createdAt: new Date(),
    },
    {
      id: "course-4",
      code: "HIST101",
      title: "World History",
      description: "A survey of major events and themes in world history from ancient times to the present.",
      institution: "EduGenius University",
      semester: "spring",
      year: 2025,
      enrolled: 110,
      progress: 0.7,
      instructors: [
        {
          name: "Dr. Howard Zinn",
          email: "howard.zinn@edugenius.edu",
          photoURL: "https://i.pravatar.cc/150?img=12"
        }
      ],
      schedule: {
        days: ["Tuesday", "Thursday"],
        startTime: "2:00 PM",
        endTime: "3:15 PM",
        location: "History Building, Room 104"
      },
      color: "#16a34a",
      createdAt: new Date(),
    },
    {
      id: "course-5",
      code: "PHYS201",
      title: "Physics I",
      description: "An introductory course to classical mechanics, heat, and sound.",
      institution: "EduGenius University",
      semester: "fall",
      year: 2025,
      enrolled: 75,
      progress: 0.5,
      instructors: [
        {
          name: "Dr. Marie Curie",
          email: "marie.curie@edugenius.edu",
          photoURL: "https://i.pravatar.cc/150?img=6"
        },
        {
          name: "Dr. Richard Feynman",
          email: "richard.feynman@edugenius.edu",
          photoURL: "https://i.pravatar.cc/150?img=13"
        }
      ],
      schedule: {
        days: ["Monday", "Wednesday", "Friday"],
        startTime: "11:00 AM",
        endTime: "12:00 PM",
        location: "Science Center, Room 210"
      },
      coverImage: "https://images.unsplash.com/photo-1587613865763-5b89261f1518?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBoeXNpY3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      createdAt: new Date(),
    },
    {
      id: "course-6",
      code: "CHEM101",
      title: "General Chemistry",
      description: "A basic course covering the principles of chemistry.",
      institution: "EduGenius University",
      semester: "spring",
      year: 2025,
      enrolled: 90,
      progress: 0.9,
      instructors: [
        {
          name: "Dr. Linus Pauling",
          email: "linus.pauling@edugenius.edu",
          photoURL: "https://i.pravatar.cc/150?img=14"
        }
      ],
      schedule: {
        days: ["Tuesday", "Thursday"],
        startTime: "8:00 AM",
        endTime: "9:30 AM",
        location: "Science Center, Room 120"
      },
      color: "#dc2626",
      createdAt: new Date(),
    },
    {
      id: "course-7",
      code: "ART101",
      title: "Introduction to Art History",
      description: "A survey of the history of art from prehistoric times to the present.",
      institution: "EduGenius University",
      semester: "fall",
      year: 2025,
      enrolled: 65,
      progress: 0.3,
      instructors: [
        {
          name: "Prof. Georgia O'Keeffe",
          email: "georgia.okeeffe@edugenius.edu",
          photoURL: "https://i.pravatar.cc/150?img=7"
        }
      ],
      schedule: {
        days: ["Monday", "Wednesday"],
        startTime: "10:30 AM",
        endTime: "11:45 AM",
        location: "Arts Building, Room 301"
      },
      coverImage: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXJ0fGVufDB8fDB8fHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      createdAt: new Date(),
    },
    {
      id: "course-8",
      code: "SOC101",
      title: "Introduction to Sociology",
      description: "An overview of the basic concepts and theories of sociology.",
      institution: "EduGenius University",
      semester: "spring",
      year: 2025,
      enrolled: 100,
      progress: 0.6,
      instructors: [
        {
          name: "Dr. Max Weber",
          email: "max.weber@edugenius.edu",
          photoURL: "https://i.pravatar.cc/150?img=15"
        }
      ],
      schedule: {
        days: ["Friday"],
        startTime: "2:00 PM",
        endTime: "4:30 PM",
        location: "Social Sciences Building, Room 110"
      },
      color: "#6d28d9",
      createdAt: new Date(),
    }
  ];
};

// Mock function to simulate generating AI content for a document
export const generateAIContent = async (filename: string): Promise<AIContent> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    id: `ai-content-${Date.now()}`,
    courseContentId: `content-${Date.now()}`,
    summary: `This is a summary of the document "${filename}". It covers the main points and key arguments presented in the document. The AI has identified the most important information and condensed it into a concise overview.`,
    flashcards: [
      { question: "What is the main topic of this document?", answer: "The main topic is [topic]." },
      { question: "Who are the key figures mentioned in the document?", answer: "The key figures are [figures]." },
      { question: "What are the main arguments presented?", answer: "The main arguments are [arguments]." }
    ],
    mcqs: [
      {
        question: "Which of the following is the main topic of the document?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctOption: 0,
        explanation: "Explanation of why Option A is the correct answer."
      },
      {
        question: "Who is the author of the document?",
        options: ["Author A", "Author B", "Author C", "Author D"],
        correctOption: 2,
        explanation: "Explanation of why Author C is the correct answer."
      }
    ],
    keyConcepts: [
      { concept: "Concept 1", description: "Description of Concept 1." },
      { concept: "Concept 2", description: "Description of Concept 2." },
      { concept: "Concept 3", description: "Description of Concept 3." }
    ],
    generatedAt: new Date()
  };
};

// Add this new function to fetch a course by ID
export const fetchCourseById = async (courseId: string): Promise<Course> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get all courses
  const courses = await fetchCourses();
  
  // Find the course with the matching ID
  const course = courses.find(c => c.id === courseId);
  
  if (!course) {
    throw new Error(`Course with ID ${courseId} not found`);
  }
  
  return course;
};
