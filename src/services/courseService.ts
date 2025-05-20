
import { supabase, getServerTimestamp } from '@/lib/supabase';
import type { CourseInsert, StudentCourseInsert } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

// Course validation schema
export const courseSchema = z.object({
  code: z.string().min(1, 'Course code is required'),
  title: z.string().min(1, 'Course title is required'),
  description: z.string().min(1, 'Course description is required'),
  semester: z.enum(['fall', 'spring', 'summer', 'winter']),
  year: z.number().int().min(2000).max(2100),
  institution: z.string().min(1, 'Institution is required'),
  department: z.string().optional(),
  credits: z.number().int().positive().optional(),
  color: z.string().optional(),
  cover_image_url: z.string().optional(),
});

export type CourseFormData = z.infer<typeof courseSchema>;

/**
 * Add a new course to the system
 * @param courseData - Course information to add
 */
export const addCourse = async (courseData: CourseFormData) => {
  try {
    // Validate course data
    const validatedData = courseSchema.parse(courseData);
    
    // Prepare data with sync fields
    const newCourse: CourseInsert = {
      ...validatedData,
      sync_status: 'pending',
      last_synced: getServerTimestamp(),
    };
    
    const { data, error } = await supabase
      .from('courses')
      .insert(newCourse)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Error adding course: ${error.message}`);
    }
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Course addition failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Get all courses in the system
 */
export const getAllCourses = async () => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Error fetching courses: ${error.message}`);
    }
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Enroll a student in a course
 * @param studentId - ID of the student to enroll
 * @param courseId - ID of the course to enroll in
 * @param role - Role of the student in the course
 */
export const enrollStudentInCourse = async (
  studentId: string,
  courseId: string,
  role: 'student' | 'teaching_assistant' | 'instructor' = 'student'
) => {
  try {
    const enrollment: StudentCourseInsert = {
      student_id: studentId,
      course_id: courseId,
      role,
      enrolled_date: getServerTimestamp(),
      sync_status: 'pending',
    };
    
    const { data, error } = await supabase
      .from('student_courses')
      .insert(enrollment)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Error enrolling student: ${error.message}`);
    }
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to enroll student in course:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Update a course's sync status after external sync
 * @param courseId - ID of the course to update
 * @param syncStatus - New sync status
 * @param externalId - External system ID
 */
export const updateCourseSyncStatus = async (
  courseId: string, 
  syncStatus: 'synced' | 'pending' | 'error',
  externalId?: string
) => {
  try {
    const updateData: Record<string, any> = {
      sync_status: syncStatus,
      last_synced: getServerTimestamp()
    };
    
    if (externalId) {
      updateData.external_id = externalId;
    }
    
    const { data, error } = await supabase
      .from('courses')
      .update(updateData)
      .eq('id', courseId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Error updating course sync status: ${error.message}`);
    }
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to update course sync status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
