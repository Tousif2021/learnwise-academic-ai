
import { User, Course, AIContent } from "@/types";

// Mock function to simulate fetching current user data
export const fetchCurrentUser = async (): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    id: "user-1",
    displayName: "New User",
    email: "user@example.com",
    photoURL: "https://i.pravatar.cc/150?img=3",
    institution: {
      name: "Your Institution",
      domain: "example.edu",
    },
    createdAt: new Date(),
    lastLogin: new Date()
  };
};

// Mock function to simulate fetching courses data - now returns empty array
export const fetchCourses = async (): Promise<Course[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return empty array - users need to add their own courses
  return [];
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

// Return empty course for fetchCourseById
export const fetchCourseById = async (courseId: string): Promise<Course> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  throw new Error(`Course with ID ${courseId} not found`);
};

// Return empty events
export const fetchCourseEvents = async (courseId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [];
};
