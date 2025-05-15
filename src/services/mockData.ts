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
      id: "university-1",
      name: "EduGenius University"
    },
    role: "student",
    gradePrediction: {
      GPA: 3.8,
      predictedGrade: "A-"
    }
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
      department: "Computer Science",
      credits: 3,
      instructor: "Dr. Smith",
      enrolled: 120,
      progress: 0.6,
      schedule: {
        days: ["Monday", "Wednesday", "Friday"],
        startTime: "9:00 AM",
        endTime: "10:00 AM"
      },
      color: "#2563eb",
    },
    {
      id: "course-2",
      code: "MATH201",
      title: "Calculus II",
      description: "A continuation of Calculus I, covering integration, series, and applications.",
      department: "Mathematics",
      credits: 4,
      instructor: "Prof. Johnson",
      enrolled: 85,
      progress: 0.8,
      schedule: {
        days: ["Tuesday", "Thursday"],
        startTime: "10:30 AM",
        endTime: "12:00 PM"
      },
      color: "#db2777",
    },
    {
      id: "course-3",
      code: "ENG102",
      title: "College Writing",
      description: "A course focused on improving writing skills for academic and professional purposes.",
      department: "English",
      credits: 3,
      instructor: "Ms. Williams",
      enrolled: 95,
      progress: 0.4,
      schedule: {
        days: ["Monday", "Wednesday"],
        startTime: "1:30 PM",
        endTime: "2:45 PM"
      },
      coverImage: "https://images.unsplash.com/photo-1507842214779-87a4e9056b2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGl0ZXJhdHVyZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "course-4",
      code: "HIST101",
      title: "World History",
      description: "A survey of major events and themes in world history from ancient times to the present.",
      department: "History",
      credits: 3,
      instructor: "Dr. Brown",
      enrolled: 110,
      progress: 0.7,
      schedule: {
        days: ["Tuesday", "Thursday"],
        startTime: "2:00 PM",
        endTime: "3:15 PM"
      },
      color: "#16a34a",
    },
    {
      id: "course-5",
      code: "PHYS201",
      title: "Physics I",
      description: "An introductory course to classical mechanics, heat, and sound.",
      department: "Physics",
      credits: 4,
      instructor: "Dr. Davis",
      enrolled: 75,
      progress: 0.5,
      schedule: {
        days: ["Monday", "Wednesday", "Friday"],
        startTime: "11:00 AM",
        endTime: "12:00 PM"
      },
      coverImage: "https://images.unsplash.com/photo-1587613865763-5b89261f1518?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBoeXNpY3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "course-6",
      code: "CHEM101",
      title: "General Chemistry",
      description: "A basic course covering the principles of chemistry.",
      department: "Chemistry",
      credits: 4,
      instructor: "Prof. Wilson",
      enrolled: 90,
      progress: 0.9,
      schedule: {
        days: ["Tuesday", "Thursday"],
        startTime: "8:00 AM",
        endTime: "9:30 AM"
      },
      color: "#dc2626",
    },
    {
      id: "course-7",
      code: "ART101",
      title: "Introduction to Art History",
      description: "A survey of the history of art from prehistoric times to the present.",
      department: "Art History",
      credits: 3,
      instructor: "Ms. Martinez",
      enrolled: 65,
      progress: 0.3,
      schedule: {
        days: ["Monday", "Wednesday"],
        startTime: "10:30 AM",
        endTime: "11:45 AM"
      },
      coverImage: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXJ0fGVufDB8fDB8fHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "course-8",
      code: "SOC101",
      title: "Introduction to Sociology",
      description: "An overview of the basic concepts and theories of sociology.",
      department: "Sociology",
      credits: 3,
      instructor: "Dr. Anderson",
      enrolled: 100,
      progress: 0.6,
      schedule: {
        days: ["Friday"],
        startTime: "2:00 PM",
        endTime: "4:30 PM"
      },
      color: "#6d28d9",
    }
  ];
};

// Mock function to simulate generating AI content for a document
export const generateAIContent = async (filename: string): Promise<AIContent> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
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
    ]
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
