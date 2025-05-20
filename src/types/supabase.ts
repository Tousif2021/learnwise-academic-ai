
export interface Database {
  public: {
    Tables: {
      students: {
        Row: Student;
        Insert: StudentInsert;
        Update: Partial<StudentInsert>;
      };
      courses: {
        Row: Course;
        Insert: CourseInsert;
        Update: Partial<CourseInsert>;
      };
      student_courses: {
        Row: StudentCourse;
        Insert: StudentCourseInsert;
        Update: Partial<StudentCourseInsert>;
      };
      documents: {
        Row: Document;
        Insert: DocumentInsert;
        Update: Partial<DocumentInsert>;
      };
      ai_results: {
        Row: AIResult;
        Insert: AIResultInsert;
        Update: Partial<AIResultInsert>;
      };
    };
  };
}

export interface Student {
  id: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  student_id?: string;
  profile_image_url?: string;
  institution?: string;
  department?: string;
  graduation_year?: number;
  academic_level?: 'undergraduate' | 'graduate' | 'phd';
  external_id?: string;
  sync_status?: 'synced' | 'pending' | 'error';
  last_synced?: string;
  user_id: string;
}

export type StudentInsert = Omit<Student, 'id' | 'created_at'>;

export interface Course {
  id: string;
  created_at: string;
  code: string;
  title: string;
  description: string;
  semester: 'fall' | 'spring' | 'summer' | 'winter';
  year: number;
  institution: string;
  department?: string;
  credits?: number;
  color?: string;
  cover_image_url?: string;
  external_id?: string;
  sync_status?: 'synced' | 'pending' | 'error';
  last_synced?: string;
}

export type CourseInsert = Omit<Course, 'id' | 'created_at'>;

export interface StudentCourse {
  id: string;
  created_at: string;
  student_id: string;
  course_id: string;
  role: 'student' | 'teaching_assistant' | 'instructor';
  enrolled_date: string;
  progress?: number;
  sync_status?: 'synced' | 'pending' | 'error';
}

export type StudentCourseInsert = Omit<StudentCourse, 'id' | 'created_at'>;

export interface Document {
  id: string;
  created_at: string;
  name: string;
  type: string;
  size: number;
  url: string;
  course_id?: string;
  student_id: string;
  category?: string;
  processed: boolean;
}

export type DocumentInsert = Omit<Document, 'id' | 'created_at'>;

export interface AIResult {
  id: string;
  created_at: string;
  document_id: string;
  summary?: string;
  flashcards?: any;
  mcqs?: any;
  key_concepts?: any;
  raw_content?: any;
  model_used: string;
}

export type AIResultInsert = Omit<AIResult, 'id' | 'created_at'>;
