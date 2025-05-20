
import { supabase, getServerTimestamp } from '@/lib/supabase';
import type { StudentInsert } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

// Student validation schema
export const studentSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  student_id: z.string().optional(),
  institution: z.string().optional(),
  department: z.string().optional(),
  graduation_year: z.number().int().positive().optional(),
  academic_level: z.enum(['undergraduate', 'graduate', 'phd']).optional(),
  user_id: z.string().uuid(),
});

export type StudentFormData = z.infer<typeof studentSchema>;

/**
 * Register a new student in the system
 * @param studentData - Student information to register
 */
export const registerStudent = async (studentData: StudentFormData) => {
  try {
    // Validate student data
    const validatedData = studentSchema.parse(studentData);
    
    // Prepare data with sync fields
    // Ensure required fields are present
    const newStudent: StudentInsert = {
      ...validatedData,
      email: validatedData.email,        // Explicitly include required fields
      first_name: validatedData.first_name,
      last_name: validatedData.last_name,
      user_id: validatedData.user_id,
      sync_status: 'pending',
      last_synced: getServerTimestamp(),
    };
    
    const { data, error } = await supabase
      .from('students')
      .insert(newStudent)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Error registering student: ${error.message}`);
    }
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Student registration failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Get a student by their user ID
 * @param userId - The user ID to look up
 */
export const getStudentByUserId = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return { success: true, data: null };
      }
      throw new Error(`Error fetching student: ${error.message}`);
    }
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to fetch student:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Update a student's sync status after external sync
 * @param studentId - ID of the student to update
 * @param syncStatus - New sync status
 * @param externalId - External system ID
 */
export const updateStudentSyncStatus = async (
  studentId: string, 
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
      .from('students')
      .update(updateData)
      .eq('id', studentId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Error updating student sync status: ${error.message}`);
    }
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to update student sync status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
