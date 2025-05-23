
import { supabase } from '@/lib/supabase';
import type { Course as SupabaseCourse, CourseInsert } from '@/types/supabase';
import { Course } from '@/types';

export const fetchUserCourses = async (userId: string): Promise<Course[]> => {
  try {
    const { data: studentCourses, error: studentCoursesError } = await supabase
      .from('student_courses')
      .select(`
        course_id,
        progress,
        courses (
          id,
          code,
          title,
          description,
          semester,
          year,
          institution,
          department,
          credits,
          color,
          cover_image_url
        )
      `)
      .eq('student_id', userId);

    if (studentCoursesError) {
      throw new Error(studentCoursesError.message);
    }

    // Transform Supabase data to match our Course type
    const courses: Course[] = (studentCourses || []).map((sc: any) => ({
      id: sc.courses.id,
      code: sc.courses.code,
      title: sc.courses.title,
      description: sc.courses.description,
      institution: sc.courses.institution,
      semester: sc.courses.semester,
      year: sc.courses.year,
      enrolled: 0, // We'll need to calculate this separately
      progress: sc.progress || 0,
      instructors: [], // We'll need to add instructor relationships
      schedule: {
        days: [],
        startTime: "",
        endTime: "",
        location: ""
      },
      color: sc.courses.color || "#2563eb",
      coverImage: sc.courses.cover_image_url,
      createdAt: new Date(),
    }));

    return courses;
  } catch (error) {
    console.error('Error fetching user courses:', error);
    return [];
  }
};

export const createCourse = async (courseData: Omit<CourseInsert, 'id' | 'created_at'>): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .insert(courseData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Transform to our Course type
    return {
      id: data.id,
      code: data.code,
      title: data.title,
      description: data.description,
      institution: data.institution,
      semester: data.semester,
      year: data.year,
      enrolled: 0,
      progress: 0,
      instructors: [],
      schedule: {
        days: [],
        startTime: "",
        endTime: "",
        location: ""
      },
      color: data.color || "#2563eb",
      coverImage: data.cover_image_url,
      createdAt: new Date(data.created_at),
    };
  } catch (error) {
    console.error('Error creating course:', error);
    return null;
  }
};

export const enrollInCourse = async (studentId: string, courseId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('student_courses')
      .insert({
        student_id: studentId,
        course_id: courseId,
        role: 'student',
        enrolled_date: new Date().toISOString(),
        progress: 0,
        sync_status: 'synced'
      });

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return false;
  }
};
