
import { StudentFormData } from './studentService';

/**
 * Fallback student service that uses localStorage when database is not available
 */
export const registerStudentFallback = async (studentData: StudentFormData) => {
  try {
    console.log('Using fallback student registration with localStorage');
    
    // Generate a simple ID
    const studentId = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create student record
    const studentRecord = {
      id: studentId,
      ...studentData,
      created_at: new Date().toISOString(),
      sync_status: 'pending',
    };
    
    // Store in localStorage
    const existingStudents = JSON.parse(localStorage.getItem('students') || '[]');
    existingStudents.push(studentRecord);
    localStorage.setItem('students', JSON.stringify(existingStudents));
    
    // Also store current user's student ID
    localStorage.setItem(`student_${studentData.user_id}`, studentId);
    
    console.log('Student registered in localStorage:', studentRecord);
    
    return {
      success: true,
      data: studentRecord,
    };
  } catch (error) {
    console.error('Fallback student registration failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const getStudentByUserIdFallback = async (userId: string) => {
  try {
    const studentId = localStorage.getItem(`student_${userId}`);
    if (!studentId) {
      return { success: true, data: null };
    }
    
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students.find((s: any) => s.id === studentId);
    
    return {
      success: true,
      data: student || null,
    };
  } catch (error) {
    console.error('Failed to fetch student from localStorage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
